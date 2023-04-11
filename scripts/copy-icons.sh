#!/bin/bash
targets=(firefox/ chromium/)
for target in "${targets[@]}"; do
  echo "Copying icons to $target"
  cp -r assets/icons $target
done
