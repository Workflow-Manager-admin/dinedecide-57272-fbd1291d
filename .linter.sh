#!/bin/bash
cd /home/kavia/workspace/code-generation/dinedecide-57272-fbd1291d/dinedecide
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

