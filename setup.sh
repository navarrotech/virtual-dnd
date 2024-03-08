#!/bin/bash

# Create symlinks for lib -> frontend and lib -> api
ln -s ./lib ./frontend/src/lib
ln -s ./lib ./api/src/lib
