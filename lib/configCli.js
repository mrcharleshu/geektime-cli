const Conf = require('conf');
const path = require('path');

const config = new Conf();

module.exports = function configCli(options) {
  const { dir, mp3, video } = options;
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

  if (typeof video !== 'undefined') {
    noOption = false;

    config.set('videoDir', path.normalize(video));

    console.log(`默认视频导出目录: ${video}`);
  }

  if (noOption) {
    console.log(`
    Usage: config [options]

    调整参数设置

    Options:

      -d, --dir <dir>    设置文章导出目录
      -m, --mp3 <dir>    设置音频导出目录
      -v, --video <dir>  设置视频导出目录
      -h, --help         output usage information
    `);
  }
};
