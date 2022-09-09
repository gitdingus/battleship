const Gameboard = require('./gameboard');
const Ship = require('./ship');

describe('gameboard', () => {
  test('create + initialize gameboard', () => {
    const gameboard = Gameboard();

    expect(gameboard).toBeDefined();
    expect(gameboard).toHaveLength(10);
    expect(gameboard[0]).toHaveLength(10);
    expect(gameboard[0][0]).toMatchObject({ attacked: false, ship: null });
    expect(gameboard[9][9]).toMatchObject({ attacked: false, ship: null });
  });
});

describe('place ship - horizontal - no obstructions', () => {
  const gameboard = Gameboard();
  const ship = Ship('Cruiser', 3);
  const confirmPlacement = function confirmHorizontalShipPlacement(testShip, coords) {
    for (let i = 0; i < testShip.length; i += 1) {
      expect(gameboard[coords[0]][coords[1] + i]).toMatchObject({
        ship: {
          ship: testShip,
          piece: i,
        },
      });
    }
  };

  test('horizontal - within bounds - to succeed', () => {
    const coords = [3, 3];
    expect(gameboard.placeShip(ship, 'horizontal', coords)).toBe(true);
    confirmPlacement(ship, coords);
  });

  test('horizontal - edge case - 0, 0 - to succeed', () => {
    const coords = [0, 0];
    expect(gameboard.placeShip(ship, 'horizontal', coords)).toBe(true);
    confirmPlacement(ship, coords);
  });

  test('horizontal - edge case - 9, 7 - to succeed', () => {
    const coords = [9, 7];
    expect(gameboard.placeShip(ship, 'horizontal', coords)).toBe(true);
    confirmPlacement(ship, coords);
  });

  test('horizontal - escape bounds - 0, -1 - to fail', () => {
    const coords = [0, -1];
    expect(gameboard.placeShip(ship, 'horizontal', coords)).toBe(false);
  });

  test('horizontal - escape bounds - 0, 8 - to fail', () => {
    const coords = [0, 8];
    expect(gameboard.placeShip(ship, 'horizontal', coords)).toBe(false);
  });
});

describe('place ship - vertical - no obstructions', () => {
  const gameboard = Gameboard();
  const ship = Ship('Cruiser', 3);
  const confirmPlacement = function confirmVerticalShipPlacement(testShip, coords) {
    for (let i = 0; i < testShip.length; i += 1) {
      expect(gameboard[coords[0] + i][coords[1]]).toMatchObject({
        ship: {
          ship: testShip,
          piece: i,
        },
      });
    }
  };

  test('vertical - within bounds - to succeed', () => {
    const coords = [3, 3];
    expect(gameboard.placeShip(ship, 'vertical', coords)).toBe(true);
    confirmPlacement(ship, coords);
  });

  test('vertical - edge case - 0, 0 - to succeed', () => {
    const coords = [0, 0];
    expect(gameboard.placeShip(ship, 'vertical', coords)).toBe(true);
    confirmPlacement(ship, coords);
  });

  test('vertical - edge case - 7, 9 - to succeed', () => {
    const coords = [7, 9];
    expect(gameboard.placeShip(ship, 'vertical', coords)).toBe(true);
    confirmPlacement(ship, coords);
  });

  test('vertical - escape bounds - -1, 0 - to fail', () => {
    const coords = [-1, 0];
    expect(gameboard.placeShip(ship, 'vertical', coords)).toBe(false);
  });

  test('vertical - escape bounds - 8, 0 - to fail', () => {
    const coords = [8, 0];
    expect(gameboard.placeShip(ship, 'vertical', coords)).toBe(false);
  });
});

describe('place ships with collisions', () => {
  test('should fail due to collision - 1', () => {
    const gameboard = Gameboard();
    const ship1 = Ship('Cruiser', 3);
    const ship2 = Ship('Carrier', 5);

    expect(gameboard.placeShip(ship1, 'horizontal', [3, 4])).toBe(true);
    expect(gameboard.placeShip(ship2, 'vertical', [2, 5])).toBe(false);
  });

  test('should fail due to collision - 2', () => {
    const gameboard = Gameboard();
    const ship1 = Ship('Cruiser', 3);
    const ship2 = Ship('Carrier', 5);

    expect(gameboard.placeShip(ship2, 'vertical', [0, 3])).toBe(true);
    expect(gameboard.placeShip(ship1, 'horizontal', [3, 2])).toBe(false);
  });
});

describe('attack square', () => {
  const gameboard = Gameboard();
  const ship = Ship('Carrier', 5);
  test('attack unattacked square', () => {
    expect(gameboard.receiveAttack(0, 0)).toBeNull();
  });
  test('attack occupied square', () => {
    gameboard.placeShip(ship, 'horizontal', [0, 1]);
    expect(gameboard.receiveAttack(0, 1)).toHaveProperty('ship');
    expect(gameboard.receiveAttack(0, 1)).toHaveProperty('piece');
  });
  test('detect if square has been previously attacked', () => {
    expect(gameboard[0][0].attacked).toBe(true);
  });
});

describe('detect whether all ships are sunk', () => {
  test('test for all ships sunk - success', () => {
    const gameboard = Gameboard();
    const ship1 = Ship('Cruiser', 3);
    const ship2 = Ship('Carrier', 5);
    const ship3 = Ship('Destroyer', 2);
    const killShip = (ship) => {
      for (let i = 0; i < ship.length; i += 1) {
        ship.hit(i);
      }
    };
    gameboard.placeShip(ship1, 'vertical', [2, 8]);
    gameboard.placeShip(ship2, 'horizontal', [5, 2]);
    gameboard.placeShip(ship3, 'horizontal', [0, 3]);

    killShip(ship1);
    killShip(ship2);
    killShip(ship3);

    expect(gameboard.allShipsSunk()).toBe(true);
  });
  test('test for all ships sunk - fail', () => {
    const gameboard = Gameboard();
    const ship1 = Ship('Cruiser', 3);
    const ship2 = Ship('Carrier', 5);
    const ship3 = Ship('Destroyer', 2);
    const killShip = (ship) => {
      for (let i = 0; i < ship.length; i += 1) {
        ship.hit(i);
      }
    };
    gameboard.placeShip(ship1, 'vertical', [2, 8]);
    gameboard.placeShip(ship2, 'horizontal', [5, 2]);
    gameboard.placeShip(ship3, 'horizontal', [0, 3]);

    killShip(ship1);
    killShip(ship2);

    expect(gameboard.allShipsSunk()).toBe(false);
  });
});
