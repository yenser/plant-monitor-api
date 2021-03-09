const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config.postgres);


const getDatabaseSize = async () => {
  const res = await pool.query("SELECT pg_size_pretty( pg_database_size('plantmonitor') );", []);
  return res.rows[0].pg_size_pretty;
}

const register = async (name, temperature, socketId) => {
  await pool.query('CALL registerDevice($1, $2, $3);', [name, temperature, socketId]);
}

const getSystems = async () => {
  const { rows } = await pool.query('SELECT name, temperature, socketid FROM systems', []);
  return rows;
}

const saveImage = async (name, bytes, contentType) => {
  const { rows } = await pool.query('INSERT INTO images (name, file, content_type) VALUES ($1, $2, $3) RETURNING id;', [name, bytes, contentType]);

  return rows[0]
}

const getImage = async (imageId) => {
  const { rows } = await pool.query('SELECT name, file FROM images WHERE id = $1 ;', [imageId]);

  if(rows.length === 0) {
    return null;
  } else {
    return rows[0];
  }
}

const getImageIds = async (skip = 0, limit = 100) => {
  const { rows } = await pool.query('SELECT id, name FROM images OFFSET $1 LIMIT $2 ;', [skip, limit]);

  return rows;
}

module.exports = {
  pool,
  getDatabaseSize,
  register,
  getSystems,
  saveImage,
  getImage,
  getImageIds
}