const app = require('./app');
const config = require('./config');

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Laundry Order Management backend listening on port ${PORT}`);
});
