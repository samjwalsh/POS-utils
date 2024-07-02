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

const shopProp = async (range, options) => {
  let { start, end } = range;
  if (!end) end = start;
  const days = await Day.find({
    date: {
      $gte: start,
      $lte: end,
    },
  });

  let output = [];

  if (days.length === 0) return {};

  let times = [];

  let currDay = 0;
  const totalDays = days.length;
  while (currDay < totalDays) {
    const daySheet = days[currDay];
    currDay++;

    let LHTotal = 0;
    let mainTotal = 0;

    let currShop = 0;
    const totalShops = daySheet.shops.length;
    while (currShop < totalShops) {
      const EODsheet = daySheet.shops[currShop];
      currShop++;

      if (EODsheet.shop !== 'Main' && EODsheet.shop !== 'Bray') continue;

      let orderIndex = 0;
      const ordersLength = EODsheet.orders.length;
      while (orderIndex < ordersLength) {
        const order = EODsheet.orders[orderIndex];
        orderIndex++;
        if (order.deleted) continue;
        if (EODsheet.shop == 'Main') {
          //   console.log('adding main');
          mainTotal += order.subtotal;
        } else if (EODsheet.shop == 'Bray') {
          LHTotal += order.subtotal;
          //   console.log('adding lh');
        }
      }
      //   console.log(LHTotal);
      //   console.log(mainTotal)
    }
    if (LHTotal > 100 && mainTotal > 200) {
      output.push([
        daySheet.date,
        mainTotal,
        LHTotal,
        LHTotal / (mainTotal + LHTotal),
      ]);
    }
  }
  console.log('done');
  console.log(output);

  let outputString = 'Date, Bray, Bray, Proportion LH\n';
  output.forEach(function (infoArray) {
    dataString = infoArray.join(',');
    outputString += dataString + '\n';
  });
  fs.writeFileSync('shopProp.csv', outputString);
  return {};
};

module.exports = shopProp;
