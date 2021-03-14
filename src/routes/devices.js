const repo = require('../repositories/deviceRepo');
const handler = require('../handlers/deviceHandler');

module.exports = (app) => {

  app.post('/devices', async (req, res) => {
    const body = req.body;
    await repo.createDevice(body.name, body.type, body.ipAddress, body.port);
    res.sendStatus(201);
  });

  app.get('/devices', async (req, res) => {

    const devices = await handler.getDeviceStates();

    res.json(devices).status(200);
  });

  app.get('/devices/:deviceId', async (req, res) => {

    const device = await repo.getDeviceById(req.params.deviceId);

    if(device === null) {
      res.sendStatus(404);
    }

    res.json(device).status(200);
  });

  app.put('/devices/:deviceId', async (req, res) => {

    res.status(200);
  });

  app.delete('/devices/:deviceId', async (req, res) => {

    res.status(200);
  });
}