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