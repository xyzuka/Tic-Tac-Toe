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

  /**********************************/
  // State management
  /**
   * Contain the state and memory storage of the game
   */
  const gameBoard = {
    _roundWon: false,
    _isGameActive: true,
    _board: ['', '', '', '', '', '', '', '', ''],
    _player1: 'X',
    _player2: 'O',
    _currentPlayer: this._player1,
    _player1Score: [],
    _player2Score: [],
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

  /**********************************/
  // Game logic
  /**
   * Contains game logic
   */
  const setCurrentPlayer = (() =>
    (gameBoard._currentPlayer = gameBoard._player1))();

  const switchPlayers = function () {
    gameBoard._currentPlayer =
      gameBoard._currentPlayer === gameBoard._player1
        ? gameBoard._player2
        : gameBoard._player1;
  };

  const addPlayerScore = function (index) {
    // console.log(gameBoard._currentPlayer);
    // console.log(index);
    if (gameBoard._currentPlayer === gameBoard._player1) {
      gameBoard._board[index] = gameBoard._currentPlayer;
    } else {
      gameBoard._board[index] = gameBoard._currentPlayer;
    }
  };

  /**
   * Compares player's score to the winning condition's array
   */
  const comparingScores = function (winningCond, playerScore) {
    for (let i = 0; i <= 7; i++) {
      const winCondition = gameBoard._winningConditions[i];

      const a = gameBoard._board[winCondition[0]];
      const b = gameBoard._board[winCondition[1]];
      const c = gameBoard._board[winCondition[2]];

      // console.log(`a: ${a}`);
      // console.log(`b: ${b}`);
      // console.log(`c: ${c}`);

      if (a === '' || b === '' || c === '') {
        continue;
      }
      if (a === b && b === c) {
        gameBoard._roundWon = true;
        break;
      }
    }
  };

  const checkGameOver = function () {
    comparingScores();
    if (gameBoard._roundWon) alert('Player Wins!');

    // if (comparingScores(gameBoard._winningConditions, gameBoard._player2Score))
    //   alert('Player 2 Wins!');
  };

  /**********************************/
  // UI - Rendering
  /**
   * Renders tile which player selects
   */
  const renderTile = function (tile, index) {
    if (tile.textContent === '') {
      tile.textContent = gameBoard._currentPlayer;
      tile.classList.add(`player${gameBoard._currentPlayer}`);

      addPlayerScore(index);
      switchPlayers();
      checkGameOver();
    }
  };

  /**********************************/
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
