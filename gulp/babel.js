/**
 * babelタスク
 */
var gulp = require('gulp');

//setting : babel Options
var bableOptions = {
  "presets": ["env"]
};

module.exports = (function () {
  gulp.task('babel', function() {
    return gulp.src(__CONFIG.path.babel.src)
      .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
      .pipe($.babel(bableOptions))
      .pipe(gulp.dest(__CONFIG.path.babel.dest));
  });
})();
