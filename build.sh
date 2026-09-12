#!/bin/bash

# Build script for All Aspects at the Barn static site

echo "Building All Aspects at the Barn static site..."

# Create build directory if it doesn't exist
mkdir -p build

# Copy static assets
mkdir -p build/images

# Copy required files
cp tokens.css build/
cp styles.css build/
cp script.js build/
cp README.md build/
cp -r images/* build/images/ 2>/dev/null || echo "No images directory found or no images to copy"

echo "Build complete. Files in build/ directory:"
ls -la build/