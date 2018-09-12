const Conf = require('conf');
const path = require('path');

const config = new Conf();

module.exports = function configCli(options) {
  const { dir } = options;
  let noOption = true;

  if (typeof dir !== 'undefined') {
    noOption = false;

    config.set('exportDir', path.normalize(dir));

    console.log(`默认导出目录: ${dir}`);
  }

  if (noOption) {
    console.log(`
    Usage: config [options]

    调整参数设置

    Options:

      -d, --dir <dir>  默认导出目录
      -h, --help       output usage information
    `);
  }
};
