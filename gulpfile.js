// Grabbing our dependacies
var gulp         = require('gulp');
var livereload   = require('gulp-livereload');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var del          = require('del')

// Creating some global variables
var DIST_PATH  = 'public/dist/';
var HTML_FILES = 'public/html/**/*.html';
var SCSS_FILES = 'public/scss/**/*.scss';

// HTML file tasks
gulp.task('html', function () {
  // grab html files from public/html/
  return gulp.src(HTML_FILES)
    // write them to the distribution folder
    .pipe(gulp.dest(DIST_PATH))
    // reload the browser
    .pipe(livereload());
});

// SCSS File Task
gulp.task('scss', function () {
  // grab scss files from public/scss/
  return gulp.src(SCSS_FILES)
    // initialize source maps for easy debugging
    .pipe(sourcemaps.init())
    // autoprefix scss files
    .pipe(autoprefixer())
    // convert sass to css syntax and compress
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    // write to style.css file
    .pipe(concat('style.css'))
    // write the source maps for easy debugging
    .pipe(sourcemaps.write())
    // write style.css in distribution folder
    .pipe(gulp.dest(DIST_PATH))
    // reload the browser
    .pipe(livereload());
});

// Delete the dist files
gulp.task('clean', function () {
  // delete the distribution folder
  return del.sync([DIST_PATH]);
});

// Run all tasks and build distribution folder
gulp.task('build', ['html', 'scss']);

// Gulp watch
gulp.task('watch', ['clean', 'build'], function () {
  // livereload listening for changes to files
  livereload.listen();
  gulp.watch(HTML_FILES, ['html']);
  gulp.watch(SCSS_FILES, ['scss']);
});
