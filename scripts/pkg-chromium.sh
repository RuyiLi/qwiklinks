#!/bin/bash
# make sure to run copy-icons first
mkdir -p dist
cp -r firefox/ui/ firefox/qwiklinks.js chromium/
shopt -s globstar
sed -i 's/browser/chrome/' chromium/**/*.js
cd chromium && zip ../dist/chromium.zip **/*
echo "Finished building packed extension for Chromium" 
