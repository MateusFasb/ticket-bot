module.exports = (client) => {
  client.once("clientReady", () => {
    console.log(`Online: ${client.user.tag}`);
  });
};