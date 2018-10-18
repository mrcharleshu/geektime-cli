const download = require('download');
const path = require('path');
const filenamify = require('filenamify');
const { readFileSync, existsSync, writeFileSync } = require('fs');
const { ensureDirSync } = require('fs-extra');
const pLimit = require('p-limit');
const ProgressBar = require('progress');
const Conf = require('conf');

const getClient = require('./getClient');

const config = new Conf();
const downloadLimit = pLimit(2);
const videoLimit = pLimit(1);
const VIDEO_TYPE = 3;

// match hd-**.ts
const HD_REX = /hd-\d+\.ts/g;

module.exports = async function exportVideo(cid, options) {
  console.log(`fetching video for cid:${cid}...`);

  const client = getClient();

  const {
    author_name: author,
    column_title: columnName,
    update_frequency: frequency,
    column_type: type,
  } = await client.intro(cid);

  if (type !== VIDEO_TYPE) {
    console.log('no video found');
    return;
  }

  const { list } = await client.articles(cid);

  if (list.length === 0) {
    console.log('no video found');
    return;
  }

  const dir = path.join(
    options.output || config.get('videoDir') || process.cwd(),
    filenamify([cid, author, columnName, 'video'].join(' - ')),
  ) + (frequency === '全集' ? ' (全集)' : '');
  const hlsDir = path.join(dir, 'hls');

  ensureDirSync(dir);
  ensureDirSync(hlsDir);

  const bar = new ProgressBar(
    '[:bar] :percent [:current/:total] :title',
    { total: list.length, title: '', width: 20 },
  );

  await Promise.all(list.map(async v => downloadLimit(async () => {
    const {
      article_title: title, video_media_map: { hd: { url: m3u8Url } },
    } = v;

    bar.tick({ title });

    const name = filenamify(title);
    const filename = `${name}.m3u8`;
    const m3u8Path = path.join(dir, filename);
    const downdir = path.join(hlsDir, name);
    ensureDirSync(downdir);

    await download(m3u8Url, dir, { filename });

    let content = readFileSync(m3u8Path, { encoding: 'utf8' });
    const hds = content.match(HD_REX) || [];

    await Promise.all(
      hds.map(async hd => videoLimit(async () => {
        if (!existsSync(path.join(downdir, hd))) {
          bar.interrupt(`downloading ${hd}`);
          await download(m3u8Url.replace('hd.m3u8', hd), downdir);
        }
        content = content.replace(hd, `hls/${name}/${hd}`);
      })),
    ).catch((err) => {
      console.error(err);
    });

    writeFileSync(m3u8Path, content);
  })));

  console.log(`video saved to ${dir} `);
};
