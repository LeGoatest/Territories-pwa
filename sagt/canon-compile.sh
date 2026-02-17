#!/bin/bash
# SAGT Lightweight Canon Compiler

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Run the compiler from the sagt directory to ensure paths match
cd "$SCRIPT_DIR" && python3 Jules/scripts/canon_compiler.py
