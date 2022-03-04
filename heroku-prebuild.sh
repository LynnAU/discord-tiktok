#!/bin/bash
if [ "$GITHUB_AUTH" != "" ]; then
    echo "Detected GITHUB_AUTH. Setting git config to use the security token" >&1
    git config --global url."https://${GITHUB_AUTH}@github.com/".insteadOf git@github.com:
fi
