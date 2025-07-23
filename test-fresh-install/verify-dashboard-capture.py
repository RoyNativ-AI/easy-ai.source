#!/usr/bin/env python3
"""
Dashboard Verification Test
Simple test to verify what's captured in the EasyAI dashboard
"""

import requests
import json
import os
import time
from dotenv import load_dotenv

# Load environment from this directory
load_dotenv('./easyai/config/easyai.env')

def simple_api_test():
    """
    Simple test with easy-to-identify requests
    """
    print("🔍 SIMPLE DASHBOARD VERIFICATION TEST")
    print("=" * 50)
    print("🎯 Making 3 simple requests that should appear in dashboard")
    print("=" * 50)
    
    # Test 1: Simple OpenAI request
    print("1️⃣ OpenAI Simple Test...")
    try:
        response = requests.post('https://api.openai.com/v1/chat/completions', 
                               headers={
                                   'Authorization': f'Bearer {os.getenv("OPENAI_API_KEY")}',
                                   'Content-Type': 'application/json'
                               },
                               json={
                                   'model': 'gpt-3.5-turbo',
                                   'messages': [{'role': 'user', 'content': 'DASHBOARD TEST: Say "OpenAI captured!"'}],
                                   'max_tokens': 10
                               })
        
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ SUCCESS: {result['choices'][0]['message']['content']}")
        else:
            print(f"   ❌ Error: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Exception: {str(e)[:100]}...")
    
    time.sleep(2)
    
    # Test 2: Simple Claude request
    print("2️⃣ Claude Simple Test...")
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
                                   'messages': [{'role': 'user', 'content': 'DASHBOARD TEST: Say "Claude captured!"'}]
                               })
        
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ SUCCESS: {result['content'][0]['text']}")
        else:
            print(f"   ❌ Error: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Exception: {str(e)[:100]}...")
    
    time.sleep(2)
    
    # Test 3: Simple OpenRouter request
    print("3️⃣ OpenRouter Simple Test...")
    try:
        response = requests.post('https://openrouter.ai/api/v1/chat/completions',
                               headers={
                                   'Authorization': f'Bearer {os.getenv("OPENROUTER_API_KEY")}',
                                   'Content-Type': 'application/json'
                               },
                               json={
                                   'model': 'openai/gpt-3.5-turbo',
                                   'messages': [{'role': 'user', 'content': 'DASHBOARD TEST: Say "OpenRouter captured!"'}],
                                   'max_tokens': 10
                               })
        
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ SUCCESS: {result['choices'][0]['message']['content']}")
        else:
            print(f"   ❌ Error: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Exception: {str(e)[:100]}...")
    
    print("=" * 50)
    print("🎯 TEST COMPLETE!")
    print("=" * 50)
    print("📊 Now check the EasyAI dashboard at: http://localhost:7542")
    print("")
    print("🔍 What to look for:")
    print("   ✅ 3 API requests in the logs")
    print("   ✅ Request details (URLs, methods, status codes)")
    print("   ✅ Response content or at least metadata")
    print("   ✅ Timing and cost information")
    print("")
    print("💡 If you see these requests in the dashboard, then:")
    print("   ✅ EasyAI monitoring is working!")
    print("   ✅ One-command installation succeeded!")
    print("   ✅ Universal monitoring is active!")
    print("=" * 50)

if __name__ == "__main__":
    simple_api_test()