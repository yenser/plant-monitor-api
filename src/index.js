// require('./exitHandler');
const express = require('express');
const db = require('./database');
const cors = require('cors');
const config = require('./config');

const main = async () => {
  const app = express();
 
  app.use(cors());

  
  app.get('/dbsize', async (req, res) => {
    const size = await db.getDatabaseSize();

    res.json({size}).status(200);
  });
  
  app.listen(config.server.port, () => {
    console.log(`App listening on http://localhost:${config.server.port}`);
  });
}


main();