const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const http = require("http");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot online");
}).listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
});

client.once("clientReady", () => {
  console.log(`Online: ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  try {
    console.log("interactionCreate recebido");

    if (interaction.isChatInputCommand()) {
      console.log("Comando recebido:", interaction.commandName);

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
              value: "duvida",
              description: "Abrir ticket de dúvida geral"
            },
            {
              label: "Sugestão",
              value: "sugestao",
              description: "Enviar uma sugestão"
            },
            {
              label: "Denúncia de membro",
              value: "denuncia",
              description: "Denunciar um membro"
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

        console.log("/setup-ticket executado com sucesso");
        return;
      }
    }

    if (interaction.isStringSelectMenu()) {
      console.log("Select menu recebido:", interaction.customId);

      if (interaction.customId === "ticket_select") {
        await interaction.reply({
          content: `Você selecionou: ${interaction.values[0]}`,
          ephemeral: true
        });

        console.log("Select menu respondeu com sucesso");
        return;
      }
    }
  } catch (err) {
    console.error("Erro em interactionCreate:", err);

    if (interaction.isRepliable()) {
      if (interaction.deferred) {
        await interaction.editReply({
          content: "Erro ao processar interação."
        }).catch(() => {});
      } else if (!interaction.replied) {
        await interaction.reply({
          content: "Erro ao processar interação.",
          ephemeral: true
        }).catch(() => {});
      }
    }
  }
});

client.login(process.env.TOKEN)
  .then(() => console.log("Login no Discord enviado"))
  .catch((err) => console.error("Erro ao logar no Discord:", err));

  client.once("clientReady", () => {
  console.log(`Online: ${client.user.tag}`);
  console.log(`Bot ID: ${client.user.id}`);
  console.log(`Application ID: ${client.application.id}`);
});

console.log("TOKEN existe?", !!process.env.TOKEN);
console.log("TOKEN tamanho:", process.env.TOKEN ? process.env.TOKEN.length : 0);