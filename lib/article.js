const Turndown = require('turndown');
const getClient = require('./getClient');

module.exports = async function article(id) {
  const res = await getClient().article(id);
  const content = (new Turndown()).turndown(res.article_content);

  console.log(res.article_title);
  console.log(content);
};
