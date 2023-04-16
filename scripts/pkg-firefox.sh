#!/bin/bash
mkdir -p dist
shopt -s globstar
rm dist/firefox.zip 2> /dev/null
cd firefox && zip ../dist/firefox.zip **/*
echo "Finished building packed extension for Firefox" 
