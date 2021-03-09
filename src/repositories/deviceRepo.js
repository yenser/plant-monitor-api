const { pool } = require('./database');

const createDevice = async (name, type, ipAddress, port) => {
   const { rows } = await pool.query('CALL create_device($1, $2, $3, $4);', [name, type.toLowerCase(), ipAddress, port]);
}

const getDevices = async () => {
  const { rows } = await pool.query('SELECT id, name, type, ip_address, port FROM devices;', []);
  return rows;
}

const getDeviceById = async (id) => {
  const { rows } = await pool.query('SELECT id, name, type, ip_address, port FROM devices WHERE id = $1;', [id]);
  if(rows.length === 0) {
    return null;
  }
  
  return rows[0];
}

module.exports = {
  createDevice,
  getDevices,
  getDeviceById
}