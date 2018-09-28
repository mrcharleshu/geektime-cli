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

const client = require('./client');

const config = new Conf();
const limit = pLimit(10); // avoid API rate limit

module.exports = async function exportArticles(cid, options) {
  const {
    author_name: author, column_title: name, update_frequency: frequency,
  } = await client.intro(cid);
  const { list } = await client.articles(cid);

  if (list.length === 0) {
    console.log('文章列表为空');
    return;
  }

  const dir = path.join(
    options.output || config.get('mdDir') || process.cwd(),
    filenamify([cid, author, name].join(' - ')),
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
    '[:bar] :percent\n  [:current/:total] :title',
    { total: list.length, title: '', width: 20 },
  );

  await Promise.all(list.map(async v => limit(async () => {
    const { id, article_title: title } = v;
    const article = await client.article(id);
    const content = (new Turndown()).turndown(article.article_content);
    const { article_cover: cover, audio_download_url: audioUrl } = article;

    const coverText = cover ? `![cover](${cover})` : '';
    const mp3Text = audioUrl ? `mp3: ${audioUrl}` : '';

    bar.tick({ title });

    const fileName = `${filenamify(title)}.md`;
    const file = oldPaths[fileName] || path.join(dir, fileName);
    const md = `# ${title}

${coverText}

${mp3Text}

${content}
`;


    if (existsSync(file) && readFileSync(file, { encoding: 'utf8' }) === md) {
      return;
    }

    writeFileSync(file, md);
  })));

  console.log(`articles saved to ${dir}`);
};
