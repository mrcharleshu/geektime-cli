#!/usr/bin/env node

const program = require('commander');
const Conf = require('conf');
const Geektime = require('geektime');
const Turndown = require('turndown');
const download = require('download');
const { writeFileSync } = require('fs');
const path = require('path');
const filenamify = require('filenamify');
const { ensureDirSync } = require('fs-extra');
const pLimit = require('p-limit');
const ProgressBar = require('progress');
const opn = require('opn');
const pkg = require('./package.json');

const limit = pLimit(10); // avoid API rate limit
const mp3Limit = pLimit(2);
const config = new Conf();

function getClient() {
  const phone = config.get('phone');
  const password = config.get('password');
  const client = new Geektime(phone, password);

  return client;
}

program.version(pkg.version);

program
  .command('login <phone> <password>')
  .description('登录极客时间')
  .action(async (phone, password) => {
    config.set('phone', phone);
    config.set('password', password);

    console.log('login info saved 😊');
  });

program
  .command('products')
  .description('获取已购列表')
  .action(async () => {
    const client = getClient();
    const products = await client.products();

    products.forEach((v) => {
      console.log(`#${v.id} ${v.title} (${v.list.length})`);
      console.log('--------------');

      v.list.forEach((column) => {
        const { author_name: author, column_id: cid } = column.extra;
        console.log(`  ${cid}: ${column.title} (by ${author})`);
      });
    });
  });

program
  .command('articles <cid>')
  .description('获取文章列表')
  .action(async (cid) => {
    const client = getClient();
    const { list: articles } = await client.articles(cid);

    articles.forEach((v) => {
      console.log(`#${v.id} ${v.article_title}`);
    });
  });

program
  .command('article <id>')
  .description('获取文章内容')
  .action(async (id) => {
    const client = getClient();
    const res = await client.article(id);
    const content = (new Turndown()).turndown(res.article_content);

    console.log(res.article_title);
    console.log(content);
  });

program
  .command('export <cid>')
  .description('导出专栏文章')
  .option('-o, --output [dir]', '导出目录')
  .action(async (cid, options) => {
    const client = getClient();
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
      const { article_cover: cover, audio_download_url: mp3 } = article;

      const coverText = cover ? `![cover](${cover})` : '';
      const mp3Text = mp3 ? `mp3: ${mp3}` : '';

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
  });

program
  .command('mp3 <cid>')
  .description('导出专栏音频')
  .option('-o, --output [dir]', '导出目录')
  .action(async (cid, options) => {
    const client = getClient();
    const { list } = await client.audios(cid);

    if (list.length === 0) {
      console.log('音频列表为空');
    }

    const dir = path.join(options.output || process.cwd(), cid, 'mp3');
    ensureDirSync(dir);

    const bar = new ProgressBar(
      'ALL: [:bar] :percent\n  [:current/:total] :title',
      { total: list.length, title: '', width: 20 },
    );

    await Promise.all(list.map(async v => mp3Limit(async () => {
      const { id, article_title: title, audio_download_url: mp3 } = v;

      bar.tick({ title });

      const downBar = new ProgressBar(
        '    [:title] [:bar] :percent', { total: 100, clear: true, width: 20 },
      );

      downBar.tick({ title: `${title.slice(0, 20)}...` });

      await download(mp3, dir, { filename: `${id}. ${filenamify(title)}.mp3` })
        .on('downloadProgress', (progress) => {
          downBar.update(progress.percent);
        });
    })));

    console.log(`audios saved to ${dir}`);

    opn(dir);

    process.exit(0);
  });

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
