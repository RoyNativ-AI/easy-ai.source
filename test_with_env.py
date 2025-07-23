#!/usr/bin/env python3
import requests
import os
from pathlib import Path

# Auto-load proxy settings from easyai.env
def load_easyai_env():
    # Look for easyai.env file
    env_file = Path('easyai/config/easyai.env')
    if not env_file.exists():
        print("❌ easyai.env not found!")
        return
    
    # Load environment variables from file
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if '=' in line and not line.startswith('#'):
                key, value = line.split('=', 1)
                os.environ[key] = value
    
    print("🔑 Loaded proxy settings from easyai.env")
    print(f"📡 HTTP_PROXY: {os.environ.get('HTTP_PROXY')}")
    print(f"📡 HTTPS_PROXY: {os.environ.get('HTTPS_PROXY')}")

# Load the settings
load_easyai_env()

print("\n🧪 Testing API requests with auto-loaded proxy...")

try:
    print("\n1️⃣ Testing OpenAI API...")
    response = requests.get('https://api.openai.com/v1/models', 
                          headers={'Authorization': f"Bearer {os.environ.get('OPENAI_API_KEY')}"}, 
                          timeout=10)
    print(f"   ✅ Response: {response.status_code}")
    
    print("\n2️⃣ Testing Anthropic API...")
    response = requests.get('https://api.anthropic.com/v1/models', 
                          headers={'x-api-key': os.environ.get('ANTHROPIC_API_KEY')}, 
                          timeout=10)
    print(f"   ✅ Response: {response.status_code}")
    
except Exception as e:
    print(f"   📡 Request sent through proxy: {type(e).__name__}: {e}")
    print("   ✅ Check proxy logs for capture!")

print("\n💡 Check your proxy terminal for capture messages!")