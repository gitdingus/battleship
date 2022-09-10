import './gameboard.css';

export default function drawGameboard(gameboard) {
  const gameboardDiv = document.createElement('div');

  for (let i = 0; i < gameboard.length; i += 1) {
    const gameboardRow = document.createElement('div');
    gameboardRow.classList.add('row');
    for (let j = 0; j < gameboard[i].length; j += 1) {
      const gameboardCol = document.createElement('div');
      gameboardCol.classList.add('square');
      gameboardCol.setAttribute('data-coord', `${i},${j}`);
      gameboardRow.appendChild(gameboardCol);

      if (gameboard[i][j].ship !== null) {
        gameboardCol.classList.add('has-ship');
      }
    }

    gameboardDiv.appendChild(gameboardRow);
  }

  return gameboardDiv;
}
