import dotSVG from './templates/svg-dot-template.html';
import xSVG from './templates/svg-x-template.html';
import './gameboard.css';

function getElementFromTemplateFile(templateSrc) {
  const template = document.createElement('template');
  template.innerHTML = templateSrc;

  return template.content.firstElementChild.cloneNode(true);
}

export default function drawGameboard(gameboard) {
  const gameboardDiv = document.createElement('div');

  for (let i = 0; i < gameboard.length; i += 1) {
    const gameboardRow = document.createElement('div');
    gameboardRow.classList.add('row');
    for (let j = 0; j < gameboard[i].length; j += 1) {
      const gameboardCol = document.createElement('div');
      gameboardCol.classList.add('square');
      gameboardCol.setAttribute('data-coord', `${i},${j}`);

      gameboardCol.addEventListener('click', () => {
        if (gameboard[i][j].attacked === true) {
          return;
        }

        gameboardCol.classList.add('attacked');

        const coords = gameboardCol
          .getAttribute('data-coord')
          .split(',')
          .map((val) => Number.parseInt(val, 10));

        gameboard.receiveAttack(coords[0], coords[1]);

        if (gameboard[i][j].ship === null) {
          gameboardCol.appendChild(getElementFromTemplateFile(dotSVG));
        } else {
          gameboardCol.appendChild(getElementFromTemplateFile(xSVG));
        }
      });

      gameboardRow.appendChild(gameboardCol);

      if (gameboard[i][j].ship !== null) {
        gameboardCol.classList.add('has-ship');
      }
    }

    gameboardDiv.appendChild(gameboardRow);
  }

  return gameboardDiv;
}
