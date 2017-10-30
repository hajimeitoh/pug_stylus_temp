/**
 * 一括読み込みタスク
 * 指定されたディレクトリ以下のスクリプトをrequireする
 */
var fs = require('fs');
var path = require('path');

module.exports = (function() {
  // gulpディレクトリにあるタスクをロード
  var files = fs.readdirSync(__dirname);
  var result = [];

  files.forEach(function(file) {
    var stats = fs.statSync(path.join(__dirname,file));
    if (stats.isFile() && path.extname(file) === '.js') {
      var name = path.basename(file,'.js');
      if (name === 'load') {
        return;
      }
      result[name] = require(__dirname + '/'+name);
    }
  });
  return result;
})();