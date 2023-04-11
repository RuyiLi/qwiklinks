#!/bin/bash
mkdir -p dist
cd firefox && zip ../dist/firefox.zip **/*
echo "Finished building packed extension for Firefox" 
