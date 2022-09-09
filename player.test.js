const Player = require('./player');
const Ship = require('./ship');

describe('player initalized', () => {
  test('player gameboard is not null', () => {
    const player = Player('John Smith');
    expect(player).toHaveProperty('playerName');
    expect(player).toHaveProperty('gameboard');
  });
});

describe('player has enemy', () => {
  test('player.enemy returns enemy player object', () => {
    const player = Player('John Smith');
    const enemyPlayer = Player('Jane Doe');

    player.setEnemy(enemyPlayer);
    expect(player.getEnemy()).toEqual(enemyPlayer);
  });
});

describe('player can attack', () => {
  test('player attacks enemy board', () => {
    const player = Player('John Smith');
    const enemyPlayer = Player('Jane Doe');
    player.setEnemy(enemyPlayer);

    expect(typeof player.attack(0, 0)).toMatch('boolean');
  });

  test('player attacks ship', () => {
    const player = Player('John Smith');
    const enemyPlayer = Player('Jane Doe');
    enemyPlayer.gameboard.placeShip(Ship('Cruiser', 3), 'horizontal', [0, 0]);
    player.setEnemy(enemyPlayer);

    expect(player.attack(0, 0)).toBe(true);
    expect(player.attack(0, 1)).toBe(true);
    expect(player.attack(0, 2)).toBe(true);
    expect(player.attack(0, 3)).toBe(false);
    expect(player.attack(1, 0)).toBe(false);
  });
});

describe('player can attack random square - for computer player', () => {
  test('attack random square', () => {
    const player = Player('John Smith');
    const enemyPlayer = Player('Jane Doe');
    player.setEnemy(enemyPlayer);

    expect(typeof player.attackRandom()).toMatch('boolean');
  });
});
