/**
 * スプライト生成タスク
 * スプライト画像とCSSを生成するタスク
 */
const
  gulp = require('gulp'),
  ms = require('merge-stream'),
  buffer = require('vinyl-buffer');

module.exports = ( () => {
  gulp.task('sprite', () => {
    let
      spriteData = gulp.src(__CONFIG.path.sprite.src)
        .pipe($.spritesmith({
          imgName: 'sprite.png',
          cssName: '_sprite.styl',
          imgPath: '../../img/common/sprite.png',
          cssFormat: 'stylus',
          cssVarMap: sprite => {
            sprite.name = 'sprite-' + sprite.name;
          }
        })
      );
    if( spriteData.img ){
      let
        imgStream = spriteData.img
          .pipe(buffer())
          .pipe(gulp.dest(__CONFIG.path.sprite.imageDest)),
        cssStream = spriteData.css
          .pipe(buffer())
          .pipe(gulp.dest(__CONFIG.path.sprite.cssDest));
      return ms(imgStream, cssStream);
    }
  });
})();