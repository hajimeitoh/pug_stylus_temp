/**
 * babelタスク
 */
const
  gulp = require('gulp'),
  //setting : babel Options
  bableOptions = {
    "presets": ["env"]
  };

module.exports = (
  () => gulp.task(
    'babel',
    () => gulp.src(__CONFIG.path.babel.src)
      .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
      .pipe($.babel(bableOptions))
      .pipe(gulp.dest(__CONFIG.path.babel.dest))
  )
)();
