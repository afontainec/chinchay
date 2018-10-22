
exports.seed = async (knex) => {
  const promises = [];
  const tables = await knex.raw("select tablename from pg_tables where schemaname='public' and tablename NOT LIKE '%knex%'");
  for (let i = 0; i < tables.rows.length; i++) {
    await emptyTable(knex, tables.rows[i].tablename);
  }
  return Promise.all(promises);
};


function emptyTable(knex, table_name) {
  return new Promise((resolve, reject) => {
    knex(table_name).del() // Deletes ALL existing entries
      .then(() => { // Inserts seed entries one by one in series
        resolve(knex.raw(`ALTER SEQUENCE ${table_name}_id_seq RESTART WITH 1`));
      }).catch((err) => {
        reject(err);
      });
  });
}
