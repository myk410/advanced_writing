#!/usr/bin/env python
import subprocess
import sys
import os

# Path to your requirements.txt (adjust if yours lives somewhere else)
REQ = os.path.join(os.path.dirname(__file__), 'requirements.txt')

# Run pip install
subprocess.check_call([
    sys.executable, '-m', 'pip', 'install', '-r', REQ
])
print("✅ Dependencies installed!")
