const fs = require('fs');

const today = JSON.parse(fs.readFileSync('./today.json').toString());

let min = new Date(1708264800000);
let max = new Date(1708272000000);
let samTotal = 0;
let lukeTotal = 0;
for (const order of today[0].shops[0].orders) {
  let time = new Date(order.time.$date);
  if (time > min && time < max) {
    if (order.till == 1) {
      samTotal += order.subtotal;
    }
    if (order.till == 3) {
      lukeTotal += order.subtotal;
    }
  }
}

console.log('Sam - ' + samTotal.toFixed(2));
console.log('Luke - ' + lukeTotal.toFixed(2));
