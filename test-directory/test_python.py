#!/usr/bin/env python3
"""
Test script to verify EasyAI Python interceptor works
"""
import easyai  # This should initialize the interceptor
import requests
import json
import os

print("Testing EasyAI Python interceptor...")

# Mock API call to a known AI provider
try:
    # This will be intercepted and logged even though it will fail (no API key)
    response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers={'Authorization': 'Bearer test-key-will-fail'},
        json={
            'model': 'gpt-3.5-turbo',
            'messages': [{'role': 'user', 'content': 'Hello!'}]
        },
        timeout=5
    )
except requests.exceptions.RequestException as e:
    print(f"Expected error (no valid API key): {e}")

# Check if the log file was created and contains our request
log_file = 'easyai/logs/calls.jsonl'
if os.path.exists(log_file):
    print(f"\n✅ Log file created: {log_file}")
    
    with open(log_file, 'r') as f:
        content = f.read().strip()
        if content:
            print("✅ Log file contains data:")
            lines = content.split('\n')
            for i, line in enumerate(lines[-3:], 1):  # Show last 3 lines
                try:
                    data = json.loads(line)
                    print(f"  Entry {i}: {data.get('method', 'N/A')} {data.get('url', 'N/A')}")
                    if 'requestBody' in data and data['requestBody']:
                        print(f"    Request captured: ✅")
                    if 'provider' in data:
                        print(f"    Provider: {data['provider']}")
                except json.JSONDecodeError:
                    print(f"  Entry {i}: {line[:50]}...")
        else:
            print("❌ Log file is empty")
else:
    print(f"❌ Log file not found: {log_file}")

print("\nPython interceptor test completed!")