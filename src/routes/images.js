const db = require('../repositories/database');
const deviceRepo = require('../repositories/deviceRepo');
const imageCapture = require('../handlers/imageCapture');
const format = require('date-fns/format');


module.exports = (app) => {
  app.post('/images/:fileName', async (req, res) => {
    
    const fileName = req.params.fileName;
    const contentType = req.headers['content-type'];

    const id = await db.saveImage(fileName, req.body, contentType);

    console.log('IMAGES CREATED', id);
    res.json(id).status(200);
  });

  app.get('/images', async (req, res) => {
    const imageIds = await db.getImageIds();

    res.json(imageIds).status(200);
  })

  app.get('/images/:imageId', async (req, res) => {
    const image = await db.getImage(req.params.imageId);
    if(!image) {
      res.sendStatus(404);
      return;
    }

    res.set({
      'Content-Type': image.content_type,
      'Content-Length': image.file.byteLength,
      'Content-Disposition': `attachment; filename="${image.name}";`
    });
    res.send(image.file).status(200);
  });

  app.delete('/images/:imageId', async (req, res) => {
    if(!req.params.imageId) {
      res.sendStatus(400);
      return;
    }
    
    await db.deleteImage(req.params.imageId);
    res.sendStatus(200);
  })

  app.post('/images/capture/:deviceId', async (req, res) => {
    try {
      const device = await deviceRepo.getDeviceById(req.params.deviceId);
      if(device === null || device.type !== 'camera') {
        res.sendStatus(400);
        return;
      }

      let name = req.body.name;
      
      if(!name) {
        const deviceName = device.name.replace(/[ ,.]/g, "-")
        name = `${deviceName}_${format(new Date(), 'yy-MM-dd_HH:mm:ss')}.jpg`;
      }

      console.log(name)

      if(!name.includes('.jpg') && !name.includes('.jpeg')) {
        name += '.jpg';
      }

      console.log(`Capturing image [${name}] from device [${device.name}]`);
  
      const id = await imageCapture.captureImageAndSave(device, name);
  
      res.json({id}).status(201);
    } catch(e) {
      console.log(e);
      res.sendStatus(500);
    }
  })
}
