var gulp    = require('gulp');
var rename  = require('gulp-rename');
var uglify  = require('gulp-uglify');
var ts      = require('gulp-typescript');
var smaps   = require('gulp-sourcemaps');
var merge   = require('merge-stream');

var dist    = 'wux/dist';

gulp.task('default', function(){
    var prj_wux = ts.createProject('./ts/wux/tsconfig.json', {declaration: true});
    
    const tsprj = prj_wux
        .src()
        .pipe(prj_wux());
    
    return merge([
        tsprj
        .dts
        .pipe(gulp.dest(dist))
    ,
        tsprj
        .js
        .pipe(gulp.dest(dist))
        .pipe(rename({suffix: ".min"}))
        .pipe(smaps.init())
        .pipe(uglify())
        .pipe(smaps.write('./'))
        .pipe(gulp.dest(dist))
    ]);
});