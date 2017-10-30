/**
 * タスク設定ファイル
 */
// 出力先ディレクトリ
var dist = './dist/';
// 入力元ディレクトリ
var assets = './assets/';

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
      babel: {
        src: assets + 'js/**/*.es6',
        watch: assets + 'js/**/*.es6',
        dest: dist + 'js'
      },
      pug: {
        src: [
          assets + 'pug/**/*.pug',
          '!' + assets + 'pug/module/**/*.pug'
        ],
        watch: assets + 'pug/**/*.pug',
        dest: dist
      },
      style: {
        src: assets + 'styl/**/*.styl',
        watch: assets + 'styl/**/*.styl',
        dest: dist + 'css'
      },
      copy: [
        {
          from: assets + 'css/**/*.css',
          to: dist + 'css'
        },
        {
          from: assets + 'js/**/*.js',
          to: dist + 'js'
        }
      ]
    }
};