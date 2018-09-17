const Conf = require('conf');

const config = new Conf();

module.exports = function info() {
  const phone = config.get('phone');
  const mdDir = config.get('mdDir') || '';
  const mp3Dir = config.get('mp3Dir') || '';

  console.log(`
登录手机: ${phone}
文章目录: ${mdDir}
音频目录: ${mp3Dir}
`);
};
