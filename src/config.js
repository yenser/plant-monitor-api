const config = {};

config.server = {
  port: 8080
};

config.cameraServers = [
  {
    name: 'zero 0',
    ip: '192.168.50.68',
    port: 8000
  },
  {
    name: 'zero 1',
    ip: '192.168.50.179',
    port: 8000
  }
]

config.postgres = {
  user: 'app',
  host: '192.168.50.156',
  database: 'plantmonitor',
  password: 'abc123',
  port: 5432,
}

module.exports = config;