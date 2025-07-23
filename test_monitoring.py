#!/usr/bin/env python3
import requests
import os

print("🧪 Testing EasyAI Universal Monitoring...")

# Set proxy environment variables
os.environ['HTTP_PROXY'] = 'http://127.0.0.1:8888'
os.environ['HTTPS_PROXY'] = 'http://127.0.0.1:8888'

print(f"📡 HTTP_PROXY: {os.environ.get('HTTP_PROXY')}")
print(f"📡 HTTPS_PROXY: {os.environ.get('HTTPS_PROXY')}")

try:
    print("\n1️⃣ Testing OpenAI API (HTTP)...")
    response = requests.get('http://api.openai.com/v1/models', 
                          headers={'Authorization': 'Bearer sk-test-key'}, 
                          timeout=10)
    print(f"   ✅ HTTP Response: {response.status_code}")
    
    print("\n2️⃣ Testing OpenAI API (HTTPS)...")
    response = requests.get('https://api.openai.com/v1/models', 
                          headers={'Authorization': 'Bearer sk-test-key'}, 
                          timeout=10)
    print(f"   ✅ HTTPS Response: {response.status_code}")
    
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n🎯 Check your EasyAI dashboard to see if requests were captured!")