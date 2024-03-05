const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const mongoose = require('mongoose');
const getZ = require('./utils/getZ');
const daySheetToOrders = require('./utils/daySheetToOrders');

const server = process.env.DB_ADDRESS;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const database = process.env.DB_NAME;
const dbPort = process.env.DB_PORT;
const uri = `mongodb://${user}:${pass}@${server}:${dbPort}/${database}?authSource=admin`;

mongoose.connect(uri);

const connection = mongoose.connection;

connection.once('open', function () {
  console.log('MongoDB connection established successfully');
});

(async () => {
  console.log(await getZ('2024-03-04'));
  // await daySheetToOrders('2023-01-01', '2025-01-01', 'Main', false)
})();
