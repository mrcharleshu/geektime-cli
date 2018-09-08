#!/usr/bin/env node


const { writeFileSync } = require('fs');
const path = require('path');
const filenamify = require('filenamify');
const { ensureDirSync } = require('fs-extra');
const pLimit = require('p-limit');
const ProgressBar = require('progress');
const opn = require('opn');
const Turndown = require('turndown');
const client = require('./client');

const limit = pLimit(10); // avoid API rate limit

module.exports = async function exportArticles(cid, options) {
  const { list } = await client.articles(cid);

  if (list.length === 0) {
    console.log('文章列表为空');
    return;
  }

  const dir = path.join(options.output || process.cwd(), cid);
  ensureDirSync(dir);

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

    writeFileSync(
      path.join(dir, `${id}. ${filenamify(title)}.md`),
      `# ${title}

${coverText}

${mp3Text}

${content}
      `,
    );

    bar.tick({ title });
  })));

  console.log(`articles saved to ${dir}`);

  opn(dir);

  process.exit(0);
};
