'use strict';

window.addEventListener('DOMContentLoaded', () => {
  // DOM Selection
  const playerDisplay = document.querySelector('.display-player');
  const tile = Array.from(document.querySelectorAll('.tile'));
  const resetBtn = document.querySelector('#reset');
  const announcer = document.querySelector('.announcer');

  /* Note: Indexes within the board
      [0] [1] [2]
      [3] [4] [5]
      [6] [7] [8]
  */

  let isGameActive = true;

  /**
   * Contain the state and memory storage of the game
   */
  const gameBoard = {
    _board: ['', '', '', '', '', '', '', '', ''],
    _player1: 'X',
    _player2: 'O',
    _currentPlayer: this._player1,
    _winningConditions: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ],
  };

  // UI - Rendering
  /**
   * Renders tile which player selects
   */
  const renderTile = function (tile, index) {
    if (tile.innerText === '') {
      gameBoard._board = +index;
      console.log(gameBoard._board);

      tile.innerText = gameBoard._currentPlayer;
      tile.classList.add(`player${gameBoard._currentPlayer}`);

      gameBoard._currentPlayer =
        gameBoard._currentPlayer === gameBoard._player1
          ? gameBoard._player2
          : gameBoard._player1;
      // if (gameBoard._currentPlayer === gameBoard._player1) {
      //   gameBoard._currentPlayer = gameBoard._player2;
      // } else {
      //   gameBoard._currentPlayer = gameBoard._player1;
      // }
      console.log(gameBoard._currentPlayer);
    }
  };

  // Controller - User interactions
  /**
   * Listens for player to click a tile.
   * (Loops through the array node list with an event listener, which calls renderTile to display X or O)
   */
  const playerAction = (() => {
    tile.forEach((tile, index) => {
      tile.addEventListener('click', () => renderTile(tile, index));
    });
  })();
});
