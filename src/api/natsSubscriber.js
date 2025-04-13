const { connect, StringCodec } = require('nats');
const { processSubscription } = require('../services/subscriptionService');

async function subscribeToNats() {
  try {
    const natsUrl = process.env.NATS_URL;
    const nc = await connect({ servers: natsUrl });
    console.log(`Connected to NATS at ${natsUrl}`);

    const sc = StringCodec();
    const sub = nc.subscribe('nats.subscription');

    (async () => {
      for await (const msg of sub) {
        const data = sc.decode(msg.data);
        console.log(`Received message on 'nats.subscription': ${data}`);
        processSubscription(data);
      }
    })();
  } catch (err) {
    console.error("Failed to subscribe to NATS:", err);
  }
}

module.exports = {
  subscribeToNats,
};
