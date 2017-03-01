'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var tslint = require('gulp-tslint');
var gulpConfig = require('./../gulp-config');

gulp.task('eslint', function () {
    return gulp.src(gulpConfig.allJavascript)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('tslint', function () {
    return gulp.src(gulpConfig.appTypescript)
        .pipe(tslint({
            formatter: 'verbose'
        }))
        .pipe(tslint.report());
});