#!/bin/bash
# must be run from the root directory of qwiklinks
targets=(firefox chromium)
for target in "${targets[@]}"; do
  ./scripts/pkg-$target.sh
done
