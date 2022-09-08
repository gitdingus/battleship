const Ship = require('./ship');

describe('ship tests', () => {
  const ship = Ship('Cruiser', 3);
  test('ship created', () => {
    expect(ship.type).toMatch(/^Cruiser$/);
  });

  test('test isSunk and return values of hit', () => {
    // ship.hit() returns false if value passed is outside bounds of length
    // upper bound is length - 1, consistent with arrays
    expect(ship.hit(-1)).toBe(false);
    expect(ship.hit(ship.length)).toBe(false);

    expect(ship.hit(0)).toBe(true);
    expect(ship.isSunk()).toBe(false);

    expect(ship.hit(1)).toBe(true);
    expect(ship.isSunk()).toBe(false);

    expect(ship.hit(2)).toBe(true);
    expect(ship.isSunk()).toBe(true);
  });
});
