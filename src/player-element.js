import Player from './player';
import GameboardElement from './gameboard-element';

export default function PlayerElement(player) {
  const playerElement = Player(player);

  playerElement.gameboardGui = GameboardElement(playerElement.gameboard);

  playerElement.placeShips = async function placeShipsOnGameboard() {
    let i = 0;
    while (i < playerElement.ships.length) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await playerElement.gameboardGui.placeShip(playerElement.ships[i].ship);
        if (result === true) {
          i += 1;
        }
      } catch (error) {
        // no need to do anything, if ship isn't placed, try again until out of ships
      }
    }

    playerElement.gameboardGui.classList.add('hidden');
  };

  playerElement.receiveAttack = async function triggerAttackOnGameboard() {
    let validMove = true;
    let result = null;
    do {
      playerElement.gameboardGui.makeTarget();
      // eslint-disable-next-line no-await-in-loop
      await playerElement.gameboardGui.getCoords()
        // eslint-disable-next-line no-loop-func
        .then((coords) => {
          validMove = true;
          result = playerElement.gameboardGui.receiveAttack(coords);
        })
        // eslint-disable-next-line no-loop-func
        .catch((error) => { 
          validMove = false;
        });
    } while (validMove === false);

    return result;
  };

  return playerElement;
}
