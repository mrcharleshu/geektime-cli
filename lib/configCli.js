const Conf = require('conf');
const path = require('path');

const config = new Conf();

module.exports = function configCli(options) {
  const { dir, mp3 } = options;
  let noOption = true;

  if (typeof dir !== 'undefined') {
    noOption = false;

    config.set('mdDir', path.normalize(dir));

    console.log(`默认文章导出目录: ${dir}`);
  }

  if (typeof mp3 !== 'undefined') {
    noOption = false;

    config.set('mp3Dir', path.normalize(mp3));

    console.log(`默认音频导出目录: ${mp3}`);
  }

  if (noOption) {
    console.log(`
    Usage: config [options]

    调整参数设置

    Options:

      -d, --dir <dir>  设置文章导出目录
      -m, --mp3 <dir>  设置音频导出目录
      -h, --help       output usage information
    `);
  }
};
