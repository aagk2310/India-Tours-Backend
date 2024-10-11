const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');
const importData = require('./importData');

if (process.env.ENVIRONMENT === 'development')
  dotenv.config({ path: 'config.env' });
else if (process.env.ENVIRONMENT === 'production')
  dotenv.config({ path: '/etc/config/.env' });

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('Database connection successful');
    importData();
  })
  .catch((err) => console.log(err));
