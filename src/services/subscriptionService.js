const { Message } = require('../../models');

async function processSubscription(data) {
  console.log(`Processing subscription data: ${data}`);

  if (!data || typeof data !== 'string' || data.trim() === '') {
    console.warn("Invalid message received, skipping.");
    return;
  }

  try {
    const saved = await Message.create({ content: data.trim() });
    console.log(`Message saved with ID: ${saved.id}`);
  } catch (err) {
    console.error("Failed to save message:", err);
  }
}

module.exports = {
  processSubscription,
};
