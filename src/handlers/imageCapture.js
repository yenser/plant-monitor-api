const got = require('got');
const imageRepo = require('../repositories/imagesRepo');

const captureImageAndSave = async (device) => {
  const name = 'name.jpg';
  const resp = await getImageFromDevice(device, name);

  const id = await imageRepo.saveImage(name, resp.body, resp.headers['content-type']);

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