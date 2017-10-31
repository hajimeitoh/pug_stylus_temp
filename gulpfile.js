const
  // gulpプラグインの読み込み
  gulp = require('gulp'),
  // gulp関連以外のプラグイン読み込み
    // 直列処理用プラグイン
    runSequence = require('run-sequence'),
    // ファイル削除用プラグイン
    del = require('del'),
  // gulpディレクトリのタスク読み込み
  tasks = require('./gulp/load');
global.__CONFIG = tasks.config;
global.__IS_PRODUCTION = false;
global.$ = tasks.plugins;

/**
 * server
 * 環境によってhostは変更
 * windows
 */
const host = {
  local: 'localhost',
  ip: '0.0.0.0'
};
gulp.task('server', () => {
  gulp.src(__CONFIG.dist)
    .pipe($.webserver({
      host: host.local,
      port: 8000,
      livereload: true,
      fallback: __CONFIG.path.dist + 'index.html',
      open: true
    }));
});

/**
 * watch
 */
gulp.task('watch', () => {
  gulp.watch(__CONFIG.path.babel.watch, ['babel']);
  gulp.watch(__CONFIG.path.pug.watch, ['pug']);
  gulp.watch(__CONFIG.path.style.watch, ['style']);
  gulp.watch(__CONFIG.path.sprite.watch, ['sprite', 'style', 'copy']);

  let copyWatches = [];
  // 複製タスクはループで回して監視対象とする
  if (__CONFIG.path.copy) {
    __CONFIG.path.copy.forEach( src => copyWatches.push(src.from) );
    gulp.watch(copyWatches, ['copy']);
  }
});

/**
 * build
 */
gulp.task(
  'build',
  callback => runSequence('clean', 'sprite', ['babel', 'pug', 'style', 'copy'], callback)
);

/**
 * minify
 */
gulp.task(
  'minify',
  callback => runSequence('minify:img', 'minify:js', 'minify:json', 'minify:html', 'minify:css', callback)
);

/**
 * dist
 */
gulp.task(
  'clean_dist',
  callback => del(__CONFIG.path.clean_dist, callback)
);
gulp.task(
  'dist', callback => {
    global.__IS_PRODUCTION = true;
    return runSequence('build', 'clean_dist', callback);
  }
);

/**
 * default
 */
gulp.task(
  'default',
  ['clean'],
  () => runSequence('build', 'server', 'watch')
);