var gulp = require('gulp');
var plumber = require('gulp-plumber');
var coffee = require("gulp-coffee");
var sass = require("gulp-sass");
var jade = require("gulp-jade");

// 監視
gulp.task('watch', function(){
  gulp.watch(['src/coffee/**/*.coffee'], ['coffee']);
  gulp.watch(['src/jade/**/*.jade'], ['jade']);
  gulp.watch(['src/scss/**/*.scss'], ['sass']);
});

// coffeeコンパイル
gulp.task('coffee', function(){
  gulp.src('src/coffee/**/*.coffee')
    .pipe(plumber())
    .pipe(coffee({
      pretty: true
    }))
    .pipe(gulp.dest('dist/js'));
});

// sassコンパイル
gulp.task('sass', function(){
  gulp.src('src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({
      pretty: true
    }))
    .pipe(gulp.dest('dist/css'));
});

// jadeコンパイル
gulp.task('jade', function(){
  gulp.src('src/jade/**/*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('dist/html'));
});
