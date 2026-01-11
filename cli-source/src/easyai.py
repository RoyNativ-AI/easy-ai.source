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
        # First try to import from the standard package location
        from scripts.python.easyai_interceptor import *
        print("[EasyAI] Auto-capture initialized - all AI API requests will be logged")
        
    except ImportError:
        # Fallback: try to load interceptor from various locations
        try:
            current_dir = os.getcwd()
            
            # Try multiple possible paths
            interceptor_paths = [
                # In the project's easyai directory (copied by init)
                os.path.join(current_dir, 'easyai', 'scripts', 'python', 'easyai_interceptor.py'),
                # Legacy location
                os.path.join(current_dir, 'easyai', 'easyai_interceptor.py'),
                # Alternative location
                os.path.join(current_dir, 'scripts', 'python', 'easyai_interceptor.py'),
            ]
            
            interceptor_loaded = False
            for interceptor_path in interceptor_paths:
                if os.path.exists(interceptor_path):
                    # Load the interceptor module dynamically
                    import importlib.util
                    spec = importlib.util.spec_from_file_location("easyai_interceptor", interceptor_path)
                    if spec and spec.loader:
                        interceptor_module = importlib.util.module_from_spec(spec)
                        spec.loader.exec_module(interceptor_module)
                        print("[EasyAI] Auto-capture initialized - all AI API requests will be logged")
                        interceptor_loaded = True
                        break
            
            if not interceptor_loaded:
                print("[EasyAI] Warning: Could not find interceptor module")
                print("[EasyAI] Make sure you've run 'easyai init' in your project directory")
                
        except Exception as e:
            print(f"[EasyAI] Warning: Could not initialize auto-capture: {e}")
            print("[EasyAI] Try running 'easyai init' to set up the interceptor files")

# Export useful functions for advanced users
__all__ = []

# Version info
__version__ = "3.0.23"