var gulp = require('gulp');
var plumber = require('gulp-plumber');
var coffee = require("gulp-coffee");
var sass = require("gulp-sass");
var jade = require("gulp-jade");
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

// 監視
gulp.task('watch', function(){
  gulp.watch(['src/coffee/**/*.coffee'], ['coffee', 'build-js']);
  gulp.watch(['src/jade/**/*.jade'], ['jade']);
  gulp.watch(['src/scss/**/*.scss'], ['sass']);
});

// 依存npmモジュールとdist内jsを結合
gulp.task('build-js', function () {
    return browserify({
        entries: './dist/js/suggestrap.js' // どのファイルからビルドするか
    }).plugin('licensify') // licensifyプラグインの有効化
        .bundle() // browserifyの実行
        .pipe(source('suggestrap.main.js'))
        .pipe(buffer())
        .pipe(uglify({
            preserveComments: 'license' // ライセンスコメントを残しつつminify
        }))
        .pipe(gulp.dest('./dist')); // 出力
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
