/**
 * クリーンタスク
 * 指定されたディレクトリ以下をすべて削除する
 */
const
  gulp = require('gulp'),
  del = require('del');

gulp.task('clean', callback => del(__CONFIG.path.clean, callback) );