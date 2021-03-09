
const { exec } = require('child_process');
const db = require('./repositories/database');

const getCpuTemp = async () => {
  return new Promise((resolve, reject) => {
    exec('cat /sys/class/thermal/thermal_zone0/temp', (error, stdout, stderr) => {
      if(error) {
        reject(error);
      }

      const temp = parseInt(stdout);
      resolve(temp/1000);
    });
  });
}


const registerDevice = () => {
  setInterval( async () => {
    const temp = await getCpuTemp();
    await db.register('carrack', temp, 'host');
  }, 5000);
}

module.exports = {
  getCpuTemp,
  registerDevice
}
