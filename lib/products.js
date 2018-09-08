const client = require('./client');

module.exports = async function products() {
  const res = await client.products();

  res.forEach((v) => {
    console.log(`#${v.id} ${v.title} (${v.list.length})`);
    console.log('--------------');

    v.list.forEach((column) => {
      const { author_name: author, column_id: cid } = column.extra;
      console.log(`  ${cid}: ${column.title} (by ${author})`);
    });
    console.log();
  });
};
