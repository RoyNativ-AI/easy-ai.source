"""
EasyAI - Simple Auto-Capture for AI API Monitoring

Just import this module to automatically start logging AI API requests:
    import easyai

All requests to AI providers (OpenAI, Anthropic, Google, etc.) will be 
automatically logged to easyai/logs/calls.jsonl
"""

import os
import sys

# Only initialize once
if not hasattr(sys, '_easyai_initialized'):
    sys._easyai_initialized = True
    
    try:
        # Import the interceptor which patches requests/urllib3
        from scripts.python.easyai_interceptor import *
        
        # Mark as loaded
        print("[EasyAI] Auto-capture initialized - all AI API requests will be logged")
        
    except ImportError:
        # Fallback: try to load interceptor from current directory
        try:
            # Look for interceptor in easyai directory
            current_dir = os.getcwd()
            interceptor_paths = [
                os.path.join(current_dir, 'easyai', 'easyai_interceptor.py'),
                os.path.join(current_dir, 'scripts', 'python', 'easyai_interceptor.py'),
            ]
            
            for interceptor_path in interceptor_paths:
                if os.path.exists(interceptor_path):
                    # Load the interceptor module dynamically
                    import importlib.util
                    spec = importlib.util.spec_from_file_location("easyai_interceptor", interceptor_path)
                    interceptor_module = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(interceptor_module)
                    print("[EasyAI] Auto-capture initialized - all AI API requests will be logged")
                    break
            else:
                print("[EasyAI] Warning: Could not find interceptor module - auto-capture may not work")
                
        except Exception as e:
            print(f"[EasyAI] Warning: Could not initialize auto-capture: {e}")

# Export useful functions for advanced users
__all__ = []

# Version info
__version__ = "3.0.2"