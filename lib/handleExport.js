const exportArticles = require('./exportArticles');
const exportMp3 = require('./exportMp3');
const exportVideo = require('./exportVideo');

module.exports = async function handleExport(cid, otherCids, options) {
  let fn = exportArticles;

  if (options.mp3) {
    fn = exportMp3;
  }

  if (options.video) {
    fn = exportVideo;
  }

  await fn(cid, options);

  otherCids.reduce(
    (prev, otherCid) => prev.then(() => fn(otherCid, options)),
    Promise.resolve(),
  );
};
