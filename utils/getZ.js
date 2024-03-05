const Day = require('../models/daySheets/daySchema');

const getZ = async (range, options) => {
  const begin = Date.now();
  let {start, end} = range;
  if (!end) end = start;
  const days = await Day.find({
    date: {
      $gte: start,
      $lte: end,
    },
  });

  if (days.length === 0) return {};

  const output = { total: 0, cashTotal: 0, cardTotal: 0, shops: [] };

  const shops = [];
  let currDay = 0;
  const totalDays = days.length;
  while (currDay < totalDays) {
    const daySheet = days[currDay];
    currDay++;

    let currShop = 0;
    const totalShops = daySheet.shops.length;
    while (currShop < totalShops) {
      const shop = daySheet.shops[currShop];
      currShop++;

      const { shopCashTotal, shopCardTotal } = addOrders(shop.orders);

      if (!shops.includes(shop.shop)) {
        output.shops.push({
          name: shop.shop,
          total: 0,
          cashTotal: 0,
          cardTotal: 0,
        });
        shops.push(shop.shop);
      }
      for (const includedShop of output.shops) {
        if (includedShop.name === shop.shop) {
          includedShop.cashTotal += shopCashTotal;
          includedShop.cardTotal += shopCardTotal;
        }
      }
    }
  }

  for (const shop of output.shops) {
    output.cashTotal += shop.cashTotal;
    output.cardTotal += shop.cardTotal;

    shop.cashTotal = nF(shop.cashTotal);
    shop.cardTotal = nF(shop.cardTotal);
    shop.total = nF(shop.cashTotal + shop.cardTotal);
  }

  output.cashTotal = nF(output.cashTotal);
  output.cardTotal = nF(output.cardTotal);
  output.total = nF(output.cashTotal + output.cardTotal);

  console.log('getZ - ' + (Date.now() - begin));
  // console.log(output)
  return output;
};

// This works
const addOrders = (orders) => {
  let shopCashTotal = 0;
  let shopCardTotal = 0;

  let currOrder = 0;
  const totalOrders = orders.length;
  while (currOrder < totalOrders) {
    const order = orders[currOrder];
    currOrder++;
    if (order.deleted) continue;

    if (order.paymentMethod === 'Card') {
      shopCardTotal += order.subtotal;
    } else {
      shopCashTotal += order.subtotal;
    }
  }
  return { shopCashTotal, shopCardTotal };
};

module.exports = getZ;

const nF = (n) => {
  return parseFloat(n.toFixed(2));
};
