const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const http = require("http");
const connectMongo = require("./database/mongo");
const config = require("./config.json");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot online");
}).listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
});

client.commands = new Map();

fs.readdirSync("./commands").forEach(file => {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
});

fs.readdirSync("./events").forEach(file => {
  require(`./events/${file}`)(client);
});

connectMongo();

client.login(process.env.TOKEN);