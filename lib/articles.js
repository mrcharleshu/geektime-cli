const getClient = require('./getClient');

module.exports = async function articles(cid) {
  const { list } = await getClient().articles(cid);

  list.forEach((v) => {
    console.log(`#${v.id} ${v.article_title}`);
  });
};
