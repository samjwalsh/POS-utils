const Day = require('../models/daySheets/daySchema');
const fs = require('fs');

Date.prototype.stdTimezoneOffset = function () {
  var jan = new Date(this.getFullYear(), 0, 1);
  var jul = new Date(this.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.isDstObserved = function () {
  return this.getTimezoneOffset() < this.stdTimezoneOffset();
};

const orderFreq = async (range, options) => {
  const begin = Date.now();
  let { start, end } = range;
  if (!end) end = start;
  const days = await Day.find({
    date: {
      $gte: start,
      $lte: end,
    },
  });
  let selectedShops = [];
  if (options) {
    if (options.shops) selectedShops = [...options.shops];
  }
  console.log(selectedShops)
  if (days.length === 0) return {};

  let times = [];

  let currDay = 0;
  const totalDays = days.length;
  while (currDay < totalDays) {
    const daySheet = days[currDay];
    currDay++;

    let currShop = 0;
    const totalShops = daySheet.shops.length;
    while (currShop < totalShops) {
      const EODsheet = daySheet.shops[currShop];
      currShop++;
      if (
        selectedShops.length !== 0 &&
        !selectedShops.includes(EODsheet.shop)
      ) {
        console.log('skipping shop')
        continue;
      }

      let orderIndex = 0;
      const ordersLength = EODsheet.orders.length;
      while (orderIndex < ordersLength) {
        const order = EODsheet.orders[orderIndex];
        orderIndex++;
        if (
          order.deleted ||
          order.items[0].name == 'Reconcilliation Balance Adjustment'
        )
          continue;
        let time = new Date(order.time);
        if (time.isDstObserved()) time.setHours(time.getHours() - 1);

        msSinceMidnight = time.getTime() - time.setHours(0, 0, 0, 0);
        sSinceMidnight = parseInt(msSinceMidnight / 1000);
        times.push(sSinceMidnight);
      }

    }
  }

  times = times.sort();
  let width = 60 * 15;
  let currentTime = width;
  let output = [];
  let index = 0;
  let reachedOrder = false;
  while (index < times.length) {
    let bucket = new Date(currentTime * 1000);
    let quantity = 0;
    let key = bucket
      .getHours()
      .toString()
      .padStart(2, '0')
      .concat(':')
      .concat(bucket.getMinutes().toString().padStart(2, '0'));
    let orderTime = times[index];
    while (orderTime <= currentTime) {
      if (!reachedOrder) reachedOrder = true;
      orderTime = times[index];
      quantity++;
      index++;
    }
    currentTime += width;
    if (!reachedOrder) continue;
    output.push([key, quantity]);
  }

  // console.log(`${times.length} orders`)
  console.log('orderFreq - ' + (Date.now() - begin));
  // console.log(output)
  let outputString = 'Time, Quantity\n';
  output.forEach(function (infoArray, index) {
    dataString = infoArray.join(',');
    outputString += dataString + '\n';
  });
  fs.writeFile('orderFreq.csv', outputString, () => {});
  return times;
};

module.exports = orderFreq;
