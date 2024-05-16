const todaysorders = require('../models/todaysorders/todaysOrderSchema');

const getZ = async (options) => {
  const begin = Date.now();

  const orders = await todaysorders.find();

  const output = { total: 0, cashTotal: 0, cardTotal: 0, shops: [] };

  const shops = [];
  let currOrder = 0;
  const totalOrders = orders.length;
  while (currOrder < totalOrders) {
    const order = orders[currOrder];
    currOrder++;
    if (order.deleted) continue;
    
    if (!shops.includes(order.shop)) {
      output.shops.push({
        name: order.shop,
        total: 0,
        cashTotal: 0,
        cardTotal: 0,
      });
      shops.push(order.shop);
    }

    for (const includedShop of output.shops) {
      if ((includedShop.name === order.shop)) {
        if (order.paymentMethod === 'Card') {
          includedShop.cardTotal += order.subtotal;
        } else {
          includedShop.cashTotal += order.subtotal;
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

  console.log('getX - ' + (Date.now() - begin));

  return output;
};

module.exports = getZ;

const nF = (n) => {
  return parseFloat(n.toFixed(2));
};
