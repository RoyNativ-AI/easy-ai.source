import requests
import os

# Set proxy environment variables
os.environ['HTTP_PROXY'] = 'http://127.0.0.1:8888'
os.environ['HTTPS_PROXY'] = 'http://127.0.0.1:8888'

try:
    # Try a simple test to see if proxy is listening
    response = requests.get('https://api.openai.com/v1/models', 
                          headers={'Authorization': 'Bearer test-key'}, 
                          timeout=5)
    print(f"✅ Success: {response.status_code}")
except requests.exceptions.ProxyError as e:
    print(f"❌ Proxy error: {e}")
except requests.exceptions.RequestException as e:
    print(f"❌ Request error: {e}")