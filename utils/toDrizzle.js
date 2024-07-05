const mongoose = require('mongoose');

const fs = require('fs');

const Day = require('../models/daySheets/daySchema');
const Voucher = require('../models/vouchers/voucherSchema');

const pkg = require('pg');
const { Client } = pkg;
const { host, port, user, password, database } = process.env;
const { drizzle } = require('drizzle-orm/node-postgres');
const schema = require('../models/schema');

const toDrizzle = async (start, end) => {
  const begin = Date.now();
  if (!end) end = start;
  console.log('Getting orders');
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

    console.clear();
    console.log(
      `Finding Orders - ${(((currDay + 1) / days.length) * 100).toFixed(1)}%`
    );

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

  console.log('done mongo shit');

  console.log(host);
  console.log(port);
  console.log(user);
  console.log(password);
  console.log(database);

  const client = new Client({
    host,
    port: parseInt(port),
    user,
    password,
    database,
  });
  await client.connect();
  const db = drizzle(client, { schema });

  console.log('connected to db');

  const dOrders = [];
  const dItems = [];

  for (let orderIndex = 0; orderIndex < output.length; orderIndex++) {
    const order = output[orderIndex];
    console.clear();
    console.log(
      `Copying Orders - ${(((orderIndex + 1) / output.length) * 100).toFixed(
        1
      )}%`
    );
    dOrders.push({
      id: order.id,
      time: new Date(order.time),
      shop: order.shop,
      till: order.till,
      deleted: order.deleted,
      eod: order.eod,
      rba:
        order.items[0].name === 'Reconcilliation Balance Adjustment'
          ? true
          : false,
      subtotal: order.subtotal,
      paymentMethod: order.paymentMethod,
    });

    for (let itemIndex = 0; itemIndex < order.items.length; itemIndex++) {
      const item = order.items[itemIndex];
      dItems.push({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        addons: item.addons,
        orderId: order.id,
      });
    }
  }

  let dOrderIndex = 0;
  const dOrdersLength = dOrders.length;
  let tempOrders = [];
  while (dOrderIndex < dOrdersLength) {
    const order = dOrders[dOrderIndex];
    dOrderIndex++;

    tempOrders.push(order);

    if (dOrderIndex % 5000 === 0 || dOrderIndex == dOrders.length) {
      console.clear();
      console.log(
        `Entering Orders - ${(
          ((dOrderIndex + 1) / dOrders.length) *
          100
        ).toFixed(1)}%`
      );
      await db.insert(schema.ordersTable).values(tempOrders);
      tempOrders = [];
    }
  }

  let dItemIndex = 0;
  const dItemsLength = dItems.length;
  let tempItems = [];
  while (dItemIndex < dItemsLength) {
    const item = dItems[dItemIndex];
    dItemIndex++;

    tempItems.push(item);

    if (dItemIndex % 5000 === 0 || dItemIndex == dItems.length) {
      console.clear();
      console.log(
        `Entering Items - ${(((dItemIndex + 1) / dItems.length) * 100).toFixed(
          1
        )}%`
      );
      await db.insert(schema.itemsTable).values(tempItems);
      tempItems = [];
    }
  }

  // console.log('Entering orders');
  // await db.insert(schema.ordersTable).values(dOrders);
  // console.log('Entering items');
  // await db.insert(schema.itemsTable).values(dItems);

  const vouchers = await Voucher.find({});

  const drizzleVouchers = vouchers.map((voucher) => {
    let dVoucher = {
      dateCreated: new Date(voucher.dateCreated),
      shopCreated: voucher.shopCreated,
      tillCreated: voucher.tillCreated,
      value: voucher.value,
      code: voucher.code,
      redeemed: voucher.redeemed,
    };
    if (voucher.redeemed) {
      dVoucher.dateRedeemed = new Date(voucher.dateRedeemed);
      dVoucher.shopRedeemed = voucher.shopRedeemed;
      dVoucher.tillRedeemed = voucher.tillRedeemed;
    }
    return dVoucher;
  });

  console.log('Entering vouchers');

  await db.insert(schema.vouchersTable).values(drizzleVouchers);

  console.log('done')

  //   fs.writeFile('psql.json', JSON.stringify(output), () => {});
};

module.exports = toDrizzle;
