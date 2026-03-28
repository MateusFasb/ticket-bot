const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require("discord.js");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      try {
        console.log("Comando recebido:", interaction.commandName);

        const cmd = client.commands.get(interaction.commandName);
        if (!cmd) {
          console.log("Comando não encontrado:", interaction.commandName);
          return;
        }

        await cmd.execute(interaction);
      } catch (err) {
        console.error(`Erro no comando ${interaction.commandName}:`, err);

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "Erro ao executar esse comando.",
            ephemeral: true
          }).catch(() => {});
        } else {
          await interaction.reply({
            content: "Erro ao executar esse comando.",
            ephemeral: true
          }).catch(() => {});
        }
      }

      return;
    }

    if (interaction.isStringSelectMenu()) {
      try {
        const valor = interaction.values[0];

        const modal = new ModalBuilder()
          .setCustomId(`modal_${valor}`)
          .setTitle("Abrir Ticket");

        modal.addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("nome")
              .setLabel("Como podemos te chamar?")
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("descricao")
              .setLabel("Descreva seu caso")
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
          )
        );

        await interaction.showModal(modal);
      } catch (err) {
        console.error("Erro no select menu:", err);

        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: "Erro ao abrir o formulário.",
            ephemeral: true
          }).catch(() => {});
        }
      }

      return;
    }
  });
};