@echo off

call npm link gulp
call npm link gulp-debug
call npm link gulp-rename
call npm link gulp-sourcemaps
call npm link gulp-typescript
call npm link gulp-uglify
call npm link merge-stream
call npm link typescript

call gulp --verify