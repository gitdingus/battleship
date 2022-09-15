import svgDot from './templates/svg-dot-template.html';
import svgX from './templates/svg-x-template.html';
import './gameboard.css';

function getElementFromTemplateFile(templateSrc) {
  const template = document.createElement('template');
  template.innerHTML = templateSrc;

  return template.content.firstElementChild.cloneNode(true);
}

export default function GameboardElement(gameboard) {
  const gameboardDiv = document.createElement('div');
  const toggleButton = document.createElement('button');
  let currentOrientation = 'vertical';
  let currentShip = null;

  toggleButton.classList.add('toggle-button');
  toggleButton.textContent = 'Horizontal/Vertical';

  toggleButton.addEventListener('click', () => {
    currentOrientation = (currentOrientation === 'vertical') ? 'horizontal' : 'vertical';
  });

  gameboardDiv.toggleButton = toggleButton;

  gameboardDiv.gameboard = gameboard;

  gameboardDiv.classList.add('gameboard');
  gameboardDiv.setAttribute('tabindex', 0);

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

  gameboardDiv.refreshGameboard = function refreshGameboardDiv() {
    for (let i = 0; i < gameboard.length; i += 1) {
      for (let j = 0; j < gameboard[i].length; j += 1) {
        const square = gameboardDiv.querySelector(`.square[data-coord="${i},${j}"]`);
        square.setAttribute('class', 'square');
        if (gameboard[i][j].ship !== null) {
          square.classList.add('has-ship');
          if (gameboard[i][j].attacked === true) {
            square.classList.add('attacked');
            if (square.firstElementChild === null) {
              square.appendChild(getElementFromTemplateFile(svgX));
            }
          }
        }
        if (gameboard[i][j].ship === null && gameboard[i][j].attacked === true) {
          square.classList.add('attacked');
          if (square.firstElementChild === null) {
            square.appendChild(getElementFromTemplateFile(svgDot));
          }
        }
      }
    }
  };

  gameboardDiv.setMode = function setModeOnGameboardDiv(mode) {
    gameboardDiv.mode = mode;
  };

  gameboardDiv.getCoords = function getClickedCoords() {
    return new Promise((resolve, reject) => {
      gameboardDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('square') !== true) {
          gameboardDiv.setMode('');
          return reject(new Error('bad square'));
        }
        const coords = e.target.getAttribute('data-coord')
          .split(',')
          .map((val) => Number.parseInt(val, 10));

        return resolve(coords);
      }, { once: true });
    });
  };

  gameboardDiv.placeShip = async function placeOnGameboardShip(ship) {
    gameboardDiv.setMode('placing');
    currentShip = ship;
    const coords = await gameboardDiv.getCoords();
    const placement = gameboard.placeShip(ship, currentOrientation, coords);

    if (placement === true) {
      clearShipPlacementHover(coords, currentShip, currentOrientation);
      gameboardDiv.setMode('');
    }

    gameboardDiv.refreshGameboard();
    return placement;
  };

  gameboardDiv.makeTarget = async function setUpGameboardToReceiveAttack() {
    gameboardDiv.setMode('receiveattack');
  };

  gameboardDiv.receiveAttack = function triggerAttackOnGameboard(coords) {
    const attacked = gameboard.receiveAttack(coords[0], coords[1]);
    gameboardDiv.refreshGameboard();
    gameboardDiv.setMode('');

    return attacked;
  };

  function shipPlacementHover(startCoords, ship, orientation) {
    for (let i = 0;
      i < ship.length;
      i += 1) {
      let queryString = 'div[data-coord="';
      if (orientation === 'vertical'
        && i + startCoords[0] < gameboard.length) {
        queryString += `${startCoords[0] + i},${startCoords[1]}"]`;
      } else if (orientation === 'horizontal'
        && i + startCoords[1] < gameboard[startCoords[0]].length) {
        queryString += `${startCoords[0]},${startCoords[1] + i}"]`;
      }
      const square = gameboardDiv.querySelector(queryString);
      if (square !== null) {
        square.classList.add('placing-ship');
      }
    }
  }

  gameboardDiv.addEventListener('pointerover', (e) => {
    if (gameboardDiv.mode === 'placing') {
      const coords = e.target
        .getAttribute('data-coord')
        .split(',')
        .map((val) => Number.parseInt(val, 10));

      shipPlacementHover(coords, currentShip, currentOrientation);
    } else if (gameboardDiv.mode === 'receiveattack') {
      e.target.classList.add('target');
    }
  });

  function clearShipPlacementHover(startCoords, ship, orientation) {
    for (let i = 0;
      i < ship.length;
      i += 1) {
      let queryString = 'div[data-coord="';
      if (orientation === 'vertical'
        && i + startCoords[0] < gameboard.length) {
        queryString += `${startCoords[0] + i},${startCoords[1]}"]`;
      } else if (orientation === 'horizontal'
        && i + startCoords[1] < gameboard[startCoords[0]].length) {
        queryString += `${startCoords[0]},${startCoords[1] + i}"]`;
      }
      const square = gameboardDiv.querySelector(queryString);
      if (square !== null) {
        square.classList.remove('placing-ship');
      }
    }
  }
  gameboardDiv.addEventListener('pointerout', (e) => {
    if (gameboardDiv.mode === 'placing') {
      const coords = e.target
        .getAttribute('data-coord')
        .split(',')
        .map((val) => Number.parseInt(val, 10));

      clearShipPlacementHover(coords, currentShip, currentOrientation);
    } else if (gameboardDiv.mode === 'receiveattack') {
      e.target.classList.remove('target');
    }
  });

  return gameboardDiv;
}
