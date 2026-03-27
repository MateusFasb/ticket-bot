const { createTranscript } = require("discord-html-transcripts");

async function gerarTranscript(channel) {
  return await createTranscript(channel, {
    limit: -1,
    returnType: "attachment",
    filename: `ticket-${channel.id}.html`
  });
}

module.exports = { gerarTranscript };