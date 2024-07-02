const fs = require('fs');

const extras = [
  ['Extra Flake', '0.50'],
  ['Extra Cone', '0.30'],
  ['Waffle Cone', '1.00'],
  ['Extra Toppings', '0.50'],
  ['Extra Crushed Flake', '1.50'],
  ['Extra Ferrero', '1.50'],
  ['Extra Strawberries', '1.50'],
  ['Extra Chocolate Dip', '1.50'],

]
const sweetssnacks = [
  ['Weighted Sweets (1/4 lb)', '3.00'],
  ['2 Euro Bag', '2.00'],
  ['Rock / Honeycomb', '2.50'],
  ['Rock / Honeycomb Deal (4x)', '7.50'],
  ['Chocolate Bars', '1.80'],
  ['Tayto', '1.60'],
  ['Hula Hoops / Snax', '1.50'],
  ['Popcorn Cone', '2.50'],
  ['Popcorn Bag', '3.50'],
  ['Candyfloss Bag or Stick', '2.50'],
  ['Candyfloss Tub', '3.50']
]

const hotdrinks = [
  ['Americano', '2.80'],
  ['Cappucino', '3.00'],
  ['Latte', '3.00'],
  ['Double Espresso', '2.80'],
  ['Hot Chocolate', '3.50'],
  ['Tea', '2.50'],
];

const colddrinks = [
  ['Soft Bottles', '2.80'],
  ['Cans', '2.00'],
  ['Water (Still & Sparkling)', '2.00'],
  ['Ribena', '2.00'],
  ['Capri-Sun', '2.00'],
  ['Small Slushie', '2.50'],
  ['Large Slushie', '3.50'],
];

const tubs = [
  ['Small Plain Pink Tub (Toppings same price as on a cone)', '2.50'],
  ['Large Plain Orange Tub (Toppings same price as on a cone)', '4.00'],
  ['Ice Cream Sundae', '4.00'],
  ['99 Ice Cream Sundae', '4.50'],
  ['Screwball', '3.00'],
  ['99 Screwball', '3.50'],
  ['Special 99 Screwball', '4.00'],
  ['Ice Cream Boat w/ Flake', '4.00'],
  ['Special Ice Cream Boat w/ Flake', '4.50'],
  ['Ice Cream Float', '5.00'],
  ['Hot Ferrero & Ice Cream', '6.00'],
  ['Hot Ferrero & Strawberries & Ice Cream', '6.50'],
  ['Strawberries & Ice Cream', '6.00'],
  ['Affogato', '5.00'],
  ['Honeycomb Heaven', '6.00'],
  ['Rocky Road Mess', '6.00'],
  ['Chocolate Brownie Bliss', '6.00'],
  ['Kinder Bueno & Ice Cream', '6.00'],
];

const kidsCones = [
  ['Plain Kids Cone', '2.30'],
  ['Kids 99 Cone', '2.50'],
  ['Kids Special 99 (Oreos, Sprinkles, Marshmallows)', '3.00'],
  ['Kids Cone Rolled In Crushed Flake', '3.80'],
  ['Kids 99 Rolled In Crushed Flake', '4.00'],
  ['Kids Chocolate Dipped Cone', '3.00'],
  ['Kids Chocolate Dipped 99', '3.50'],
];

const cones = [
  ['Plain Cone', '2.50'],
  ['99 Cone', '3.00'],
  ['Special 99 (Oreos, Sprinkles, Marshmallows)', '3.50'],
  ['Family Special (2 99s, 2 Kids 99s)', '10.00'],
  ['Cone Rolled In Crushed Flake', '4.00'],
  ['99 Rolled In Crushed Flake', '4.50'],
  ['Chocolate Dipped Cone', '3.30'],
  ['Chocolate Dipped 99', '4.00'],
];

const tableGen = (input) => {
  //   let output = `<style type="text/css">
  //     .holder {
  //     display: flex;
  //     flex-direction: row;
  //     column-gap: 1rem;
  //     }
  //     .table {
  //     display: flex;
  //     flex-direction: column;
  //     width: 100%;
  //     font-size: 1.4rem;
  //     line-height: 2.8rem;
  //     }
  //     .row {
  //     width: 100%;
  //     display: flex;
  //     flex-direction: row;
  //     column-gap: 1rem;
  //     row-gap: 5rem;
  //     }
  //     .item {
  //     text-align: left;
  //     flex-grow: 1;
  //     }
  //     .price {
  //     text-align: right;
  //     width: min-content;
  //     }
  // </style>`;
  let output = '';
  output += `<div class="holder">`;
  output += '';

  let col1 = '<div class="table">';
  let col2 = '<div class="table">';

  for (const itemIndex in input) {
    let item = input[itemIndex];
    let output = `

  <div class="row">
    <div class="item">${item[0]}</div>
    <div class="price">${item[1]}</div>
  </div>

  `;
    if ((parseInt(itemIndex) + 1) * 2 <= input.length) {
      col1 += output;
    } else {
      col2 += output;
    }
  }

  col1 += '</div>';
  col2 += '</div>';

  output += col1;
  output += col2;
  output += '</div>';
  fs.writeFileSync('index.html', output);
};
tableGen(input);

console.log('ran');
