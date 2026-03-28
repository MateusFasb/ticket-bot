const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const http = require("http");

console.log("Iniciando bot...");

// HTTP (necessário pro Render)
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot online");
}).listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
});

// Client Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Logs de erro (pra parar erro silencioso)
process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
});

// Ready
client.once("clientReady", () => {
  console.log(`Online: ${client.user.tag}`);
  console.log(`Bot ID: ${client.user.id}`);
  console.log(`Application ID: ${client.application.id}`);
});

// Slash + interação
client.on("interactionCreate", async (interaction) => {
  try {
    console.log("interactionCreate recebido");

    // COMANDO
    if (interaction.isChatInputCommand()) {
      console.log("Comando:", interaction.commandName);

      if (interaction.commandName === "setup-ticket") {
        await interaction.deferReply({ ephemeral: true });

        const embed = new EmbedBuilder()
          .setTitle("Criação de Ticket")
          .setDescription(
`🎫 Por favor, selecione uma opção que corresponde ao seu ticket.

❓ - Dúvida geral
💡 - Sugestão
🚨 - Denúncia de membro

⚠️ Os tickets são revisados a cada 24 horas.`
          )
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL()
          });

        const menu = new StringSelectMenuBuilder()
          .setCustomId("ticket_select")
          .setPlaceholder("Nada selecionado")
          .addOptions([
            {
              label: "Dúvida geral",
              value: "duvida"
            },
            {
              label: "Sugestão",
              value: "sugestao"
            },
            {
              label: "Denúncia de membro",
              value: "denuncia"
            }
          ]);

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.channel.send({
          embeds: [embed],
          components: [row]
        });

        await interaction.editReply({
          content: "Painel enviado."
        });

        console.log("setup-ticket OK");
        return;
      }
    }

    // SELECT MENU
    if (interaction.isStringSelectMenu()) {
      console.log("Select:", interaction.values[0]);

      if (interaction.customId === "ticket_select") {
        await interaction.reply({
          content: `Selecionado: ${interaction.values[0]}`,
          ephemeral: true
        });

        return;
      }
    }

  } catch (err) {
    console.error("Erro geral:", err);

    if (interaction.isRepliable()) {
      if (interaction.deferred) {
        await interaction.editReply({ content: "Erro." }).catch(() => {});
      } else if (!interaction.replied) {
        await interaction.reply({ content: "Erro.", ephemeral: true }).catch(() => {});
      }
    }
  }
});

// LOGIN (parte crítica)
console.log("Antes do login...");

client.login(process.env.TOKEN)
  .then(() => console.log("Login enviado"))
  .catch((err) => console.error("Erro login:", err));

console.log("Depois do login...");