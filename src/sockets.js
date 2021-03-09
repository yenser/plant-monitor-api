const db = require('./repositories/database');


module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log(socket.id);

    socket.on('register', async (data) => {
      await db.registerDevice(data.name, data.temperature, socket.id)
    })

    socket.on('getSystems', async () => {
      const systems = await db.getSystems();
      const validatedSystems = await validateActiveSystems(systems, io)
      socket.emit('systems', validatedSystems);
    })

  });

  setInterval(async () => {
    const systems = await db.getSystems();
    const validatedSystems = await validateActiveSystems(systems, io)
    io.emit('systems', validatedSystems);
  }, 5000);
}

const validateActiveSystems = async (systems, io) => {
  const ids = await io.allSockets();

  return systems.map(s => {
    const status = ids.has(s.socketid) || s.socketid === 'host';
    return {
      ...s,
      status
    }
  })
}