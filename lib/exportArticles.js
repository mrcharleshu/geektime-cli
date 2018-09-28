const {
  writeFileSync, existsSync, readFileSync, readdirSync, statSync,
} = require('fs');
const path = require('path');
const filenamify = require('filenamify');
const { ensureDirSync } = require('fs-extra');
const pLimit = require('p-limit');
const ProgressBar = require('progress');
const Turndown = require('turndown');
const Conf = require('conf');
const download = require('download');

const client = require('./client');

const config = new Conf();
const limit = pLimit(10); // avoid API rate limit
const IMG_REX = /https[\S]+?geekbang[\S]+\.(jpg|png|jpeg)/gi;

module.exports = async function exportArticles(cid, options) {
  console.log(`fetching articles for cid:${cid}...`);
  const {
    author_name: author, column_title: name, update_frequency: frequency,
    column_cover: columnCover,
  } = await client.intro(cid);
  const { list } = await client.articles(cid);

  if (list.length === 0) {
    console.log('no articles found');
    return;
  }

  const dir = path.join(
    options.output || config.get('mdDir') || process.cwd(),
    filenamify([cid, author, name].join(' - ')),
  ) + (frequency === '全集' ? ' (全集)' : '');
  const staticDir = path.join(dir, 'static');
  ensureDirSync(dir);
  ensureDirSync(staticDir);


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
    '[:bar] :percent\n  [:current/:total] :title',
    { total: list.length, title: '', width: 20 },
  );

  await download(
    columnCover,
    staticDir,
    { filename: `cover.${columnCover.split('/').pop().split('.').pop()}` },
  );

  await Promise.all(list.map(async v => limit(async () => {
    const { id, article_title: title } = v;
    const article = await client.article(id);
    const content = (new Turndown()).turndown(article.article_content);
    const { article_cover: cover, audio_download_url: audioUrl } = article;

    const coverText = cover ? `![cover](${cover})` : '';
    const mp3Text = audioUrl ? `mp3: ${audioUrl}` : '';

    const filename = `${filenamify(title)}.md`;
    const staticRelativeDir = filename in oldPaths ? '../static' : './static';
    const file = oldPaths[filename] || path.join(dir, filename);
    let md = `# ${title}

${coverText}

${mp3Text}

${content}
`;
    const matches = md.match(IMG_REX) || [];
    await Promise.all(
      matches
        .filter(link => !existsSync(path.join(staticDir, link.split('/').pop())))
        .map(async (link) => { await download(link, staticDir); }),
    ).catch((err) => {
      console.error(err);
    });

    matches.forEach((link) => {
      md = md.replace(link, `${staticRelativeDir}/${link.split('/').pop()}`);
    });

    bar.tick({ title });

    if (existsSync(file) && readFileSync(file, { encoding: 'utf8' }) === md) {
      return;
    }

    writeFileSync(file, md);
  })));

  console.log(`articles saved to ${dir}`);
};
