// Convert eod orders to ordrs which can be put in the todaysorders collection
const fs = require('fs');

const days = JSON.parse(fs.readFileSync('./days.json').toString());
const output = [];

for (const day of days) {
  for (const shop of day.shops) {
    for (const order of shop.orders) {
      order.eod = false;
      order.shop = 'Main';
      output.push(order);
    }
  }
}

fs.writeFile('output.json', JSON.stringify(output), () => {});

// const fs = require('fs');

// const today = JSON.parse(fs.readFileSync('./today.json').toString());
// const items = {};
// for (const order of today[0].shops[0].orders) {
//   for (const item of order.items) {
//     if (!items[item.name]) items[item.name] = 0;
//     items[item.name]+= item.quantity;
//   }
// }

// console.log(items)
