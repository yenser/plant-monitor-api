const { pool } = require('./database');

const saveImage = async (name, file, contentType) => {
   const { rows } = await pool.query('INSERT INTO images (name, file, content_type) VALUES ($1, $2, $3) RETURNING id;', [name, file, contentType]);

   return rows[0].id;
}

module.exports = {
  saveImage
}