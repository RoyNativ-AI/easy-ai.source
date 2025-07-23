#!/usr/bin/env python3
"""
EasyAI Test - Multi-Provider API Test
Tests OpenAI, Anthropic (Claude), and OpenRouter endpoints
"""

import requests
import json
import os
import time
from dotenv import load_dotenv

# Load environment variables from the 1234 directory
load_dotenv('/Users/agentim.ai/Desktop/1234/easyai/config/easyai.env')

def test_openai():
    """Test OpenAI GPT API"""
    print("🤖 Testing OpenAI API...")
    
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("❌ OPENAI_API_KEY not found")
        return
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    data = {
        'model': 'gpt-3.5-turbo',
        'messages': [
            {'role': 'user', 'content': 'Hello from EasyAI test! Please respond with just "OpenAI working ✅"'}
        ],
        'max_tokens': 20
    }
    
    try:
        response = requests.post('https://api.openai.com/v1/chat/completions', 
                               headers=headers, json=data, timeout=30)
        
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            print(f"   Response: {content}")
            print("   ✅ OpenAI API working!")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Exception: {e}")
    
    print("-" * 50)

def test_anthropic():
    """Test Anthropic Claude API"""
    print("🧠 Testing Anthropic Claude API...")
    
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        print("❌ ANTHROPIC_API_KEY not found")
        return
    
    headers = {
        'x-api-key': api_key,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
    }
    
    data = {
        'model': 'claude-3-haiku-20240307',
        'max_tokens': 20,
        'messages': [
            {'role': 'user', 'content': 'Hello from EasyAI test! Please respond with just "Claude working ✅"'}
        ]
    }
    
    try:
        response = requests.post('https://api.anthropic.com/v1/messages', 
                               headers=headers, json=data, timeout=30)
        
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            content = result['content'][0]['text']
            print(f"   Response: {content}")
            print("   ✅ Claude API working!")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Exception: {e}")
    
    print("-" * 50)

def test_openrouter():
    """Test OpenRouter API"""
    print("🔀 Testing OpenRouter API...")
    
    api_key = os.getenv('OPENROUTER_API_KEY')
    if not api_key:
        print("❌ OPENROUTER_API_KEY not found")
        return
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost',
        'X-Title': 'EasyAI Test'
    }
    
    data = {
        'model': 'openai/gpt-3.5-turbo',
        'messages': [
            {'role': 'user', 'content': 'Hello from EasyAI test! Please respond with just "OpenRouter working ✅"'}
        ],
        'max_tokens': 20
    }
    
    try:
        response = requests.post('https://openrouter.ai/api/v1/chat/completions', 
                               headers=headers, json=data, timeout=30)
        
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            print(f"   Response: {content}")
            print("   ✅ OpenRouter API working!")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Exception: {e}")
    
    print("-" * 50)

def main():
    print("=" * 60)
    print("🚀 EasyAI Multi-Provider API Test")
    print("=" * 60)
    print(f"⏰ Test started at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📍 Running from: {os.getcwd()}")
    print("=" * 60)
    
    # Test all three providers
    test_openai()
    time.sleep(2)  # Small delay between tests
    
    test_anthropic()
    time.sleep(2)
    
    test_openrouter()
    
    print("=" * 60)
    print("🎯 Test Results Summary:")
    print("   Check EasyAI dashboard at: http://localhost:7542")
    print("   All API calls should be captured and visible!")
    print("=" * 60)

if __name__ == "__main__":
    main()