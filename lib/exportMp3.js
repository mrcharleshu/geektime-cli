const download = require('download');
const path = require('path');
const filenamify = require('filenamify');
const { ensureDirSync } = require('fs-extra');
const { statSync, existsSync, readdirSync } = require('fs');
const pLimit = require('p-limit');
const ProgressBar = require('progress');

const getClient = require('./getClient');
const config = require('./config');

const mp3Limit = pLimit(2);

module.exports = async function mp3(cid, options) {
  console.log(`fetching audios for cid:${cid}...`);

  const client = getClient();

  const {
    author_name: author, column_title: name, update_frequency: frequency,
  } = await client.intro(cid);
  const { list } = await client.audios(cid);

  if (list.length === 0) {
    console.log('no audios found');
    return;
  }

  const dir = path.join(
    options.output || config.get('mp3Dir') || process.cwd(),
    filenamify([cid, author, name, 'mp3'].join(' - ')),
  ) + (frequency === '全集' ? ' (全集)' : '');
  ensureDirSync(dir);

  // remember old path...
  const oldPaths = {};
  readdirSync(dir)
    .filter(v => statSync(path.join(dir, v)).isDirectory())
    .forEach((v) => {
      readdirSync(path.join(dir, v)).forEach((md) => {
        const full = path.join(dir, v, md);

        if (statSync(full).isFile()) {
          oldPaths[md] = full;
        }
      });
    });

  const bar = new ProgressBar(
    '[:bar] :percent [:current/:total] :title',
    { total: list.length, title: '', width: 20 },
  );

  await Promise.all(list.map(async v => mp3Limit(async () => {
    const {
      article_title: title, audio_download_url: url, audio_size: size,
    } = v;

    bar.tick({ title });

    const filename = `${filenamify(title)}.mp3`;
    const file = oldPaths[filename] || path.join(dir, filename);

    if (existsSync(file) && (statSync(file).size === size)) {
      return;
    }

    const downBar = new ProgressBar(
      '    [:title] [:bar] :percent',
      { total: 100, clear: true, width: 20 },
    );

    downBar.tick({ title: `${title.slice(0, 20)}...` });

    await download(url, path.dirname(file), { filename })
      .on('downloadProgress', (progress) => {
        downBar.update(progress.percent);
      });
  })));

  console.log(`audios saved to ${dir}`);
};
