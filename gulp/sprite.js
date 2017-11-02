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
      spriteData = gulp.src(__CONFIG.path.sprite.src + '*.png')
        .pipe($.spritesmith({
          imgName: 'sprite.png',
          imgPath: '../../img/common/sprite.png',
          retinaSrcFilter: __CONFIG.path.sprite.src + '*@2x.png',
          retinaImgName: 'sprite-2x.png',
          retinaImgPath: '../../img/common/sprite-2x.png',
          padding: 10,
          cssName: '_sprite.styl',
          cssFormat: 'stylus_retina',
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