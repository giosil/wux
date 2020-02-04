var gulp    = require('gulp');
var debug   = require('gulp-debug');
var rename  = require('gulp-rename');
var uglify  = require('gulp-uglify');
var ts      = require('gulp-typescript');
var smaps   = require('gulp-sourcemaps');
var merge   = require('merge-stream');

console.log('__dirname:  ' + __dirname);
console.log('__filename: ' + __filename);

var dist = 'wux/dist';

gulp.task('build_wux', function(){
    let tsprj = ts.createProject('./ts/wux/tsconfig.json', {declaration: true});
    let tsout = tsprj.src().pipe(tsprj());
    return merge([
        tsout.dts
        .pipe(gulp.dest(dist))
        .pipe(debug())
    ,
        tsout.js
        .pipe(gulp.dest(dist))
        .pipe(rename({suffix: ".min"}))
        .pipe(smaps.init())
        .pipe(uglify())
        .pipe(smaps.write('./'))
        .pipe(gulp.dest(dist))
        .pipe(debug())
    ]);
});

gulp.task('default', gulp.series('build_wux'));