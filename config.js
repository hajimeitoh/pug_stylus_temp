/**
 * タスク設定ファイル
 */
const
  // 出力先ディレクトリ
  dist = './dist/',
  // 入力元ディレクトリ
  assets = './assets/';

module.exports = {
    // 出力先ディレクトリ
    dist: dist,
    asetts: assets,
    // サーバー設定
    server: {
      ghostMode: {
        clicks: false,
        location: false,
        forms: false,
        scroll: false
      }
    },
    // パス設定
    path: {
      clean: [
        dist + '*'
      ],
      clean_dist: [
        dist + '_data',
        dist + '_index.html'
      ],
      html: {
        dist: dist + '**/*.html',
        dest: dist
      },
      babel: {
        src: assets + 'js/**/*.es6',
        watch: assets + 'js/**/*.es6',
        dest: dist + 'js'
      },
      js: {
        watch: assets + 'js/**/*.js',
        dist: dist + 'js/**/*.js',
        dest: dist + 'js'
      },
      json: {
        dist: dist + '**/*.json',
        dest: dist
      },
      pug: {
        data: assets + 'data/',
        src: [
          assets + 'pug/**/*.pug',
          '!' + assets + 'pug/module/**/*.pug',
          '!' + assets + 'pug/**/_*.pug'
        ],
        watch: [
          assets + 'pug/**/*.pug',
          assets + 'data/',
        ],
        dest: dist
      },
      style: {
        src: [
          assets + 'styl/**/*.styl',
          '!' + assets + 'styl/module/**/*.styl',
          '!' + assets + 'styl/**/_*.styl'
        ],
        watch: assets + 'styl/**/*.styl',
        dist: dist + 'css/**/*.css',
        dest: dist + 'css'
      },
      sprite: {
        src: assets + '_imgSprites/',
        watch: assets + '_imgSprites/',
        imageDest: assets + 'img/common',
        cssDest: assets + 'styl/module'
      },
      img: {
        dist: dist + 'img/**/*',
        dest: dist + 'img'
      },
      copy: [
        {
          from: assets + 'css/**/*.css',
          to: dist + 'css'
        },
        {
          from: assets + 'js/**/*.js',
          to: dist + 'js'
        },
        {
          from: assets + 'img/**/*',
          to: dist + 'img'
        }
      ]
    }
};