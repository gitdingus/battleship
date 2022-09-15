import Gameboard from './gameboard';
import Ship from './ship';

const playerProto = {
  setEnemy(enemy) {
    this.enemy = enemy;
  },
  getEnemy() {
    return this.enemy;
  },
  attack(row, col) {
    const attackedSquare = this.enemy.gameboard.receiveAttack(row, col);
    if (attackedSquare !== null) {
      attackedSquare.ship.hit(attackedSquare.ship.piece);
      return true;
    }

    return false;
  },
  attackRandom() {
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);

    return this.attack(row, col);
  },
};

export default function Player(playerName) {
  const newPlayer = Object.create(playerProto);

  newPlayer.playerName = playerName;
  newPlayer.ships = [
    {
      ship: Ship('Carrier', 5),
      placed: false,
    },
    {
      ship: Ship('Battleship', 4),
      placed: false,
    },
    {
      ship: Ship('Cruiser', 3),
      placed: false,
    },
    {
      ship: Ship('Submarine', 3),
      placed: false,
    },
    {
      ship: Ship('Destroyer', 2),
      placed: false,
    },
  ];

  newPlayer.gameboard = Gameboard();

  return newPlayer;
}
