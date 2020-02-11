#!/bin/bash
# This section executes 3 javascript programs to generate 
# the index of files, programs and modules.
# Refer to files.js, programs.js and modules.js
# for more info.
node js/files.js > files.html
node js/programs.js programs > programs/index.js
node js/modules.js modules > modules/index.js
