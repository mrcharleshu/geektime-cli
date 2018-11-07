const config = require('./config');

const CN_CODE = 86;

module.exports = function login(phone, password, options) {
  config.set('code', +options.code || CN_CODE);
  config.set('phone', phone);
  config.set('password', password);

  console.log('login info saved 😊');
};
