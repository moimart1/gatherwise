function splitShare(amount, count, precision = 2) {
  const values = [];
  while (amount > 0 && count > 0) {
    let share = Math.floor((amount * Math.pow(10.0, precision)) / count) / Math.pow(10.0, precision);

    amount -= share;
    count--;

    // last share when share > amount
    values.push(share > amount ? share + amount : share);
  }

  return values;
}

console.log(
  '73.18',
  splitShare(73.18, 2),
  splitShare(73.18, 2).reduce((acc, val) => acc + val, 0),
);

console.log(
  '7.75',
  splitShare(7.75, 2),
  splitShare(7.75, 2).reduce((acc, val) => acc + val, 0),
);

console.log(
  '10',
  splitShare(10, 2),
  splitShare(10, 2).reduce((acc, val) => acc + val, 0),
);

console.log(
  '40.47',
  splitShare(40.47, 2),
  splitShare(40.47, 2).reduce((acc, val) => acc + val, 0),
);
