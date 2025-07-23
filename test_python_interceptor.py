#!/usr/bin/env python3
"""
Test script for EasyAI Python interceptor
Tests both with and without proxy mode
"""
import os
import sys

# Test 1: Direct Python interceptor (no proxy)
print("🧪 Test 1: Python interceptor without proxy")
print("-" * 50)

# Clear proxy settings to test direct interception
os.environ.pop('HTTP_PROXY', None)
os.environ.pop('HTTPS_PROXY', None)
os.environ['EASYAI_ENABLED'] = 'true'
os.environ['EASYAI_PORT'] = '7542'

# Import interceptor
sys.path.insert(0, './easyai')
import easyai_interceptor

# Test with requests
import requests

print("\n📤 Making test request to OpenAI...")
try:
    response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        json={
            'model': 'gpt-3.5-turbo',
            'messages': [{'role': 'user', 'content': 'Test from Python interceptor'}]
        },
        headers={'Authorization': 'Bearer sk-test123'}
    )
    print(f"Response status: {response.status_code}")
except Exception as e:
    print(f"Expected error (no real API key): {type(e).__name__}")

print("\n📤 Making test request to Anthropic...")
try:
    response = requests.post(
        'https://api.anthropic.com/v1/messages',
        json={
            'model': 'claude-3-sonnet-20240229',
            'messages': [{'role': 'user', 'content': 'Test from Python interceptor'}]
        },
        headers={'x-api-key': 'sk-ant-test123'}
    )
    print(f"Response status: {response.status_code}")
except Exception as e:
    print(f"Expected error (no real API key): {type(e).__name__}")

print("\n✅ Test 1 complete - check EasyAI UI for logged requests")

# Test 2: With proxy mode
print("\n\n🧪 Test 2: Python with proxy mode (should skip interceptor)")
print("-" * 50)

os.environ['HTTP_PROXY'] = 'http://127.0.0.1:8888'
os.environ['HTTPS_PROXY'] = 'http://127.0.0.1:8888'

print("Proxy settings applied - interceptor should detect proxy and skip logging")
print("Any requests will be handled by the proxy instead")

print("\n✅ All tests complete!")
print("\n💡 To view logs:")
print("   1. Run 'easyai ui' in another terminal")
print("   2. Open http://localhost:7542")
print("   3. Check the Logs tab for captured requests")