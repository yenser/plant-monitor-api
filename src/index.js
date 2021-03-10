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
  require('./routes/images')(app);
  

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

  
  http.listen(config.server.port, () => {
    console.log(`App listening on http://localhost:${config.server.port}`);

    sys.registerDevice();
  });
}


main();