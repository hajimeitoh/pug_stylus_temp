// gulpプラグインの読み込み
var gulp = require('gulp');

// gulp関連以外のプラグイン読み込み
var
  // 直列処理用プラグイン
  runSequence = require('run-sequence'),
  // ファイル削除用プラグイン
  del = require('del');

// gulpディレクトリのタスク読み込み
var
  tasks = require('./gulp/load');
global.__CONFIG = tasks.config;
global.__IS_PRODUCTION = false;
global.$ = tasks.plugins;

/**
 * server
 * 環境によってhostは変更
 * windows
 */
var host = {
  local: 'localhost',
  ip: '0.0.0.0'
};
gulp.task('server', function() {
  gulp.src(__CONFIG.dist)
    .pipe($.webserver({
      host: host.ip,
      port: 8000,
      livereload: true,
      fallback: __CONFIG.path.dist + 'index.html',
      open: true
    }));
});

/**
 * watch
 */
gulp.task('watch', function () {
  gulp.watch(__CONFIG.path.babel.watch, ['babel']);
  gulp.watch(__CONFIG.path.pug.watch, ['pug']);
  gulp.watch(__CONFIG.path.style.watch, ['style']);

  var copyWatches = [];
  // 複製タスクはループで回して監視対象とする
  if (__CONFIG.path.copy) {
    __CONFIG.path.copy.forEach(function(src) {
        copyWatches.push(src.from);
    });
    gulp.watch(copyWatches, ['copy']);
  }
});

/**
 * build
 */
gulp.task('build', function (callback) {
  return runSequence('clean', ['babel', 'pug', 'style', 'copy'], callback);
});

/**
 * minify
 */
gulp.task('minify', function (callback) {
  return runSequence('minify:img', 'minify:js', 'minify:json', 'minify:html', 'minify:css', callback);
});

/**
 * dist
 */
gulp.task('clean_dist',function (callback) {
  return del(__CONFIG.path.clean_dist, callback);
});
gulp.task('dist',function (callback) {
  global.__IS_PRODUCTION = true;
  return runSequence('build', 'clean_dist', callback);
});

/**
 * default
 */
gulp.task('default', ['clean'], function () {
  return runSequence('build', 'server', 'watch');
});