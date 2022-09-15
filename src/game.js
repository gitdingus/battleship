import PlayerElement from './player-element';
import './main.css';
import './game.css';

const playerOneArea = document.querySelector('.player-one .board');
const playerOneName = document.querySelector('.player-one .name');
const playerOneControls = document.querySelector('.player-one .controls');
const playerTwoArea = document.querySelector('.player-two .board');
const playerTwoName = document.querySelector('.player-two .name');
const playerTwoControls = document.querySelector('.player-two .controls');

const player1 = PlayerElement('Yohanis');
const player2 = PlayerElement('Victor');

playerOneName.textContent = player1.playerName;
playerTwoName.textContent = player2.playerName;

playerOneArea.appendChild(player1.gameboardGui);
playerTwoArea.appendChild(player2.gameboardGui);

playerOneControls.appendChild(player1.gameboardGui.toggleButton);
playerTwoControls.appendChild(player2.gameboardGui.toggleButton);

async function placeShips() {
  await player1.placeShips();
  await player2.placeShips();
}

async function playGame() {
  await placeShips();

  while (true) {
    let result = await player2.receiveAttack()
      .catch(() => console.log('crashed in playGame'));

    if (result !== null) {

    }

  }

}

playGame();
