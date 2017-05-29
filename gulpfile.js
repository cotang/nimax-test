'use strict';

// Set Env
process.env.NODE_ENV = 'development';
// process.env.NODE_ENV = 'production';

// Check ENV
global.devBuild = process.env.NODE_ENV !== 'production';


// common
const gulp = require('gulp');
const del = require('del');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const runSequence =  require('run-sequence');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const changed = require('gulp-changed');
// html
// sass
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const cleancss = require('gulp-cleancss');
const rename = require('gulp-rename');
// js
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
// img
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const jpegoptim = require('imagemin-jpegoptim');
// deploy
const ghPages = require('gulp-gh-pages');

// Paths
var path = {
  build: {
    html: 'build',
    js: 'build/scripts/',
    css: 'build/styles/',
    img: 'build/images/',
    deploy: 'build/**/*'
  },
  src: {
    html: 'src/*.html',
    js: 'src/scripts/*.js',
    css: './src/styles/*.scss',
    img: 'src/images/**/**.*',
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/scripts/**/*.js',
    css: 'src/styles/**/*.scss',
    img: 'src/images/*.*',
  },
  clean: './build'
};


// Compilation html
gulp.task('html', function() {
  return gulp.src(path.src.html)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
})

// Compilation sass
gulp.task('sass', function () {
  return gulp.src(path.src.css)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: ['last 5 version']}),
      mqpacker
    ]))
    .pipe(gulp.dest(path.build.css))
    .pipe(cleancss())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});


// Compilation js v2
gulp.task('js', function() {
  return gulp.src(path.src.js)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(concat('script.js'))
    .pipe(gulp.dest(path.build.js))
    .pipe(uglify())
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

// Optimization images
gulp.task('img', function () {
  return gulp.src(path.src.img)
    .pipe(gulpif(devBuild, changed(path.build.img)))
    .pipe(gulpif(!devBuild, imagemin()))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});

// Clean
gulp.task('clean', function () {
  return del(path.clean);
});

// Overall build
gulp.task('build', function (cb) {
  runSequence('clean', ['html', 'img', 'sass', 'js'], cb);
});


//Server config
var config = {
  server: {
    baseDir: "./build"
  },
  // tunnel: true,
  host: 'localhost',
  port: 9000
};
// Browser sync
gulp.task('browserSync', ['build'], function() {
  browserSync(config);
});
// Overall watch
gulp.task('watch', ['browserSync'], function(){
  gulp.watch([path.watch.html], function(event, cb) {
    gulp.start('html');
  });
  gulp.watch([path.watch.css], function(event, cb) {
    gulp.start('sass');
  });
  gulp.watch([path.watch.js], function(event, cb) {
    gulp.start('js');
  });
  gulp.watch([path.watch.img], function(event, cb) {
    gulp.start('img');
  });
});

// Deploy on github.io
gulp.task('deploy', function() {
  return gulp.src(path.build.deploy)
    .pipe(ghPages());
});

// Default task
gulp.task('default', ['watch']);


var onError = function(err) {
    notify.onError({
      title: "Error in " + err.plugin,
    })(err);
    this.emit('end');
}
