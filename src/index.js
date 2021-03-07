require('./exitHandler');
const app = require('express')();
const { Server } = require('socket.io');
const http = require('http').createServer(app);
const db = require('./database');
const sys = require('./system');
const cors = require('cors');
const config = require('./config');

const io = new Server(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const main = async () => {
 
  app.use(cors());


  io.on('connection', async (socket) => {
    console.log(socket.id);

    socket.on('getSystems', async () => {
      console.log('getSystems')
      const temp = await sys.getCpuTemp();
  
      const systems = [
        {
          system: 'carrack',
          temp
        }
      ]
  
      console.log(systems);
      socket.emit('systems', systems);
    })
  
  });

  setInterval(async () => {
    const temp = await sys.getCpuTemp();

    const systems = [
      {
        system: 'carrack',
        temp
      }
    ]

    console.log(systems);
    io.emit('systems', systems);
  }, 5000);


  


  
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
  })
  
  http.listen(config.server.port, () => {
    console.log(`App listening on http://localhost:${config.server.port}`);
  });
}


main();