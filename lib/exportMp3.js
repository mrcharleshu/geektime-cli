const download = require('download');
const path = require('path');
const filenamify = require('filenamify');
const { ensureDirSync } = require('fs-extra');
const { statSync, existsSync } = require('fs');
const pLimit = require('p-limit');
const ProgressBar = require('progress');
const Conf = require('conf');

const client = require('./client');

const config = new Conf();
const mp3Limit = pLimit(2);

module.exports = async function mp3(cid, options) {
  const { author_name: author, column_title: name } = await client.intro(cid);
  const { list } = await client.audios(cid);

  if (list.length === 0) {
    console.log('音频列表为空');
  }

  const dir = path.join(
    options.output || config.get('mp3Dir') || process.cwd(),
    filenamify([cid, author, name, 'mp3'].join(' - ')),
  );
  ensureDirSync(dir);

  const bar = new ProgressBar(
    '[:bar] :percent\n  [:current/:total] :title',
    { total: list.length, title: '', width: 20 },
  );

  await Promise.all(list.map(async v => mp3Limit(async () => {
    const {
      id, article_title: title, audio_download_url: url, audio_size: size,
    } = v;

    bar.tick({ title });

    const filename = `${id}. ${filenamify(title)}.mp3`;
    const oldFile = path.join(dir, filename);

    if (existsSync(oldFile) && (statSync(oldFile).size === size)) {
      return;
    }

    const downBar = new ProgressBar(
      '    [:title] [:bar] :percent',
      { total: 100, clear: true, width: 20 },
    );

    downBar.tick({ title: `${title.slice(0, 20)}...` });

    await download(url, dir, { filename })
      .on('downloadProgress', (progress) => {
        downBar.update(progress.percent);
      });
  })));

  console.log(`audios saved to ${dir}`);
};
