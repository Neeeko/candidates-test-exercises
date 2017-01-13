'use strict';

const gulp = require('gulp');
const swagger = require('gulp-swagger');

gulp.task('swagger', () =>
  gulp.src('src/api/swagger.yaml')
    .pipe(swagger('swagger.json'))
    .pipe(gulp.dest('src/api'))
);
