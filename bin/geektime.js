#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

const article = require('../lib/article');
const articles = require('../lib/articles');
const exportArticles = require('../lib/exportArticles');
const exportMp3 = require('../lib/exportMp3');
const configCli = require('../lib/configCli');
const info = require('../lib/info');
const login = require('../lib/login');
const products = require('../lib/products');

program.version(pkg.version);

program
  .command('login <phone> <password>')
  .description('登录极客时间')
  .action(login);

program
  .command('config')
  .description('调整参数设置')
  .option('-d, --dir <dir>', '默认导出目录')
  .option('-o, --auto-open <open>', '自动打开目录 [0/1]')
  .action(configCli);

program
  .command('info')
  .description('显示设置信息')
  .action(info);

program
  .command('products')
  .description('获取已购列表')
  .action(products);

program
  .command('articles <cid>')
  .description('获取文章列表')
  .action(articles);

program
  .command('article <id>')
  .description('获取文章内容')
  .action(article);

program
  .command('export <cid>')
  .description('导出专栏文章')
  .option('-o, --output [dir]', '导出目录')
  .action(exportArticles);

program
  .command('mp3 <cid>')
  .description('导出专栏音频')
  .option('-o, --output [dir]', '导出目录')
  .action(exportMp3);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
