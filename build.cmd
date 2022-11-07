@echo off

echo Clean dist folder..
del /Q .\dist\*.*

echo Compile WUX...
call tsc --declaration --project ./ts/wux/tsconfig.json
call tsc --declaration --project ./ts/wux/tsconfig.dev.json

echo Compile Demo...
call tsc --noEmitHelpers --declaration --project ./ts/tsconfig.json

rem Install first https://www.npmjs.com/package/minifier
echo Minify...
call minify ./dist/wux.js

rem Install first https://www.npmjs.com/package/uglify-js
rem Usage: uglifyjs input_file -c (compress) -o (output_file) output_file
rem call uglifyjs ./dist/wux.js -c -o ./dist/wux.min.js
