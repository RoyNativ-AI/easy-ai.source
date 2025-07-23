"""
EasyAI Python Interceptor - Automatically logs API requests to EasyAI dashboard
"""
import os
import json
import time
import requests
import urllib3
from urllib.parse import urlparse
from requests.adapters import HTTPAdapter
from requests.models import Response

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
        
        if response:
            log_entry.update({
                'status': response.status_code,
                'responseData': response_data,
                'duration': getattr(response, 'elapsed', None).total_seconds() if hasattr(response, 'elapsed') and response.elapsed else 0,
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
        # Log request
        log_to_easyai(
            method=request.method,
            url=request.url,
            body=request.body,
            headers=request.headers
        )
        
        # Send actual request
        response = super().send(request, **kwargs)
        
        # Log response
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
        full_url = f"{self.scheme}://{self.host}:{self.port}{url}"
        log_to_easyai(method, full_url, body, headers)
        response = super().urlopen(method, url, body, headers, **kwargs)
        log_to_easyai(method, full_url, body, headers, response)
        return response

class LoggingHTTPSConnectionPool(urllib3.HTTPSConnectionPool):
    def urlopen(self, method, url, body=None, headers=None, **kwargs):
        full_url = f"{self.scheme}://{self.host}:{self.port}{url}"
        log_to_easyai(method, full_url, body, headers)
        response = super().urlopen(method, url, body, headers, **kwargs)
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