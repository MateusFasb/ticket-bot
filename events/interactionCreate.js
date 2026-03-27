const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

const config = require("../config.json");
const Ticket = require("../models/Ticket");
const { checkCooldown } = require("../utils/antiSpam");
const { gerarTranscript } = require("../utils/transcript");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {

    // comandos
    if (interaction.isChatInputCommand()) {
      const cmd = client.commands.get(interaction.commandName);
      if (cmd) await cmd.execute(interaction);
    }

    // SELECT → abre modal
    if (interaction.isStringSelectMenu()) {

      let modal = new ModalBuilder()
        .setCustomId(`modal_${interaction.values[0]}`)
        .setTitle("Abrir Ticket");

      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("nome")
            .setLabel("Como podemos te chamar?")
            .setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("descricao")
            .setLabel("Descreva seu caso")
            .setStyle(TextInputStyle.Paragraph)
        )
      );

      return interaction.showModal(modal);
    }

    // MODAL → cria ticket
    if (interaction.isModalSubmit()) {

      const categoria = interaction.customId.replace("modal_", "");

      const ativos = await Ticket.countDocuments({
        userId: interaction.user.id,
        status: "open"
      });

      if (ativos >= 2) {
        return interaction.reply({
          content: "Máximo de 2 tickets abertos.",
          ephemeral: true
        });
      }

      if (!checkCooldown(interaction.user.id)) {
        return interaction.reply({
          content: "Espere antes de abrir outro ticket.",
          ephemeral: true
        });
      }

      const canal = await interaction.guild.channels.create({
        name: `${categoria}-${interaction.user.username}`,
        parent: config.categoria_tickets,
        topic: interaction.user.id,
        type: 0,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: ["ViewChannel"] },
          { id: interaction.user.id, allow: ["ViewChannel", "SendMessages"] },
          { id: config.cargo_mod, allow: ["ViewChannel", "SendMessages"] }
        ]
      });

      await Ticket.create({
        channelId: canal.id,
        userId: interaction.user.id,
        categoria
      });

      const embed = new EmbedBuilder()
        .setTitle("Ticket criado")
        .setDescription(`Olá ${interaction.user}`)
        .addFields(
          {
            name: "Nome",
            value: interaction.fields.getTextInputValue("nome")
          },
          {
            name: "Descrição",
            value: interaction.fields.getTextInputValue("descricao")
          }
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("fechar_ticket")
          .setLabel("Fechar")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("deletar_ticket")
          .setLabel("Deletar")
          .setStyle(ButtonStyle.Secondary)
      );

      await canal.send({
        content: `${interaction.user}`,
        embeds: [embed],
        components: [row]
      });

      await interaction.reply({ content: `Criado: ${canal}`, ephemeral: true });
    }

    // BOTÕES
    if (interaction.isButton()) {

      if (interaction.customId === "fechar_ticket") {

        const ticket = await Ticket.findOne({
          channelId: interaction.channel.id
        });

        if (!ticket) return;

        ticket.status = "closed";
        ticket.deleteAt = new Date(Date.now() + (3 * 24 * 60 * 60 * 1000));
        await ticket.save();

        const transcript = await gerarTranscript(interaction.channel);

        const logChannel = await client.channels.fetch(config.canal_logs);

        await logChannel.send({
          content: `Ticket de <@${ticket.userId}>`,
          files: [transcript]
        });

        await interaction.channel.setParent(config.categoria_logs);

        const ts = Math.floor(ticket.deleteAt.getTime() / 1000);

        await interaction.channel.send({
          content: `⏳ Será deletado <t:${ts}:R>`
        });
      }

      if (interaction.customId === "deletar_ticket") {

        if (!interaction.member.roles.cache.has(config.cargo_mod)) {
          return interaction.reply({ content: "Sem permissão", ephemeral: true });
        }

        await interaction.channel.delete().catch(() => {});
      }
    }
  });
};