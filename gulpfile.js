// Grabbing our dependacies
var gulp         = require('gulp');
var livereload   = require('gulp-livereload');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var del          = require('del');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var imageminPngQuant        = require('imagemin-pngquant');
var imageminJpregRecompress = require('imagemin-jpeg-recompress');

// Creating some global variables
var DIST_PATH   = 'public/dist/';
var HTML_FILES  = 'public/html/**/*.html';
var SCSS_FILES  = 'public/assets/**/*.scss';
var SCSS_MASTER = 'public/assets/**/master.scss';
var JS_FILES    = 'public/assets/**/*.js';
var IMAGE_FILES = 'public/assets/**/*.{png, jpeg, jpg, svg, gif}';
var PHP_FILES = 'public/**/*.php';

// HTML file tasks
gulp.task('html', function () {
  // grab html files
  return gulp.src(HTML_FILES)
    // write them to the distribution folder
    .pipe(gulp.dest(DIST_PATH))
    // reload the browser
    .pipe(livereload());
});

// HTML file tasks
gulp.task('php', function () {
  // grab html files
  return gulp.src(PHP_FILES)
    // write them to the distribution folder
    .pipe(gulp.dest(DIST_PATH))
    // reload the browser
    .pipe(livereload());
});

// SCSS file task
gulp.task('scss', function () {
  // grab scss files
  return gulp.src(SCSS_MASTER)
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

// Javascript file task
gulp.task('js', function () {
  // grab js files
  return gulp.src(JS_FILES)
    // initialize source maps
    .pipe(sourcemaps.init())
    // uglify
    .pipe(uglify())
    // write to scripts.js
    .pipe(concat('scripts.js'))
    // write source maps
    .pipe(sourcemaps.write())
    // write to distribution path
    .pipe(gulp.dest(DIST_PATH))
    // reload the browser
    .pipe(livereload());
});

// Images task
gulp.task('images', function () {
  return gulp.src(IMAGE_FILES)
    .pipe(imagemin(
      [
        imagemin.gifsicle(),
        imagemin.jpegtran(),
        imagemin.optipng(),
        imagemin.svgo(),
        imageminPngQuant(),
        imageminJpregRecompress()
      ]
    ))
    .pipe(gulp.dest(DIST_PATH));
});

// Delete the dist files
gulp.task('clean', function () {
  // delete the distribution folder
  return del.sync([DIST_PATH + '/']);
});

// Run all tasks and build distribution folder
gulp.task('build', ['clean', 'html', 'scss', 'js', 'images']);

// Gulp watch
gulp.task('watch', ['clean', 'build'], function () {
  // livereload listening for changes to files
  livereload.listen();
  gulp.watch(HTML_FILES, ['html']);
  gulp.watch(SCSS_FILES, ['scss']);
  gulp.watch(JS_FILES, ['js']);
});
