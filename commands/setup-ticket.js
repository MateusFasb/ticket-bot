const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

const config = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-ticket")
    .setDescription("Enviar painel de tickets"),

  async execute(interaction) {

    if (!interaction.member.roles.cache.has(config.cargo_mod)) {
      return interaction.reply({ content: "Sem permissão", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle("Criação de Ticket")
      .setDescription(
`:🎫 Selecione uma opção

❓ Suporte
💡 Sugestão
🚨 Denúncia`
      )
      .setFooter({
        text: interaction.client.user.username,
        iconURL: interaction.client.user.displayAvatarURL()
      });

    const menu = new StringSelectMenuBuilder()
      .setCustomId("ticket_select")
      .setPlaceholder("Nada selecionado")
      .addOptions([
        { label: "Suporte", value: "duvida" },
        { label: "Sugestão", value: "sugestao" },
        { label: "Denúncia", value: "denuncia" }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.channel.send({
      embeds: [embed],
      components: [row]
    });

    await interaction.reply({ content: "Painel enviado.", ephemeral: true });
  }
};