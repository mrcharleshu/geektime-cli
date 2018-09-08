const Conf = require('conf');
const path = require('path');

const config = new Conf();

module.exports = function configDir(dir) {
  config.set('exportDir', path.normalize(dir));

  console.log(`default export dir set to: ${dir}`);
};
