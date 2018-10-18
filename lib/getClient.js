const Conf = require('conf');
const Geektime = require('geektime');

const config = new Conf();

function getClient() {
  const phone = config.get('phone');
  const password = config.get('password');
  const client = new Geektime(phone, password);

  return client;
}

module.exports = getClient;
