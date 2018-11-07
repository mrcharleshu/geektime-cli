#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

const article = require('../lib/article');
const articles = require('../lib/articles');
const handleExport = require('../lib/handleExport');
const configCli = require('../lib/configCli');
const info = require('../lib/info');
const login = require('../lib/login');
const products = require('../lib/products');

program.version(pkg.version);

program
  .command('login <phone> <password>')
  .alias('l')
  .description('登录极客时间')
  .option('-c, --code <code>', '指定国家区号')
  .action(login);

program
  .command('config')
  .alias('c')
  .description('调整参数设置')
  .option('-d, --dir <dir>', '设置文章导出目录')
  .option('-m, --mp3 <dir>', '设置音频导出目录')
  .option('-v, --video <dir>', '设置视频导出目录')
  .action(configCli);

program
  .command('info')
  .alias('i')
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
  .alias('e')
  .description('导出专栏 文章/音频/视频')
  .option('-o, --output [dir]', '导出目录')
  .option('-m, --mp3', '导出音频')
  .option('-v, --video', '导出视频')
  .action(handleExport);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
