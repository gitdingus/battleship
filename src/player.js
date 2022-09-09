import Gameboard from './gameboard';

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
  newPlayer.gameboard = Gameboard();

  return newPlayer;
}
