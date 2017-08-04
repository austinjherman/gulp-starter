// Grabbing our dependacies
var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var del          = require('del');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var imageminPngQuant        = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var plumber = require('gulp-plumber');

// Creating some global variables
var PHP_FILES            = 'dev/**/*.php';
var SCSS_FILES           = ['dev/styles/scss/**/*.scss'];
var SCSS_MASTER          = 'dev/styles/scss/imports.scss';
var JS_FILES             = 'dev/js/**/*.js';
var NON_OPT_IMAGE_FILES  = 'dev/images/**/*.{png,jpeg,jpg,svg,gif}';

var WP_THEME_DIR         = 'public/wp-content/themes/tille-eye-care/';


// PHP file tasks
gulp.task('php', function () {
  // render new php files
  return gulp.src(PHP_FILES)
    .pipe(plumber())
    // write to theme directory
    .pipe(gulp.dest(WP_THEME_DIR))
    // reload the browser
    //.pipe(livereload());
    .pipe(browserSync.stream());

});

// SCSS file task
gulp.task('scss', function () {
  // grab scss files
  return gulp.src(SCSS_MASTER)
    .pipe(plumber())
    // initialize source maps for easy debugging
    .pipe(sourcemaps.init())
    // autoprefix scss files
    .pipe(autoprefixer())
    // convert sass to css syntax and compress
    .pipe(sass({
      includePaths: ['dev/styles/scss'],
      outputStyle: 'compressed'
    }))
    // write to style.css file
    .pipe(concat('style.css'))
    // write the source maps for easy debugging
    .pipe(sourcemaps.write({addComment: false}))
    // write to distribution path
    .pipe(gulp.dest(WP_THEME_DIR))
    // reload the browser
    //.pipe(livereload());
    .pipe(browserSync.stream());
});

// Javascript file task
gulp.task('js', function () {
  // grab js files
  return gulp.src(['dev/js/slick.min.js', 'dev/js/helpers.js', JS_FILES])
    .pipe(plumber())
    // initialize source maps
    .pipe(sourcemaps.init())
    // uglify
    .pipe(uglify())
    // write to scripts.js
    .pipe(concat('js/scripts.js'))
    // write source maps
    .pipe(sourcemaps.write({addComment: false}))
    // write to distribution path
    .pipe(gulp.dest(WP_THEME_DIR))
    // reload the browser
    //.pipe(livereload());
    .pipe(browserSync.stream());
});

// Images task
gulp.task('images', function () {
  return gulp.src(NON_OPT_IMAGE_FILES)
    .pipe(imagemin(
      [
        imagemin.gifsicle(),
        imagemin.jpegtran(),
        imagemin.optipng(),
        imagemin.svgo(),
        imageminPngQuant(),
        imageminJpegRecompress()
      ]
    ))
    .pipe(gulp.dest(WP_THEME_DIR + 'images'));
});

// Delete the dist files
gulp.task('clean', function () {
  // delete the opt image folder
  return del.sync([WP_THEME_DIR]);
});

// Run all tasks and build distribution folder
gulp.task('build', ['php', 'scss', 'js', 'images']);

// Gulp watch
gulp.task('watch', ['clean', 'build'], function () {
  // livereload listening for changes to files
  //livereload.listen();
  browserSync.init({
        proxy: "http://localhost/tille"
  }); 
  gulp.watch(PHP_FILES, ['php']);
  gulp.watch(SCSS_FILES, ['scss']);
  gulp.watch(JS_FILES, ['js']);
});
