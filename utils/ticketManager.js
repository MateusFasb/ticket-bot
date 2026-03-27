const Ticket = require("../models/Ticket");

async function verificarTickets(client) {

  const agora = new Date();

  const tickets = await Ticket.find({
    status: "closed",
    deleteAt: { $lte: agora }
  });

  for (const t of tickets) {

    const canal = await client.channels.fetch(t.channelId).catch(() => null);

    if (canal) {
      await canal.delete().catch(err => {
        console.error("Erro ao deletar canal:", err.message);
      });
    }

    await Ticket.deleteOne({ _id: t._id });
  }
}

module.exports = { verificarTickets };