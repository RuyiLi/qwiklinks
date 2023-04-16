#!/bin/bash
# make sure to run copy-icons first
mkdir -p dist
# this doesnt remove files so maybe we run a rmr
cp -r firefox/ui/ firefox/qwiklinks.js chromium/
shopt -s globstar
sed -i 's/browser/chrome/' chromium/**/*.js
rm dist/chromium.zip 2> /dev/null
cd chromium && zip ../dist/chromium.zip **/*
echo "Finished building packed extension for Chromium" 
