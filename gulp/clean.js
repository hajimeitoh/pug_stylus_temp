/**
 * クリーンタスク
 * 指定されたディレクトリ以下をすべて削除する
 */
var gulp = require('gulp');
var del = require('del');

gulp.task('clean', function (callback) {
  return del(__CONFIG.path.clean, callback);
});