#!/bin/bash
mkdir -p pkg
npm ci --omit=dev
zip pkg/pipeline-restoration.zip -r node_modules/ lib/ index.js config.js package.json