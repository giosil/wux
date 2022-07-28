@echo off

echo Clean dist folder..
del /Q .\dist\*.*

echo Compile WUX...
call tsc --declaration --project ./ts/wux/tsconfig.json
call tsc --declaration --project ./ts/wux/tsconfig.dev.json

echo Compile test...
call tsc --noEmitHelpers --declaration --project ./ts/tsconfig.json

rem Install first https://www.npmjs.com/package/minifier
echo Minify...
call minify ./dist/wux.js
