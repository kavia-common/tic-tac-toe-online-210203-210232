#!/bin/bash
cd /home/kavia/workspace/code-generation/tic-tac-toe-online-210203-210232/tictactoe_frontend
npx eslint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

