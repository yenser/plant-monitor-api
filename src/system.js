
var { exec } = require('child_process');

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

module.exports = {
  getCpuTemp
}
