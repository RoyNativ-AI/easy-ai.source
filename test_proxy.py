#!/usr/bin/env python3
import requests
import os

print("Testing proxy with environment variables:")
print(f"HTTP_PROXY: {os.getenv('HTTP_PROXY')}")
print(f"HTTPS_PROXY: {os.getenv('HTTPS_PROXY')}")

try:
    # Test with proxy environment variables set
    response = requests.get('http://api.openai.com/v1/models', 
                          headers={'Authorization': 'Bearer test'}, 
                          timeout=5)
    print(f"Request succeeded: {response.status_code}")
except Exception as e:
    print(f"Request failed: {e}")