const { connectToDB } = require('./data/db');
const { subscribeToNats } = require('./api/natsSubscriber');

async function startApp() {
  try {
    await connectToDB();
    subscribeToNats();
    console.log("Application started successfully.");
  } catch (err) {
    console.error("Error starting application:", err);
    process.exit(1);
  }
}

startApp();
