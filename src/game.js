import { getElementFromTemplateFile } from 'dom-utils';
import createDropDownMenu from 'drop-down-menu';
import PlayerElement from './player-element';
import playersPromptTemplate from './templates/players-prompt-template.html';
import './main.css';
import './game.css';

const playerOneArea = document.querySelector('.player-one .board');
const playerOneName = document.querySelector('.player-one .name');
const playerOneControls = document.querySelector('.player-one .controls');
const playerTwoArea = document.querySelector('.player-two .board');
const playerTwoName = document.querySelector('.player-two .name');
const playerTwoControls = document.querySelector('.player-two .controls');
const dropdownContent = getElementFromTemplateFile(playersPromptTemplate);
const newGameDropDown = createDropDownMenu({
  menuHeader: {
    displayText: 'New Game',
  },
  behavior: 'click',
});
newGameDropDown.addMenuItem({
  type: 'content',
  content: dropdownContent,
});

document.body.appendChild(newGameDropDown.dropdownMenu);

const playerOneInput = document.querySelector('#player-one-input');
const playerTwoInput = document.querySelector('#player-two-input');
const playButton = document.querySelector('#play-button');

let player1;
let player2;

function clearElementChildren(element) {
  while (element.firstElementChild !== null) {
    element.firstElementChild.remove();
  }
}

function clearLastGame() {
  const gameboard1 = playerOneArea.querySelector('.gameboard');
  const gameboard2 = playerTwoArea.querySelector('.gameboard');

  if (gameboard1 !== null) {
    gameboard1.remove();
  }

  if (gameboard2 !== null) {
    gameboard2.remove();
  }

  clearElementChildren(playerOneControls);
  clearElementChildren(playerTwoControls);

}
function newGame() {
  clearLastGame();
  player1 = PlayerElement(playerOneInput.value);
  player2 = PlayerElement(playerTwoInput.value);

  playerOneName.textContent = player1.playerName;
  playerTwoName.textContent = player2.playerName;

  playerOneArea.insertBefore(player1.gameboardGui, playerOneArea.firstElementChild);
  playerTwoArea.insertBefore(player2.gameboardGui, playerTwoArea.firstElementChild);

  playerOneControls.appendChild(player1.gameboardGui.toggleButton);
  playerTwoControls.appendChild(player2.gameboardGui.toggleButton);
}
async function placeShips() {
  await player1.placeShips();
  await player2.placeShips();
}

async function playGame() {
  let hasWinner = false;
  await placeShips();

  while (hasWinner === false) {
    // eslint-disable-next-line no-await-in-loop
    const player1Attack = await player2.receiveAttack()
      .catch(() => console.log('crashed in playGame'));

    if (player1Attack !== null) {
      if (player1Attack.ship.isSunk() === true) {
        if (player2.gameboard.allShipsSunk() === true) {
          hasWinner = true;
        }
      }
    }

    if (hasWinner === false) {
      // eslint-disable-next-line no-await-in-loop
      const player2Attack = await player1.receiveAttack()
        .catch(() => console.log('crashed in playGame'));

      if (player2Attack !== null) {
        if (player2Attack.ship.isSunk() === true) {
          console.log(`${player1.playerName}'s ${player2Attack.ship.type} has been sunk!`);
          if (player1.gameboard.allShipsSunk() === true) {
            hasWinner = true;
          }
        }
      }
    }
  }
}

playButton.addEventListener('click', () => {
  newGame();
  playGame();
});
