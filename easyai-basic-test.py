#!/usr/bin/env python3
"""
EasyAI Basic Monitoring Test
Tests API monitoring without MITM proxy (should still capture metadata)
"""

import requests
import json
import os
import time
from dotenv import load_dotenv

# Load environment variables from the 1234 directory
load_dotenv('/Users/agentim.ai/Desktop/1234/easyai/config/easyai.env')

# For basic monitoring test - just use direct requests
def test_with_basic_monitoring():
    print("🔍 Testing with EasyAI Basic Monitoring")
    print("This should be captured by the smart proxy running on port 8888")
    print("-" * 60)
    
    # Test OpenAI
    print("1️⃣ Testing OpenAI...")
    try:
        response = requests.post('https://api.openai.com/v1/chat/completions', 
                               headers={
                                   'Authorization': f'Bearer {os.getenv("OPENAI_API_KEY")}',
                                   'Content-Type': 'application/json'
                               },
                               json={
                                   'model': 'gpt-3.5-turbo',
                                   'messages': [{'role': 'user', 'content': 'Test from EasyAI basic monitoring'}],
                                   'max_tokens': 10
                               })
        print(f"   ✅ OpenAI: {response.status_code} - {response.json()['choices'][0]['message']['content']}")
    except Exception as e:
        print(f"   ❌ OpenAI error: {e}")
    
    time.sleep(1)
    
    # Test Anthropic
    print("2️⃣ Testing Anthropic...")
    try:
        response = requests.post('https://api.anthropic.com/v1/messages',
                               headers={
                                   'x-api-key': os.getenv('ANTHROPIC_API_KEY'),
                                   'Content-Type': 'application/json',
                                   'anthropic-version': '2023-06-01'
                               },
                               json={
                                   'model': 'claude-3-haiku-20240307',
                                   'max_tokens': 10,
                                   'messages': [{'role': 'user', 'content': 'Test from EasyAI basic monitoring'}]
                               })
        print(f"   ✅ Claude: {response.status_code} - {response.json()['content'][0]['text']}")
    except Exception as e:
        print(f"   ❌ Claude error: {e}")
    
    time.sleep(1)
    
    # Test OpenRouter
    print("3️⃣ Testing OpenRouter...")
    try:
        response = requests.post('https://openrouter.ai/api/v1/chat/completions',
                               headers={
                                   'Authorization': f'Bearer {os.getenv("OPENROUTER_API_KEY")}',
                                   'Content-Type': 'application/json'
                               },
                               json={
                                   'model': 'openai/gpt-3.5-turbo',
                                   'messages': [{'role': 'user', 'content': 'Test from EasyAI basic monitoring'}],
                                   'max_tokens': 10
                               })
        print(f"   ✅ OpenRouter: {response.status_code} - {response.json()['choices'][0]['message']['content']}")
    except Exception as e:
        print(f"   ❌ OpenRouter error: {e}")
    
    print("-" * 60)
    print("🎯 All requests completed!")
    print("📊 Check EasyAI dashboard at: http://localhost:7542")
    print("💡 These requests should appear in the logs/dashboard")
    print("   (Basic monitoring captures metadata even without MITM)")

if __name__ == "__main__":
    test_with_basic_monitoring()