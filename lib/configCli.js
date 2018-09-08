const Conf = require('conf');
const path = require('path');

const config = new Conf();

module.exports = function configCli(options) {
  const { dir, autoOpen } = options;
  let noOption = true;

  if (typeof dir !== 'undefined') {
    noOption = false;

    config.set('exportDir', path.normalize(dir));

    console.log(`默认导出目录: ${dir}`);
  }

  if (typeof autoOpen !== 'undefined') {
    noOption = false;

    const open = autoOpen > 0;
    config.set('openDir', open);

    console.log(`自动打开目录: ${open ? 'true' : 'false'} `);
  }

  if (noOption) {
    console.log(`
    Usage: config [options]

    调整参数设置

    Options:

      -d, --dir <dir>         默认导出目录
      -o, --auto-open <open>  自动打开目录 [0/1]
      -h, --help              output usage information
    `);
  }
};
