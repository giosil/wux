@echo off

echo Clean js folder..
del /Q .\js\*.*

echo Compile MAIN...
call tsc --declaration --project ./ts/main/tsconfig.json

rem Install first https://www.npmjs.com/package/minifier
echo Minify...
call minify ./js/main.js

rem Install first https://www.npmjs.com/package/uglify-js
rem call uglifyjs -c -o ./wux/js/wux.min.js -m -- ./wux/js/wux.js

