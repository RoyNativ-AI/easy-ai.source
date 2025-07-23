"""
EasyAI Python Interceptor - Automatically logs API requests to EasyAI dashboard
"""
import os
import json
import time
import requests
import urllib3
import inspect
import traceback
import glob
from urllib.parse import urlparse
from requests.adapters import HTTPAdapter
from requests.models import Response
from difflib import SequenceMatcher

EASYAI_PORT = os.environ.get('EASYAI_PORT', '7542')
EASYAI_ENABLED = os.environ.get('EASYAI_ENABLED', 'true').lower() == 'true'
EASYAI_PROXY_ENABLED = os.environ.get('EASYAI_PROXY_ENABLED', 'false').lower() == 'true'

# Track if we're running via proxy to avoid duplicates
def is_proxy_active():
    """Check if requests are going through EasyAI proxy"""
    # Check if proxy environment variables are set
    http_proxy = os.environ.get('HTTP_PROXY', '').lower()
    https_proxy = os.environ.get('HTTPS_PROXY', '').lower()
    
    # Check if they point to our proxy
    return ('127.0.0.1:8888' in http_proxy or 'localhost:8888' in http_proxy or
            '127.0.0.1:8888' in https_proxy or 'localhost:8888' in https_proxy)

def should_log_request(url):
    """Check if we should log this request"""
    if not EASYAI_ENABLED:
        return False
    
    parsed = urlparse(url)
    provider = get_provider_from_url(parsed.netloc)
    
    # Log all known AI provider requests
    return provider != 'unknown'

def get_provider_from_url(netloc):
    """Determine provider from URL"""
    if 'openai.com' in netloc:
        return 'openai'
    elif 'anthropic.com' in netloc:
        return 'anthropic'
    elif 'api.groq.com' in netloc:
        return 'groq'
    elif 'openrouter.ai' in netloc:
        return 'openrouter'
    elif 'generativelanguage.googleapis.com' in netloc or 'aiplatform.googleapis.com' in netloc:
        return 'google'
    elif 'localhost' in netloc or '127.0.0.1' in netloc:
        # Check if it's Ollama by port
        if ':11434' in netloc:
            return 'ollama'
    return 'unknown'

# ===== PROMPT ANALYSIS FUNCTIONS =====

def extract_prompt_from_request(request_body):
    """Extract prompt text from API request body"""
    if not request_body:
        return None
    
    try:
        # Handle different API formats
        if isinstance(request_body, dict):
            # OpenAI/OpenRouter format
            if 'messages' in request_body and isinstance(request_body['messages'], list):
                messages = request_body['messages']
                if messages:
                    # Get the last user message or concatenate all messages
                    prompt_parts = []
                    for msg in messages:
                        if isinstance(msg, dict) and 'content' in msg:
                            role = msg.get('role', 'user')
                            content = msg['content']
                            if role == 'system':
                                prompt_parts.append(f"[SYSTEM] {content}")
                            elif role == 'user':
                                prompt_parts.append(content)
                            elif role == 'assistant':
                                prompt_parts.append(f"[ASSISTANT] {content}")
                    return '\n'.join(prompt_parts)
            
            # Anthropic format
            elif 'messages' in request_body:
                messages = request_body['messages']
                if messages and isinstance(messages, list):
                    prompt_parts = []
                    for msg in messages:
                        if isinstance(msg, dict) and 'content' in msg:
                            prompt_parts.append(msg['content'])
                    return '\n'.join(prompt_parts)
            
            # Direct prompt field (some APIs)
            elif 'prompt' in request_body:
                return request_body['prompt']
            
            # Google format
            elif 'contents' in request_body:
                contents = request_body['contents']
                if isinstance(contents, list) and contents:
                    prompt_parts = []
                    for content in contents:
                        if isinstance(content, dict) and 'parts' in content:
                            for part in content['parts']:
                                if isinstance(part, dict) and 'text' in part:
                                    prompt_parts.append(part['text'])
                    return '\n'.join(prompt_parts)
    except Exception:
        pass
    
    return None

def find_easyai_directory():
    """Find the easyai directory in the current project"""
    current_dir = os.getcwd()
    
    # Look for easyai directory in current and parent directories
    for _ in range(5):  # Search up to 5 levels up
        easyai_path = os.path.join(current_dir, 'easyai')
        if os.path.exists(easyai_path) and os.path.isdir(easyai_path):
            return easyai_path
        current_dir = os.path.dirname(current_dir)
        if current_dir == os.path.dirname(current_dir):  # Reached root
            break
    
    return None

def scan_prompt_library():
    """Scan the EasyAI prompt library and return all prompts"""
    easyai_dir = find_easyai_directory()
    if not easyai_dir:
        return []
    
    prompts_dir = os.path.join(easyai_dir, 'prompts')
    if not os.path.exists(prompts_dir):
        return []
    
    prompts = []
    
    # Find all .md files in prompts directory
    for root, dirs, files in os.walk(prompts_dir):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, easyai_dir)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # Extract prompt name from filename
                    prompt_name = os.path.splitext(file)[0]
                    
                    # Get category from directory structure
                    category = os.path.basename(root) if root != prompts_dir else 'root'
                    
                    prompts.append({
                        'name': prompt_name,
                        'category': category,
                        'file': relative_path,
                        'content': content,
                        'content_clean': content.lower().strip()
                    })
                except Exception:
                    continue
    
    return prompts

def calculate_similarity(text1, text2):
    """Calculate similarity between two texts"""
    if not text1 or not text2:
        return 0.0
    
    # Clean texts for comparison
    clean1 = text1.lower().strip()
    clean2 = text2.lower().strip()
    
    # Use SequenceMatcher for similarity
    return SequenceMatcher(None, clean1, clean2).ratio()

def find_prompt_library_match(prompt_text, prompts_cache=None):
    """Find matching prompt in the library"""
    if not prompt_text:
        return None
    
    # Use cached prompts if available, otherwise scan
    prompts = prompts_cache if prompts_cache is not None else scan_prompt_library()
    
    if not prompts:
        return None
    
    best_match = None
    best_score = 0.0
    similarity_threshold = 0.7  # Minimum similarity to consider a match
    
    prompt_clean = prompt_text.lower().strip()
    
    for prompt in prompts:
        # Calculate similarity with the prompt content
        similarity = calculate_similarity(prompt_clean, prompt['content_clean'])
        
        if similarity > best_score and similarity >= similarity_threshold:
            best_score = similarity
            best_match = {
                'name': prompt['name'],
                'category': prompt['category'],
                'file': prompt['file'],
                'confidence': similarity
            }
    
    return best_match

def get_code_location():
    """Get the location in user code where the API call originated"""
    try:
        # Get the current stack
        stack = inspect.stack()
        
        # Look for the first frame that's not part of this interceptor or requests library
        for frame_info in stack:
            filename = frame_info.filename
            function_name = frame_info.function
            line_number = frame_info.lineno
            
            # Skip internal frames
            if (filename.endswith('easyai_interceptor.py') or 
                'requests' in filename or 
                'urllib3' in filename or
                'http' in filename.lower() or
                'ssl' in filename.lower()):
                continue
            
            # Skip Python standard library
            if '/lib/python' in filename or '/Library/Frameworks/Python' in filename:
                continue
            
            # This looks like user code
            return {
                'file': filename,
                'function': function_name,
                'line': line_number
            }
    except Exception:
        pass
    
    return None

def analyze_prompt(request_body, prompts_cache=None):
    """Analyze a prompt to determine its source and characteristics"""
    # Extract prompt text
    prompt_text = extract_prompt_from_request(request_body)
    if not prompt_text:
        return None
    
    # Find library match
    library_match = find_prompt_library_match(prompt_text, prompts_cache)
    
    # Get code location
    code_location = get_code_location()
    
    # Determine source type
    source = 'unknown'
    if library_match:
        if library_match['confidence'] >= 0.9:
            source = 'library'
        elif library_match['confidence'] >= 0.7:
            source = 'mixed'  # Partially matches library prompt
    else:
        source = 'hardcoded'
    
    # Create analysis result
    analysis = {
        'source': source,
        'prompt_preview': prompt_text[:200] + '...' if len(prompt_text) > 200 else prompt_text
    }
    
    if library_match:
        analysis['library_match'] = library_match
    
    if code_location:
        analysis['code_location'] = code_location
    
    return analysis

# Cache for prompt library to avoid rescanning on every request
_prompt_library_cache = None
_cache_timestamp = 0

def get_cached_prompt_library():
    """Get cached prompt library, refresh if needed"""
    global _prompt_library_cache, _cache_timestamp
    
    current_time = time.time()
    # Refresh cache every 60 seconds
    if _prompt_library_cache is None or (current_time - _cache_timestamp) > 60:
        _prompt_library_cache = scan_prompt_library()
        _cache_timestamp = current_time
    
    return _prompt_library_cache

def log_to_easyai(method, url, body, headers, response=None):
    """Send request log to EasyAI server and file"""
    if not should_log_request(url):
        return
    
    try:
        # Parse URL to get provider
        parsed = urlparse(url)
        provider = get_provider_from_url(parsed.netloc)
        
        # Parse request body (try JSON first, then string)
        request_body = None
        if body:
            try:
                if isinstance(body, bytes):
                    body_text = body.decode('utf-8')
                else:
                    body_text = str(body)
                
                # Try to parse as JSON
                if body_text.strip():
                    request_body = json.loads(body_text)
            except (json.JSONDecodeError, UnicodeDecodeError):
                # Fallback to raw text
                request_body = body_text if 'body_text' in locals() else str(body)
        
        # Parse response body
        response_data = None
        if response:
            try:
                response_text = response.text
                if response_text.strip():
                    response_data = json.loads(response_text)
            except (json.JSONDecodeError, AttributeError):
                response_data = response_text if 'response_text' in locals() else None
        
        # Analyze prompt if this is a request (not a response)
        prompt_analysis = None
        if not response:  # This is the request logging
            try:
                prompts_cache = get_cached_prompt_library()
                prompt_analysis = analyze_prompt(request_body, prompts_cache)
            except Exception as e:
                # Don't let prompt analysis errors break the logging
                pass
        
        # Prepare log data for file
        log_entry = {
            'timestamp': time.time() * 1000,
            'provider': provider,
            'method': method,
            'url': url,
            'headers': dict(headers) if headers else {},
            'requestBody': request_body,
            'source': 'python-interceptor'
        }
        
        # Add prompt analysis if available
        if prompt_analysis:
            log_entry['prompt_analysis'] = prompt_analysis
        
        if response:
            # Get duration from our custom tracking or fallback to requests.elapsed
            duration = 0
            if hasattr(response, '_easyai_duration'):
                duration = response._easyai_duration
            elif hasattr(response, 'elapsed') and response.elapsed:
                duration = response.elapsed.total_seconds()
            
            log_entry.update({
                'status': response.status_code,
                'responseData': response_data,
                'duration': duration,
                'type': 'response'
            })
        else:
            log_entry['type'] = 'request'
        
        # ALWAYS write to file first (primary logging)
        log_to_file(log_entry)
        
        # Also try to send to server if running
        try:
            # Use a new session to avoid recursion
            import requests as raw_requests
            raw_requests.post(
                f'http://localhost:{EASYAI_PORT}/api/logs',
                json=log_entry,
                timeout=0.5
            )
        except:
            pass  # Server might not be running - that's ok, file logging is primary
        
    except Exception as e:
        # Log errors to file for debugging but don't break user's code
        try:
            error_entry = {
                'timestamp': time.time() * 1000,
                'error': f'EasyAI interceptor error: {str(e)}',
                'url': url,
                'method': method
            }
            log_to_file(error_entry)
        except:
            pass

def log_to_file(log_entry):
    """Write log entry to easyai/logs/calls.jsonl"""
    try:
        # Find the easyai directory
        log_paths = [
            os.path.join(os.getcwd(), 'easyai', 'logs', 'calls.jsonl'),
            os.path.join(os.getcwd(), '.easyai', 'logs', 'calls.jsonl'),
        ]
        
        for log_path in log_paths:
            if os.path.exists(os.path.dirname(log_path)):
                with open(log_path, 'a') as f:
                    f.write(json.dumps(log_entry) + '\n')
                    f.flush()
                break
    except Exception:
        pass

class LoggingHTTPAdapter(HTTPAdapter):
    """Custom adapter that logs all requests"""
    
    def send(self, request, **kwargs):
        import time
        
        # Record start time
        start_time = time.time()
        
        # Log request
        log_to_easyai(
            method=request.method,
            url=request.url,
            body=request.body,
            headers=request.headers
        )
        
        # Send actual request
        response = super().send(request, **kwargs)
        
        # Calculate duration
        end_time = time.time()
        duration_seconds = end_time - start_time
        
        # Add duration to response object for logging
        response._easyai_duration = duration_seconds
        
        # Log response with duration
        log_to_easyai(
            method=request.method,
            url=request.url,
            body=request.body,
            headers=request.headers,
            response=response
        )
        
        return response

# Monkey-patch requests.Session
_original_session = requests.Session

class LoggingSession(requests.Session):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Mount our logging adapter for all protocols
        self.mount('http://', LoggingHTTPAdapter())
        self.mount('https://', LoggingHTTPAdapter())

# Replace the Session class
requests.Session = LoggingSession

# Also patch direct requests methods
def patch_direct_methods():
    """Patch direct requests.get/post/etc to use logging session"""
    import requests.api
    
    def create_patched_method(original_method):
        def patched_method(*args, **kwargs):
            with LoggingSession() as session:
                # Extract method name from the original function
                method_name = original_method.__name__.upper()
                # Use the session's method directly instead of request()
                return getattr(session, original_method.__name__)(*args, **kwargs)
        return patched_method
    
    # Patch all HTTP methods
    for method in ['get', 'post', 'put', 'delete', 'patch', 'head', 'options']:
        if hasattr(requests, method):
            setattr(requests, method, create_patched_method(getattr(requests, method)))

patch_direct_methods()

# Auto-patch urllib3 for SDKs that use it directly
class LoggingHTTPConnectionPool(urllib3.HTTPConnectionPool):
    def urlopen(self, method, url, body=None, headers=None, **kwargs):
        import time
        
        full_url = f"{self.scheme}://{self.host}:{self.port}{url}"
        start_time = time.time()
        
        log_to_easyai(method, full_url, body, headers)
        response = super().urlopen(method, url, body, headers, **kwargs)
        
        # Calculate and add duration
        end_time = time.time()
        duration_seconds = end_time - start_time
        response._easyai_duration = duration_seconds
        
        log_to_easyai(method, full_url, body, headers, response)
        return response

class LoggingHTTPSConnectionPool(urllib3.HTTPSConnectionPool):
    def urlopen(self, method, url, body=None, headers=None, **kwargs):
        import time
        
        full_url = f"{self.scheme}://{self.host}:{self.port}{url}"
        start_time = time.time()
        
        log_to_easyai(method, full_url, body, headers)
        response = super().urlopen(method, url, body, headers, **kwargs)
        
        # Calculate and add duration
        end_time = time.time()
        duration_seconds = end_time - start_time
        response._easyai_duration = duration_seconds
        
        log_to_easyai(method, full_url, body, headers, response)
        return response

# Replace urllib3 pool classes
urllib3.HTTPConnectionPool = LoggingHTTPConnectionPool
urllib3.HTTPSConnectionPool = LoggingHTTPSConnectionPool

# Load environment variables from easyai.env if it exists
def load_easyai_env():
    """Load API keys from easyai.env file"""
    # Try to find easyai.env in common locations
    possible_paths = [
        os.path.join(os.getcwd(), 'easyai', 'config', 'easyai.env'),
        os.path.join(os.getcwd(), '.easyai', 'config', 'easyai.env'),
        os.path.join(os.path.dirname(__file__), '..', 'config', 'easyai.env'),
    ]
    
    for env_path in possible_paths:
        if os.path.exists(env_path):
            try:
                with open(env_path, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            key, value = line.split('=', 1)
                            key = key.strip()
                            value = value.strip()
                            # Only set if not already in environment
                            if key and value and not os.environ.get(key):
                                os.environ[key] = value
                break
            except Exception:
                pass

# Load environment on import
load_easyai_env()

# Print status message
print(f"[EasyAI] Python interceptor active - logging to easyai/logs/calls.jsonl")