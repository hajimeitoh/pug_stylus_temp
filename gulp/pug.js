/**
 * PUGタスク
 */
var gulp = require('gulp');
var transformer = require('jstransformer');
var highlight = transformer(require('jstransformer-highlight'));
var stylus = transformer(require('jstransformer-stylus'));

//setting : Pug Options
var pugOptions = {
  pretty: true
};

module.exports = (function () {
  gulp.task('pug', function () {
    return gulp.src(__CONFIG.path.pug.src)
      .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
      .pipe($.pug(pugOptions))
      .pipe(gulp.dest(__CONFIG.path.pug.dest));
  });
})();