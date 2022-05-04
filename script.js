'use strict';

window.addEventListener('DOMContentLoaded', () => {
  // DOM Selection
  const tile = Array.from(document.querySelectorAll('.tile'));
  const game = document.querySelector('.game');
  const menu = document.querySelector('.menu');
  const resetGameBtn = document.querySelector('.reset-game');
  const MenuBtn = document.querySelector('.return-menu');
  const pickFriendBtn = document.querySelector('.opponent-friend');
  const pickAIBtn = document.querySelector('.opponent-AI');

  const announcer = document.querySelector('.announcer');
  const announceWinner = document.querySelector('.announce-winner');
  const finalWinnerAnnouncement = document.querySelector('.score');
  const player1Score = document.querySelector('.scoreX');
  const player2Score = document.querySelector('.scoreO');

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
    _opponent: '',
    _roundWon: false,
    _moves: 0,
    _roundTie: false,
    _isGameActive: true,
    _board: ['', '', '', '', '', '', '', '', ''],
    _player1: 'X',
    _player2: 'O',
    _currentPlayer: this._player1,
    _player1Score: 0,
    _player2Score: 0,
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
  const setOpponentAsFriend = function () {
    gameBoard._opponent = 'friend';
    console.log(gameBoard._opponent);
    gameBoard._currentPlayer = gameBoard._player1;
    renderScoreBoard();
  };

  const setOpponentAsAI = function () {
    gameBoard._opponent = 'AI';
    console.log(gameBoard._opponent);
    gameBoard._currentPlayer = gameBoard._player1;
    renderScoreBoard();
  };

  const addPlayerScore = function (index) {
    // console.log(gameBoard._currentPlayer);
    // console.log(index);
    if (gameBoard._currentPlayer === gameBoard._player1) {
      gameBoard._board[index] = gameBoard._currentPlayer;
      gameBoard._moves++;
    } else {
      gameBoard._board[index] = gameBoard._currentPlayer;
      gameBoard._moves++;
    }
  };

  const resetBoard = function () {
    gameBoard._board = ['', '', '', '', '', '', '', '', ''];
    // gameBoard._isGameActive = true;
    gameBoard._roundWon = false;
    gameBoard._roundTie = false;
    gameBoard._moves = 0;

    if (gameBoard._currentPlayer === 'O') switchPlayers();

    if (!gameBoard._isGameActive) {
      announcer.textContent = '';
    } else {
      announcer.textContent = `Player ${gameBoard._currentPlayer}'s turn`;
    }

    if (gameBoard._isGameActive) {
      tile.forEach((tile) => {
        tile.textContent = '';
        tile.classList.remove('playerX');
        tile.classList.remove('playerO');
      });
    }
  };

  const resetGame = function () {
    gameBoard._roundWon = false;
    gameBoard._moves = 0;
    gameBoard._roundTie = false;
    gameBoard._isGameActive = true;
    gameBoard._board = ['', '', '', '', '', '', '', '', ''];
    gameBoard._player1 = 'X';
    gameBoard._player2 = 'O';
    gameBoard._currentPlayer = gameBoard._player1;
    gameBoard._player1Score = 0;
    gameBoard._player2Score = 0;

    if (gameBoard._currentPlayer === 'O') {
      switchPlayers();
    }

    if (!gameBoard._isGameActive) {
      announceWinner.classList.add('hide');
      return;
    }

    if (gameBoard._isGameActive) {
      announceWinner.classList.add('hide');
      announcer.textContent = `Player ${gameBoard._currentPlayer}'s turn`;
      finalWinnerAnnouncement.textContent = `First player to reach 3 points wins!`;
    }

    renderScoreBoard();

    tile.forEach((tile) => {
      tile.textContent = '';
      tile.classList.remove('playerX');
      tile.classList.remove('playerO');
    });
  };

  /**
   * Compares player's score to the winning condition's array
   */
  const checkingWin = function (tile, index) {
    for (let i = 0; i <= 7; i++) {
      const winCondition = gameBoard._winningConditions[i];

      const a = gameBoard._board[winCondition[0]];
      const b = gameBoard._board[winCondition[1]];
      const c = gameBoard._board[winCondition[2]];

      if (a === '' || b === '' || c === '') {
        continue;
      }
      if (a === b && b === c) {
        gameBoard._roundWon = true;
        break;
      }
    }
  };

  const checkingDraw = function () {
    if (gameBoard._moves === 9 && !gameBoard._roundWon) {
      return (gameBoard._roundTie = true);
    }
  };

  const resetAnnouncerColor = function () {
    announcer.classList.remove('playerX');
    announcer.classList.remove('playerO');
  };

  const checkGameOver = function () {
    checkingWin();
    checkingDraw();
    if (gameBoard._roundWon) {
      announcer.textContent = `Player ${gameBoard._currentPlayer} Wins!`;
      resetAnnouncerColor();
      announcer.classList.add(`player${gameBoard._currentPlayer}`);

      gameBoard._currentPlayer === 'X'
        ? gameBoard._player1Score++
        : gameBoard._player2Score++;

      setTimeout(resetBoard, 1000);
    }

    if (gameBoard._roundTie) {
      announcer.textContent = `It's a Draw!`;
      resetAnnouncerColor();
      setTimeout(resetBoard, 1000);
    }

    if (gameBoard._player1Score === 1) {
      endGame();
      return;
    }

    if (gameBoard._player2Score === 1) {
      endGame();
      return;
    }
  };

  const switchPlayers = function () {
    if (gameBoard._roundWon || gameBoard._roundTie) return;

    gameBoard._currentPlayer =
      gameBoard._currentPlayer === gameBoard._player1
        ? gameBoard._player2
        : gameBoard._player1;

    announcer.textContent = `Player ${gameBoard._currentPlayer}'s turn`;
    resetAnnouncerColor();
    announcer.classList.add(`player${gameBoard._currentPlayer}`);
  };

  const renderScoreBoard = function () {
    if (gameBoard._opponent === 'friend') {
      player1Score.textContent = `Player X: ${gameBoard._player1Score}`;
      player2Score.textContent = `Player O: ${gameBoard._player2Score}`;
    } else {
      player1Score.textContent = 'Player (X) Score: 0';
      player2Score.textContent = 'AI (O) Score: 0';
    }
  };

  const endGame = function () {
    gameBoard._isGameActive = false;
    announceWinner.textContent = `Player ${gameBoard._currentPlayer} wins the game!`;
  };

  /**********************************/
  // Minimax Algorithm - An unbeatable AI opponent
  // Player - Minimiser
  // AI - Maximiser

  /**********************************/
  // UI - Rendering

  const playWithFriend = function (e) {
    e.preventDefault();
    menu.classList.add('hide');
    game.classList.remove('hide');
    setOpponentAsFriend();
  };

  const playWithAI = function (e) {
    e.preventDefault();
    menu.classList.add('hide');
    game.classList.remove('hide');
    setOpponentAsAI();
  };

  const returnToMenu = function (e) {
    e.preventDefault();
    game.classList.add('hide');
    menu.classList.remove('hide');
  };

  /**
   * Renders tile which player selects
   */
  const renderTile = function (tile, index) {
    if (gameBoard._roundWon || gameBoard._roundTie) return;

    if (tile.textContent === '') {
      tile.textContent = gameBoard._currentPlayer;
      tile.classList.add(`player${gameBoard._currentPlayer}`);

      addPlayerScore(index);
      checkGameOver();
      switchPlayers();
      renderScoreBoard();
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

  resetGameBtn.addEventListener('click', resetGame);
  MenuBtn.addEventListener('click', returnToMenu);
  pickFriendBtn.addEventListener('click', playWithFriend);
  pickAIBtn.addEventListener('click', playWithAI);
});
