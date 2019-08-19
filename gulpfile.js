const gulp = require('gulp');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const connect = require('gulp-connect');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');

gulp.task('copy', () => {
  gulp.src('./src/icons/delete.svg')
      .pipe(gulp.dest('./out/icons'));
});

gulp.task('pug', () => {
  gulp.src('./src/*.pug')
      .pipe(pug())
      .pipe(gulp.dest('./out'))
      .pipe(connect.reload());
});

gulp.task('stylus', () => {
  gulp.src('./src/assets/styles/*.styl')
      .pipe(stylus())
      .pipe(gulp.dest('./out/assets/styles/'))
      .pipe(connect.reload());
});

gulp.task('babel', () => {
  gulp.src('src/assets/scripts/script.js')
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest('./out/assets/scripts'))
      .pipe(connect.reload());
});

gulp.task('imagemin', () => {
    gulp.src('src/assets/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('out/assets/img'));
});

gulp.task('watch', () => {
  gulp.watch(['./src/*.pug', './src/partials/*.pug', './src/layouts/*.pug'],['pug']);
  gulp.watch(['./src/assets/styles/*.styl', './src/assets/styles/modules/*.styl'],['stylus']);
  gulp.watch(['./src/assets/scripts/*.js'],['babel']);
});

gulp.task('serve', () => {
  connect.server({
    root: './out',
    livereload: true
  });
});

gulp.task('deploy', ['build', 'ghpages']);
gulp.task('build', ['pug', 'stylus', 'imagemin', 'babel', 'copy']);
gulp.task('server', ['serve', 'watch']);
