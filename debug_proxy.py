import requests
import os

# Set proxy environment variables
os.environ['HTTP_PROXY'] = 'http://127.0.0.1:8888'
os.environ['HTTPS_PROXY'] = 'http://127.0.0.1:8888'

print("🧪 Testing proxy with OpenAI API...")
print(f"HTTP_PROXY: {os.environ.get('HTTP_PROXY')}")
print(f"HTTPS_PROXY: {os.environ.get('HTTPS_PROXY')}")

try:
    # Test with a real OpenAI endpoint but invalid key
    response = requests.get('https://api.openai.com/v1/models', 
                          headers={'Authorization': 'Bearer sk-invalid-key-for-testing'}, 
                          timeout=10)
    print(f"✅ Response received: {response.status_code}")
    print(f"Response length: {len(response.text)}")
except Exception as e:
    print(f"❌ Error: {e}")
    print(f"Error type: {type(e)}")

print("\n🧪 Testing proxy with HTTP request...")
try:
    # Test with HTTP (not HTTPS) to see if it works
    response = requests.get('http://api.openai.com/v1/models', 
                          headers={'Authorization': 'Bearer sk-test'}, 
                          timeout=10)
    print(f"✅ HTTP Response: {response.status_code}")
except Exception as e:
    print(f"❌ HTTP Error: {e}")