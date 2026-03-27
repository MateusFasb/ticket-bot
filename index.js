const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const connectMongo = require("./database/mongo");
const config = require("./config.json");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.commands = new Map();

// comandos
fs.readdirSync("./commands").forEach(file => {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
});

// eventos
fs.readdirSync("./events").forEach(file => {
  require(`./events/${file}`)(client);
});

// conectar banco
connectMongo();

client.login(config.token);