/**
 * 複製タスク
 * 指定されたファイルを指定されたディレクトリに複製する
 */
const
  gulp = require('gulp'),
  ms = require('merge-stream');

gulp.task('copy', () => {
  let
    files = __CONFIG.path.copy,
    stream = ms();
  files.forEach( file =>
    stream.add(
      gulp.src(file.from)
        .pipe(gulp.dest(file.to))
    )
  );
  return stream;
});