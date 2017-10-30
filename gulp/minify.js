/**
 * スタイルタスク
 * stylをコンパイルしてAutoprefixerをかける。プロダクションリリース時には圧縮する
 */
const
  gulp = require('gulp'),
  saveLicense = require('uglify-save-license');

module.exports = ( () => {

  gulp.task('minify:img', () =>
    gulp.src(__CONFIG.path.img.dist)
      .pipe($.size({title: 'images:before'}))
      .pipe($.imagemin({
        progressive: true
      }))
      .pipe(gulp.dest(__CONFIG.path.img.dest))
      .pipe($.size({title: 'images:after'}))
  );

  gulp.task('minify:js', () =>
    gulp.src(__CONFIG.path.js.dist)
      .pipe($.uglify({
        output:{ comments: saveLicense }
      }))
      .pipe(gulp.dest(__CONFIG.path.js.dest))
  );

  gulp.task('minify:json', () =>
    gulp.src(__CONFIG.path.json.dist)
      .pipe($.jsonminify())
      .pipe(gulp.dest(__CONFIG.path.json.dest))
  );

  gulp.task('minify:html', () => {
    var opts = {
      conditionals: true,
      spare:true
    };
    return gulp.src(__CONFIG.path.html.dist)
      .pipe($.minifyHtml(opts))
      .pipe(gulp.dest(__CONFIG.path.html.dest));
  });

  gulp.task('minify:css', () =>
    gulp.src(__CONFIG.path.style.dist)
      .pipe($.pleeease())
      .pipe(gulp.dest(__CONFIG.path.style.dest))
  );

})();