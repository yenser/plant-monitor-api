const config = {};

config.server = {
  port: 8080
};

config.postgres = {
  user: 'app',
  host: '192.168.50.85',
  database: 'plantmonitor',
  password: 'abc123',
  port: 5432,
}

module.exports = config;