/**
 * PUGタスク
 */
const
  gulp = require('gulp'),
  transformer = require('jstransformer'),
  highlight = transformer(require('jstransformer-highlight')),
  stylus = transformer(require('jstransformer-stylus')),
  fs = require('fs'),
  //setting : Pug Options
  pugOptions = {
    pretty: true
  };

module.exports = ( () => {
  gulp.task('pug', () =>
    gulp.src(__CONFIG.path.pug.src)
      .pipe($.data( file => {
        return JSON.parse(fs.readFileSync( __CONFIG.path.pug.data ));
      }))
      .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
      .pipe($.pug(pugOptions))
      .pipe(gulp.dest(__CONFIG.path.pug.dest))
  );
})();