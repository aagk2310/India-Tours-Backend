const app = require('./app');
const dotenv = require('dotenv');

if (process.env.ENVIRONMENT === 'development')
  dotenv.config({ path: 'config.env' });
else if (process.env.ENVIRONMENT === 'production') {
  dotenv.config({ path: '/etc/config/.env' });
  dotenv.config({ path: '/etc/secrets/.env' });
}
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
