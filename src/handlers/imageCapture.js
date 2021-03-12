const got = require('got');
const imageRepo = require('../repositories/imagesRepo');

const captureImageAndSave = async (device, name) => {
  const resp = await getImageFromDevice(device, name);

  const id = await imageRepo.saveImage(name, resp.body, resp.headers['content-type']);

  console.log(`Image [${name}] saved.`);
  return id;
}

const assembleDeviceCaptureUrl = (device) => {
  return `http://${device.ip_address}:${device.port}/capture`;
}

const getImageFromDevice = async (device, name) => {
  const url = assembleDeviceCaptureUrl(device);

  const resp = await got({
    method: 'GET',
    url,
    responseType: 'buffer'
  });

  return resp;
}

module.exports = {
  captureImageAndSave
}