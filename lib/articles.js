const client = require('./client');

module.exports = async function articles(cid) {
  const { list } = await client.articles(cid);

  list.forEach((v) => {
    console.log(`#${v.id} ${v.article_title}`);
  });
};
