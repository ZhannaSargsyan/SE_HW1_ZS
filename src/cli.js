#!/usr/bin/env node

const { default: inquirer } = require('inquirer');
const { connect, StringCodec } = require('nats');
const { Message } = require('../models');
const { connectToDB } = require('./data/db');

async function sendMessage(msg) {
  const nc = await connect({ servers: process.env.NATS_URL });
  const sc = StringCodec();
  nc.publish("nats.subscription", sc.encode(msg));
  console.log("Message sent:", msg);
  await nc.drain();
}

async function listenToMessages() {
  const nc = await connect({ servers: process.env.NATS_URL });
  const sc = StringCodec();
  const sub = nc.subscribe('nats.subscription');

  for await (const msg of sub) {
    const data = sc.decode(msg.data);
    console.log(`Received message on 'nats.subscription': ${data}`);
  }
}

async function showMessages() {
  await connectToDB();
  const msgs = await Message.findAll({ order: [['createdAt', 'DESC']] });
  console.log("\n Message history:");
  msgs.forEach(m => {
    console.log(`[${m.createdAt}] ${m.content}`);
  });
}

async function main() {
  console.log(" Nats CLI");

  const loop = async () => {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Choose an action:',
        choices: ['Send Message', 'Show Message History', 'Listen to Messages', 'Exit'],
      }
    ]);

    if (action === 'Send Message') {
      const { message } = await inquirer.prompt([
        {
          type: 'input',
          name: 'message',
          message: 'Enter message to send:'
        }
      ]);
      await sendMessage(message);
      await loop();
    } else if (action === 'Show Message History') {
      await showMessages();
      await loop();
    } else if (action === 'Listen to Messages') {
      console.log("Listening for messages...");
      await listenToMessages();
    } else {
      console.log("Bye!");
      process.exit(0);
    }
  };
  
  await loop();
}

main();
