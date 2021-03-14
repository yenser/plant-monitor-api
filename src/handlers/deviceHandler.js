const repo = require('../repositories/deviceRepo');

const getDeviceStates = async () => {
  const devices = await repo.getDevices();

  const deviceStates = await Promise.all(devices.map(getDeviceState));

  return deviceStates;
}

const getDeviceState = async (device) => {
  const isOnline = await repo.getDeviceHealth(device);

  return {
    ...device,
    online: isOnline
  }
}


module.exports = {
  getDeviceStates
}