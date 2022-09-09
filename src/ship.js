const shipProto = {
  hit(index) {
    // if index is within bounds of damage array, return true
    if (index >= 0 && index < this.length) {
      this.damage[index] = 1;
      return true;
    }

    return false;
  },
  isSunk() {
    // val of 1 signifies a hit
    return this.damage.every((val) => val === 1);
  },
};

export default function Ship(type, length) {
  const newShip = Object.create(shipProto);

  newShip.type = type;
  newShip.length = length;
  newShip.damage = [];

  for (let i = 0; i < length; i += 1) {
    // 0 signifies not yet hit
    newShip.damage.push(0);
  }

  return newShip;
}
