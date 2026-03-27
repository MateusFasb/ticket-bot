const mongoose = require("mongoose");
const config = require("../config.json");

module.exports = async () => {
  try {
    await mongoose.connect(config.mongo_uri);
    console.log("Mongo conectado");
  } catch (err) {
    console.error("Erro Mongo:", err);
  }
};