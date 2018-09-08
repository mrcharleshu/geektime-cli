const Turndown = require('turndown');
const client = require('./client');

module.exports = async function article(id) {
  const res = await client.article(id);
  const content = (new Turndown()).turndown(res.article_content);

  console.log(res.article_title);
  console.log(content);
};
