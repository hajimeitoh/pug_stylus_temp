/**
 * スタイルタスク
 * stylをコンパイルしてAutoprefixerをかける。プロダクションリリース時には圧縮する
 */
const
  gulp = require('gulp'),
  nib = require('nib');

module.exports = ( () => {
  gulp.task('style', () =>
    gulp.src(__CONFIG.path.style.src)
      .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
      .pipe($.stylus({
        use: nib()
      }))
      .pipe($.pleeease({
        fallbacks: {autoprefixer: ['last 4 versions']},
        minifier: false
      }))
      .pipe(gulp.dest(__CONFIG.path.style.dest))
  );
})();