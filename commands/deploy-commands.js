const { REST, Routes } = require("discord.js");
const fs = require("fs");
const config = require("./config.json");

const commands = [];

const commandFiles = fs.readdirSync("./commands");

for (const file of commandFiles) {
  const cmd = require(`./commands/${file}`);
  commands.push(cmd.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  await rest.put(
    Routes.applicationCommands("1486904682705326181"),
    { body: commands }
  );

  console.log("Comandos registrados");
})();