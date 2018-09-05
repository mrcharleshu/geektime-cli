#!/usr/bin/env node

const program = require('commander');
const Conf = require('conf');
const Geektime = require('geektime');
const Turndown = require('turndown');
const pkg = require('./package.json');

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

// TODO: preview html
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

program.parse(process.argv);
