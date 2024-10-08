#!/usr/bin/env sh
#
# Copyright (c) 2024 Josef Müller.
#

# This script is used to publish the PWA to the gh-pages branch

rm -rf build/web || exit

# build the app
flutter build web --release

# navigate into the build output directory
cd build/web || exit

# deploy to github pages
git init
git add -A

# change user config
git config user.name "taste-buddy"
git config user.email ""
git config --local commit.gpgsign false

# deploy
git commit -m 'deploy'
git branch -M master
git remote add origin git@github.com:taste-buddy/taste-buddy.github.io.git
git push -u -f origin master

# remove the build directory
cd - || exit
rm -rf dist
