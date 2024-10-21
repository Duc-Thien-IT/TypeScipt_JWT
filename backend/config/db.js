const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
    host: process.env.PG_HOST,
    dialect: 'postgres',
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection successfully.');
  })
  .catch(err => {
    console.error('Connection Failed', err);
  });

module.exports = sequelize;
