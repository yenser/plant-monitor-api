const exitHandler = require('./exitHandler');
const app = require('express')();
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const http = require('http').createServer(app);
const db = require('./repositories/database');
const sys = require('./system');
const cors = require('cors');
const config = require('./config');

const io = new Server(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

require('./sockets')(io);


const main = async () => {
  exitHandler();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.raw({ type: 'image/jpeg', limit: '10mb'}));

  require('./routes/devices')(app);

  app.get('/dbsize', async (req, res) => {
    const size = await db.getDatabaseSize();

    res.json({size}).status(200);
  });

  app.get('/systems', async (req, res) => {
    const temp = await sys.getCpuTemp();

    const systems = [
      {
        system: 'carrack',
        temp
      }
    ]

    res.json(systems).status(200);
  });



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
      'Content-Disposition': `inline; filename="${image.name}";`
    });
    res.send(image.file).status(200);
  })
  
  http.listen(config.server.port, () => {
    console.log(`App listening on http://localhost:${config.server.port}`);

    sys.registerDevice();
  });
}


main();