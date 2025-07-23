"""
EasyAI Site Customization - Auto-loads for all Python scripts
Place this in site-packages to auto-inject interceptor
"""
import os
import sys

# Check if EasyAI is enabled
if os.environ.get('EASYAI_ENABLED', 'true').lower() == 'true':
    # Find easyai directory
    possible_paths = [
        os.path.join(os.getcwd(), 'easyai'),
        os.path.join(os.getcwd(), '.easyai'),
        os.path.expanduser('~/.easyai')
    ]
    
    for easyai_path in possible_paths:
        if os.path.exists(os.path.join(easyai_path, 'easyai_interceptor.py')):
            if easyai_path not in sys.path:
                sys.path.insert(0, easyai_path)
            try:
                import easyai_interceptor
                break
            except:
                pass