const mongoose = require('mongoose');

const fs = require('fs');

const Day = require('../models/daySheets/daySchema');

const pkg = require('pg');
const { Client } = pkg;
const { host, port, user, password, database } = process.env;
const { drizzle } = require('drizzle-orm/node-postgres');
const schema = require('../models/schema');

const toDrizzle = async (start, end) => {
  const client = new Client({
    host,
    port: parseInt(port),
    user,
    password,
    database,
  });
  await client.connect();
  const db = drizzle(client, { schema });

  const begin = Date.now();
  if (!end) end = start;
  const days = await Day.find({
    date: {
      $gte: start,
      $lte: end,
    },
  });

  const output = [];

  let currDay = 0;
  const totalDays = days.length;
  while (currDay < totalDays) {
    const day = days[currDay];
    currDay++;

    let currShop = 0;
    const totalShops = day.shops.length;
    while (currShop < totalShops) {
      const shop = day.shops[currShop];
      currShop++;

      let currOrder = 0;
      const totalOrders = shop.orders.length;
      while (currOrder < totalOrders) {
        const order = shop.orders[currOrder];
        currOrder++;

        output.push({
          id: order.id,
          time: order.time,
          shop: order.shop,
          till: order.till,
          deleted: order.deleted,
          subtotal: order.subtotal,
          paymentMethod: order.paymentMethod,
          items: order.items,
          eod: true,
        });
      }
    }
  }

  for (let orderIndex = 0; orderIndex < output.length; orderIndex++) {
    const order = output[orderIndex];
    console.log(`${(orderIndex + 1) / output.length}`);
    await db.insert(schema.orders).values({
      id: order.id,
      time: new Date(order.time),
      shop: order.shop,
      till: order.till,
      deleted: order.deleted,
      eod: order.eod,
      subtotal: order.subtotal,
      paymentMethod: order.paymentMethod,
    });

    for (let itemIndex = 0; itemIndex < order.items.length; itemIndex++) {
      const item = order.items[itemIndex];
      console.log('      ' + itemIndex);
      await db.insert(schema.items).values({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        addons: item.addons,
        orderId: order.id,
      });
    }
  }

  console.log('daySheetToOrders - ' + (Date.now() - begin));
  //   fs.writeFile('psql.json', JSON.stringify(output), () => {});
};

module.exports = toDrizzle;
