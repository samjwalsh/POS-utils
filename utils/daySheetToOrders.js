const mongoose = require('mongoose');

const fs = require('fs');

const Day = require('../models/daySheets/daySchema');

const daySheetToOrders = async (start, end, newShop, undelete) => {
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

            order.eod = false;
            order.shop = newShop;
            if (undelete) order.deleted = false;
            output.push(order);
        }
    }
  }
  console.log('daySheetToOrders - ' + (Date.now() - begin))
  fs.writeFile('output.json', JSON.stringify(output), () => {});
};

module.exports = daySheetToOrders;
