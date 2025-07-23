#!/usr/bin/env python3
"""
Full Request Body Capture Test
Tests that EasyAI captures COMPLETE request/response bodies via MITM proxy
"""

import requests
import json
import os
import time
import urllib3
from dotenv import load_dotenv

# Load environment from this directory
load_dotenv('./easyai/config/easyai.env')

# MITM proxy configuration
PROXY_URL = 'http://127.0.0.1:8888'
PROXIES = {
    'http': PROXY_URL,
    'https': PROXY_URL
}

# CA certificate path
CA_CERT_PATH = './easyai/mitmproxy/mitmproxy-ca-cert.pem'

def test_full_request_body_capture():
    print("🔍 TESTING FULL REQUEST BODY CAPTURE")
    print("=" * 60)
    
    # Disable SSL warnings for this test
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    print("🎯 This test sends SPECIFIC content that should be captured:")
    print("   - Complex JSON request bodies")
    print("   - Custom headers")
    print("   - Detailed API responses")
    print("=" * 60)
    
    # Test 1: OpenAI with detailed request
    print("1️⃣ Testing OpenAI - Complex Request Body")
    detailed_openai_request = {
        'model': 'gpt-3.5-turbo',
        'messages': [
            {
                'role': 'system', 
                'content': 'You are a helpful assistant. This is a FULL CAPTURE TEST for EasyAI monitoring.'
            },
            {
                'role': 'user', 
                'content': 'Please respond with: "FULL REQUEST CAPTURED BY EASYAI" followed by the current time.'
            }
        ],
        'max_tokens': 50,
        'temperature': 0.7,
        'top_p': 1.0,
        'frequency_penalty': 0.0,
        'presence_penalty': 0.0
    }
    
    try:
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {os.getenv("OPENAI_API_KEY")}',
                'Content-Type': 'application/json',
                'X-Test-Header': 'EasyAI-Full-Capture-Test',
                'User-Agent': 'EasyAI-MITM-Test/1.0'
            },
            json=detailed_openai_request,
            proxies=PROXIES,
            verify=False,  # For testing purposes
            timeout=30
        )
        
        print(f"   ✅ Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Response: {result['choices'][0]['message']['content']}")
            print(f"   📊 Usage: {result.get('usage', 'N/A')}")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Exception: {e}")
    
    print("-" * 60)
    time.sleep(2)
    
    # Test 2: Anthropic with detailed request
    print("2️⃣ Testing Anthropic Claude - Complex Request Body")
    detailed_claude_request = {
        'model': 'claude-3-haiku-20240307',
        'max_tokens': 50,
        'temperature': 0.5,
        'messages': [
            {
                'role': 'user',
                'content': 'This is a FULL BODY CAPTURE TEST. Please respond with: "CLAUDE REQUEST FULLY CAPTURED BY EASYAI" and mention this test timestamp.'
            }
        ],
        'metadata': {
            'user_id': 'easyai-test-user',
            'test_type': 'full-capture'
        }
    }
    
    try:
        response = requests.post(
            'https://api.anthropic.com/v1/messages',
            headers={
                'x-api-key': os.getenv('ANTHROPIC_API_KEY'),
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'X-Test-Scenario': 'EasyAI-MITM-Full-Capture',
                'User-Agent': 'EasyAI-MITM-Test/1.0'
            },
            json=detailed_claude_request,
            proxies=PROXIES,
            verify=False,
            timeout=30
        )
        
        print(f"   ✅ Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Response: {result['content'][0]['text']}")
            print(f"   📊 Usage: {result.get('usage', 'N/A')}")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Exception: {e}")
    
    print("-" * 60)
    time.sleep(2)
    
    # Test 3: OpenRouter with detailed request
    print("3️⃣ Testing OpenRouter - Complex Request Body")
    detailed_openrouter_request = {
        'model': 'openai/gpt-3.5-turbo',
        'messages': [
            {
                'role': 'system',
                'content': 'This is an EasyAI monitoring system test. You must respond accurately.'
            },
            {
                'role': 'user',
                'content': 'FULL BODY CAPTURE TEST: Please respond with "OPENROUTER REQUEST COMPLETELY CAPTURED BY EASYAI" plus current details.'
            }
        ],
        'max_tokens': 50,
        'temperature': 0.3,
        'stream': False,
        'top_p': 0.9
    }
    
    try:
        response = requests.post(
            'https://openrouter.ai/api/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {os.getenv("OPENROUTER_API_KEY")}',
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost',
                'X-Title': 'EasyAI Full Capture Test',
                'X-Test-ID': 'easyai-mitm-full-capture-test',
                'User-Agent': 'EasyAI-MITM-Test/1.0'
            },
            json=detailed_openrouter_request,
            proxies=PROXIES,
            verify=False,
            timeout=30
        )
        
        print(f"   ✅ Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Response: {result['choices'][0]['message']['content']}")
            print(f"   📊 Usage: {result.get('usage', 'N/A')}")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Exception: {e}")
    
    print("=" * 60)
    print("🎯 FULL CAPTURE TEST COMPLETE!")
    print("=" * 60)
    print("📊 Dashboard Check: http://localhost:7542")
    print("")
    print("🔍 What to verify in the dashboard:")
    print("   ✅ Complete JSON request bodies (not just metadata)")
    print("   ✅ All custom headers (X-Test-Header, X-Test-Scenario, etc.)")
    print("   ✅ Full response content (not truncated)")
    print("   ✅ Token usage and cost information")
    print("   ✅ Request timing and status codes")
    print("")
    print("💡 If you see the full JSON request bodies in the dashboard,")
    print("   then MITM proxy is capturing EVERYTHING successfully!")
    print("=" * 60)

def check_mitm_status():
    print("🔍 Checking MITM Setup Status...")
    
    # Check if MITM proxy is running
    try:
        response = requests.get('http://127.0.0.1:8888', timeout=2)
        print("   ✅ MITM proxy is running on port 8888")
    except:
        print("   ❌ MITM proxy not responding")
        return False
    
    # Check if certificates exist
    if os.path.exists(CA_CERT_PATH):
        print(f"   ✅ CA certificate exists: {CA_CERT_PATH}")
    else:
        print(f"   ❌ CA certificate missing: {CA_CERT_PATH}")
    
    # Check API keys
    if os.getenv('OPENAI_API_KEY'):
        print("   ✅ OpenAI API key loaded")
    else:
        print("   ❌ OpenAI API key missing")
    
    if os.getenv('ANTHROPIC_API_KEY'):
        print("   ✅ Anthropic API key loaded")
    else:
        print("   ❌ Anthropic API key missing")
    
    if os.getenv('OPENROUTER_API_KEY'):
        print("   ✅ OpenRouter API key loaded")
    else:
        print("   ❌ OpenRouter API key missing")
    
    return True

if __name__ == "__main__":
    print("🚀 EasyAI FULL REQUEST BODY CAPTURE TEST")
    print("🎯 Testing complete HTTPS interception and monitoring")
    print("")
    
    if check_mitm_status():
        print("")
        test_full_request_body_capture()
    else:
        print("❌ MITM setup incomplete - please check configuration")
    
    print("\n🎉 Test complete! Check the dashboard for full request capture.")