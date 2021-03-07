const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config.postgres);


const getDatabaseSize = async () => {
  const res = await pool.query("SELECT pg_size_pretty( pg_database_size('plantmonitor') );", []);
  return res.rows[0].pg_size_pretty;
}

module.exports = {
  getDatabaseSize
}