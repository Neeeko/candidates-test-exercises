'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('serve', ['watch'], () => {
  nodemon({
    script: './src/app.js',
    ext: 'js json',
    env: { PORT: 80, NODE_ENV: process.env.NODE_ENV || 'development' }
  });
});
