const exportArticles = require('./exportArticles');
const exportMp3 = require('./exportMp3');
const exportVideo = require('./exportVideo');


module.exports = async function handleExport(cid, options) {
  if (options.mp3) {
    return exportMp3(cid, options);
  }

  if (options.video) {
    return exportVideo(cid, options);
  }

  return exportArticles(cid, options);
};
