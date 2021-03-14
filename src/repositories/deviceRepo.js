const { pool } = require('./database');
const got = require('got');

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

const getDeviceHealth = async (device) => {
  try {
    const url = createHealthcheckUrl(device);

    const resp = await got({
      method: 'GET',
      url,
      responseType: 'json'
    });

    return resp.statusCode === 200;
  } catch(err) {
    return false;    
  }
}

const createHealthcheckUrl = (device) => {
  return `http://${device.ip_address}:${device.port}/healthcheck`;
}


module.exports = {
  createDevice,
  getDevices,
  getDeviceById,
  getDeviceHealth
}