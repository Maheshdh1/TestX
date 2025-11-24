require('dotenv').config();
const app = require('./src/app');
const connectDb = require('./src/config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server', err);
  process.exit(1);
});
