#!/bin/bash
mkdir -p dist
shopt -s globstar
cd firefox && zip ../dist/firefox.zip **/*
echo "Finished building packed extension for Firefox" 
