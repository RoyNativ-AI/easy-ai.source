#!/usr/bin/env python3
"""
Quick test to verify MITM logging works
"""
import requests
import urllib3
from dotenv import load_dotenv
import os

# Load environment
load_dotenv('./easyai/config/easyai.env')

# Disable SSL warnings for test
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Use MITM proxy
proxies = {
    'http': 'http://127.0.0.1:8888',
    'https': 'http://127.0.0.1:8888'
}

print("🔍 Quick MITM logging test...")

# Single OpenAI request
try:
    response = requests.post('https://api.openai.com/v1/chat/completions',
                           headers={
                               'Authorization': f'Bearer {os.getenv("OPENAI_API_KEY")}',
                               'Content-Type': 'application/json'
                           },
                           json={
                               'model': 'gpt-3.5-turbo',
                               'messages': [{'role': 'user', 'content': 'Quick test - say "logged!"'}],
                               'max_tokens': 5
                           },
                           proxies=proxies,
                           verify=False,
                           timeout=10)
    
    print(f"✅ API Response: {response.status_code}")
    if response.status_code == 200:
        print(f"   Content: {response.json()['choices'][0]['message']['content']}")
    
except Exception as e:
    print(f"❌ Error: {e}")

print("🔍 Test complete - checking log file...")