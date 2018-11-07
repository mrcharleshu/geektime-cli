const Geektime = require('geektime');

const config = require('./config');

const CN_CODE = 86;

function getClient() {
  const code = config.get('code', CN_CODE);
  const phone = config.get('phone');
  const password = config.get('password');
  const client = new Geektime(code, phone, password);

  return client;
}

module.exports = getClient;
