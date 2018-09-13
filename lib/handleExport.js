const exportArticles = require('./exportArticles');
const exportMp3 = require('./exportMp3');


module.exports = async function handleExport(cid, options) {
  return await options.mp3
    ? exportMp3(cid, options)
    : exportArticles(cid, options);
};
