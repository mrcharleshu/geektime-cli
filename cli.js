#!/usr/bin/env node

const program = require('commander');
const Conf = require('conf');
const Geektime = require('geektime');
const pkg = require('./package.json');

const config = new Conf();

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
    const phone = config.get('phone');
    const password = config.get('password');
    const client = new Geektime(phone, password);
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

program.parse(process.argv);
