const { sequelize } = require('../../models/index.js');

async function connectToDB() {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL (Sequelize).");
  } catch (err) {
    console.error("Sequelize connection error:", err);
    throw err;
  }
}

module.exports = {
  sequelize,
  connectToDB
};
