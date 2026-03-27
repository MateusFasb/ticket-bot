const { verificarTickets } = require("../utils/ticketManager");

module.exports = (client) => {
  client.once("ready", () => {
    console.log(`Online: ${client.user.tag}`);

    setInterval(() => {
      verificarTickets(client);
    }, 60000);
  });
};

module.exports = (client) => {
  client.once("ready", () => {
    console.log(`Online: ${client.user.tag}`);
  });
};