const gameboardMixins = {
  detectCollision(newShip, orientation, coords) {
    /*
        iterates over area newShip will occupy. if detects collision it returns true
    */

    if (orientation === 'vertical') {
      for (let i = coords[0]; i < this.length - 1 || i < coords[0] + newShip.length - 1; i += 1) {
        if (this[i][coords[1]].ship !== null) {
          return true;
        }
      }
    } else if (orientation === 'horizontal') {
      for (let i = coords[1];
        i < this[coords[0]].length - 1 || i < coords[i] + newShip.length - 1;
        i += 1) {
        if (this[coords[0]][i].ship !== null) {
          return true;
        }
      }
    }

    return false;
  },
  placeShip(ship, orientation, coords) {
    /*
        places Ship object on gameboard
        orientation to equal 'horizontal' or 'vertical'
        coords is an array containing values for [row, col] respectively
    */

    // check if initial coordinates within bounds
    if (!(coords[0] >= 0 && coords[0] < this.length)
      || !(coords[1] >= 0 && coords[1] < this[coords[0]].length)) {
      return false;
    }

    if (orientation === 'horizontal') {
      if ((coords[1] + ship.length - 1 > this[coords[0]].length - 1)
        || (this.detectCollision(ship, orientation, coords) === true)) {
        return false;
      }

      for (let i = coords[1], j = 0; i < coords[1] + ship.length; i += 1, j += 1) {
        this[coords[0]][i].ship = {
          ship,
          piece: j,
        };
      }
      this.ships.push(ship);
      return true;
    }
    if (orientation === 'vertical') {
      if ((coords[0] + ship.length - 1 > this.length - 1)
        || (this.detectCollision(ship, orientation, coords) === true)) {
        return false;
      }

      for (let i = coords[0], j = 0; i < coords[0] + ship.length; i += 1, j += 1) {
        this[i][coords[1]].ship = {
          ship,
          piece: j,
        };
      }
      this.ships.push(ship);
      return true;
    }

    return false;
  },
  recieveAttack(row, col) {
    this[row][col].attacked = true;
    if (this[row][col].ship !== null) {
      return this[row][col].ship;
    }

    return null;
  },
  allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk() === true);
  },
};

function Gameboard() {
  let newGameboard = [];
  newGameboard = Object.assign(newGameboard, gameboardMixins);

  /*
     newGameboard is a multi dimensional array that contains an object that
     keeps track of if a spot on the board:
      boolean attacked
        true if it has been attacked
      contains part of a ship
        reference to ship in space
        part of ship in space
        null if no ship

      initial values: false, null respectively
  */
  for (let i = 0; i < 10; i += 1) {
    newGameboard[i] = [];
    for (let j = 0; j < 10; j += 1) {
      newGameboard[i][j] = {
        attacked: false,
        ship: null,
      };
    }
  }

  newGameboard.ships = [];

  return newGameboard;
}

module.exports = Gameboard;
