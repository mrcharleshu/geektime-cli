const Conf = require('conf');

const config = new Conf();

module.exports = function info() {
  const phone = config.get('phone');
  const exportDir = config.get('exportDir');

  console.log(`
登录手机: ${phone}
导出目录: ${exportDir}
`);
};
