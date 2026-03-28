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
    try {
      console.log("Executando /setup-ticket:", interaction.user.tag);

      if (!interaction.inGuild()) {
        return await interaction.reply({
          content: "Esse comando só pode ser usado em servidor.",
          ephemeral: true
        });
      }

      await interaction.deferReply({ ephemeral: true });

      const member = await interaction.guild.members.fetch(interaction.user.id);

      if (!member.roles.cache.has(config.cargo_mod)) {
        return await interaction.editReply({
          content: "Sem permissão."
        });
      }

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
          text: interaction.client.user.username,
          iconURL: interaction.client.user.displayAvatarURL()
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
    } catch (err) {
      console.error("Erro no /setup-ticket:", err);

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          content: "Erro ao executar o comando."
        }).catch(() => {});
      } else {
        await interaction.reply({
          content: "Erro ao executar o comando.",
          ephemeral: true
        }).catch(() => {});
      }
    }
  }
};