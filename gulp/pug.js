/**
 * PUGタスク
 */
const
  gulp = require('gulp'),
  transformer = require('jstransformer'),
  highlight = transformer(require('jstransformer-highlight')),
  stylus = transformer(require('jstransformer-stylus')),
  pug = transformer(require('jstransformer-pug')),
  fs = require('fs'),
  //setting : Pug Options
  pugOptions = {
    pretty: true,
    basedir: 'pug'
  };

// jsonSet
var setJson = filepath => {
  return JSON.parse(fs.readFileSync( filepath, { encoding:"utf8" } ));
};
// file exist
var isExistFile = filepath => {
  try {
    fs.statSync(filepath);
    return true
  } catch(err) {
    if(err.code === 'ENOENT') return false
  }
}

module.exports = ( () => {
  gulp.task('pug', () =>
    gulp.src(__CONFIG.path.pug.src)
      .pipe($.data( file => {
        return setJson( __CONFIG.path.pug.data + 'site.json' );
      }))
      .pipe($.data( file => {
        let c, filename, filepath;
        if (file.path.length !== 0) {
          c = file.path.split('\\').join('/');
          filename = c.split('pug/')[1].replace('.pug', '');
          filepath = __CONFIG.path.pug.data + filename + '.json';
          if ( isExistFile(filepath) ) {
            return setJson(filepath);
          }
        }
      }))
      .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
      .pipe($.pug(pugOptions))
      .pipe(gulp.dest(__CONFIG.path.pug.dest))
  );
})();