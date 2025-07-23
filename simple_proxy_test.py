#!/usr/bin/env python3
import requests
import os

print("🔍 Checking proxy environment:")
print(f"HTTP_PROXY: {os.environ.get('HTTP_PROXY', 'NOT SET')}")
print(f"HTTPS_PROXY: {os.environ.get('HTTPS_PROXY', 'NOT SET')}")

if not os.environ.get('HTTP_PROXY'):
    print("❌ Proxy not set! Run: source easyai/proxy-env.sh")
    exit(1)

print("\n🧪 Testing with proxy...")
try:
    response = requests.get('https://api.openai.com/v1/models', 
                          headers={'Authorization': 'Bearer sk-test'}, 
                          timeout=5)
    print(f"✅ Request sent (status: {response.status_code})")
except Exception as e:
    print(f"📡 Request sent through proxy: {type(e).__name__}")
    print("✅ This is expected - check proxy logs for capture!")

print("\n💡 Check the proxy terminal for capture messages!")