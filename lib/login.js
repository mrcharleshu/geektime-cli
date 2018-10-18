const config = require('./config');

module.exports = function login(phone, password) {
  config.set('phone', phone);
  config.set('password', password);

  console.log('login info saved 😊');
};
