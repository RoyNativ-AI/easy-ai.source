#!/usr/bin/env python3
"""
EasyAI MITM Proxy Test
Tests full HTTPS interception with certificate handling
"""

import requests
import json
import os
import time
import urllib3
from dotenv import load_dotenv

# Load environment variables from the 1234 directory
load_dotenv('/Users/agentim.ai/Desktop/1234/easyai/config/easyai.env')

# Set up proxy configuration
PROXY_URL = 'http://127.0.0.1:8888'
PROXIES = {
    'http': PROXY_URL,
    'https': PROXY_URL
}

# For testing with custom CA certificate
CA_CERT_PATH = '/Users/agentim.ai/Desktop/1234/easyai/mitmproxy/mitmproxy-ca-cert.pem'

def test_with_mitm_proxy():
    print("🔐 Testing with EasyAI MITM Proxy")
    print("This should provide FULL HTTPS content interception")
    print("-" * 60)
    
    # Option 1: Test with custom CA cert (proper way)
    print("🎯 Method 1: Using custom CA certificate (secure)")
    
    if os.path.exists(CA_CERT_PATH):
        print(f"   ✅ CA certificate found: {CA_CERT_PATH}")
        
        # Test OpenAI with CA cert
        print("1️⃣ Testing OpenAI with CA cert...")
        try:
            response = requests.post('https://api.openai.com/v1/chat/completions',
                                   headers={
                                       'Authorization': f'Bearer {os.getenv("OPENAI_API_KEY")}',
                                       'Content-Type': 'application/json'
                                   },
                                   json={
                                       'model': 'gpt-3.5-turbo',
                                       'messages': [{'role': 'user', 'content': 'MITM test - full content capture!'}],
                                       'max_tokens': 15
                                   },
                                   proxies=PROXIES,
                                   verify=CA_CERT_PATH,
                                   timeout=30)
            print(f"   ✅ OpenAI: {response.status_code} - {response.json()['choices'][0]['message']['content']}")
        except Exception as e:
            print(f"   ⚠️  OpenAI with CA cert: {e}")
        
        time.sleep(1)
        
        # Test Anthropic with CA cert
        print("2️⃣ Testing Anthropic with CA cert...")
        try:
            response = requests.post('https://api.anthropic.com/v1/messages',
                                   headers={
                                       'x-api-key': os.getenv('ANTHROPIC_API_KEY'),
                                       'Content-Type': 'application/json',
                                       'anthropic-version': '2023-06-01'
                                   },
                                   json={
                                       'model': 'claude-3-haiku-20240307',
                                       'max_tokens': 15,
                                       'messages': [{'role': 'user', 'content': 'MITM test - full content capture!'}]
                                   },
                                   proxies=PROXIES,
                                   verify=CA_CERT_PATH,
                                   timeout=30)
            print(f"   ✅ Claude: {response.status_code} - {response.json()['content'][0]['text']}")
        except Exception as e:
            print(f"   ⚠️  Claude with CA cert: {e}")
            
    else:
        print(f"   ❌ CA certificate not found: {CA_CERT_PATH}")
    
    print("-" * 60)
    
    # Option 2: Test with SSL verification disabled (for demo purposes)
    print("🎯 Method 2: Disabling SSL verification (demo only)")
    print("   ⚠️  WARNING: Only for testing - not recommended for production")
    
    # Disable SSL warnings for demo
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    time.sleep(1)
    
    # Test OpenRouter with SSL disabled
    print("3️⃣ Testing OpenRouter with SSL disabled...")
    try:
        response = requests.post('https://openrouter.ai/api/v1/chat/completions',
                               headers={
                                   'Authorization': f'Bearer {os.getenv("OPENROUTER_API_KEY")}',
                                   'Content-Type': 'application/json'
                               },
                               json={
                                   'model': 'openai/gpt-3.5-turbo',
                                   'messages': [{'role': 'user', 'content': 'MITM full capture test!'}],
                                   'max_tokens': 15
                               },
                               proxies=PROXIES,
                               verify=False,  # Disable SSL verification
                               timeout=30)
        print(f"   ✅ OpenRouter: {response.status_code} - {response.json()['choices'][0]['message']['content']}")
    except Exception as e:
        print(f"   ❌ OpenRouter error: {e}")
    
    print("-" * 60)
    print("🎯 MITM Proxy Test Results:")
    print("📊 Check EasyAI dashboard at: http://localhost:7542")
    print("🔍 These requests should show FULL request/response content!")
    print("💡 MITM proxy captures everything - headers, body, responses")
    print("")
    print("🔐 For production use:")
    print("   1. Install CA cert in system trust store")
    print("   2. Or use certificate pinning in your applications")

def check_proxy_status():
    print("🔍 Checking MITM Proxy Status...")
    try:
        # Test basic proxy connectivity
        response = requests.get('http://127.0.0.1:8888', timeout=5)
        print("   ✅ Proxy responding on port 8888")
    except:
        print("   ❌ Proxy not responding on port 8888")
        return False
    
    # Check if certificates exist
    if os.path.exists(CA_CERT_PATH):
        print(f"   ✅ CA certificate exists: {CA_CERT_PATH}")
    else:
        print(f"   ❌ CA certificate missing: {CA_CERT_PATH}")
    
    return True

if __name__ == "__main__":
    print("=" * 70)
    print("🔐 EasyAI MITM Proxy Full Content Capture Test")
    print("=" * 70)
    
    if check_proxy_status():
        print()
        test_with_mitm_proxy()
    else:
        print("❌ MITM proxy not ready - please check setup")
    
    print("=" * 70)