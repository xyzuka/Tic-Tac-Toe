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
    _aiTurn: false,
    _playersTurn: false,
    _winningScore: 2,
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
    gameBoard._aiTurn = true;
    console.log(gameBoard._opponent);
    gameBoard._currentPlayer = gameBoard._player1;
    renderScoreBoard();

    if (
      gameBoard._isGameActive &&
      gameBoard._opponent === 'AI' &&
      gameBoard._aiTurn
    )
      AISelectsTile();
  };

  const addPlayerMoves = function (index) {
    if (gameBoard._currentPlayer === gameBoard._player1) {
      gameBoard._board[index] = gameBoard._currentPlayer;
      gameBoard._moves++;
    } else {
      gameBoard._board[index] = gameBoard._currentPlayer;
      gameBoard._moves++;
    }
  };

  const resetBoard = function () {
    gameBoard._aiTurn = true;
    gameBoard._isGameActive = true;
    gameBoard._playersTurn = false;
    gameBoard._currentPlayer = gameBoard._player1;
    gameBoard._board = ['', '', '', '', '', '', '', '', ''];
    gameBoard._roundWon = false;
    gameBoard._roundTie = false;
    gameBoard._moves = 0;

    if (gameBoard._isGameActive && gameBoard._currentPlayer === 'O')
      switchPlayers();

    if (gameBoard._isGameActive && !gameBoard._roundTie) {
      announceWinner.classList.add('hide');
      clearGameBoard();
    }

    if (
      gameBoard._isGameActive &&
      gameBoard._opponent === 'AI' &&
      gameBoard._aiTurn
    )
      AISelectsTile();

    if (!gameBoard._isGameActive) {
      announceWinner.textContent = `Player ${gameBoard._currentPlayer} wins the game!`;
      announcer.classList.add('hide');
    } else {
      announcer.textContent = `Player ${gameBoard._currentPlayer}'s turn`;
    }

    if (gameBoard._roundTie) {
      announceWinner.classList.add('hide');
    }
  };

  const resettingGameState = function () {
    gameBoard._aiTurn = true;
    gameBoard._isGameActive = true;
    gameBoard._playersTurn = false;
    gameBoard._board = ['', '', '', '', '', '', '', '', ''];
    gameBoard._roundWon = false;
    gameBoard._roundTie = false;
    gameBoard._moves = 0;
    gameBoard._player1Score = 0;
    gameBoard._player2Score = 0;
    gameBoard._player1 = 'X';
    gameBoard._player2 = 'O';
    gameBoard._currentPlayer = gameBoard._player1;
  };

  const resetGame = function () {
    if (gameBoard._isGameActive && gameBoard._currentPlayer === 'O') {
      switchPlayers();
    }
    resettingGameState();

    clearGameBoard();

    if (
      gameBoard._isGameActive &&
      gameBoard._opponent === 'AI' &&
      gameBoard._aiTurn
    )
      AISelectsTile();

    renderScoreBoard();
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
      announceWinner.textContent = `Player ${gameBoard._currentPlayer} Wins!`;
      announceWinner.classList.remove('hide');
      announcer.classList.add(`player${gameBoard._currentPlayer}`);

      gameBoard._currentPlayer === 'X'
        ? gameBoard._player1Score++
        : gameBoard._player2Score++;

      setTimeout(resetBoard, 1500);
    }

    if (gameBoard._roundTie) {
      announceWinner.textContent = `No one wins! It's a Draw!`;
      announceWinner.classList.remove('hide');
      setTimeout(resetBoard, 1500);
    }

    if (gameBoard._player1Score === gameBoard._winningScore) {
      endGame();
      return;
    }

    if (gameBoard._player2Score === gameBoard._winningScore) {
      endGame();
      return;
    }
  };

  const renderTurnAnnouncer = function () {
    announcer.textContent = `Player ${gameBoard._currentPlayer}'s turn`;
    announcer.classList.add(`player${gameBoard._currentPlayer}`);
  };

  const switchPlayers = function () {
    if (gameBoard._roundWon || gameBoard._roundTie) return;

    if (gameBoard._isGameActive && gameBoard._opponent === 'friend') {
      gameBoard._currentPlayer =
        gameBoard._currentPlayer === gameBoard._player1
          ? gameBoard._player2
          : gameBoard._player1;
    }

    if (gameBoard._isGameActive && gameBoard._opponent === 'AI') {
      gameBoard._currentPlayer =
        gameBoard._currentPlayer === gameBoard._player1
          ? gameBoard._player2
          : gameBoard._player1;

      if (gameBoard._aiTurn && !gameBoard._playersTurn) {
        gameBoard._aiTurn = false;
        gameBoard._playersTurn = true;
      } else {
        gameBoard._aiTurn = true;
        gameBoard._playersTurn = false;
      }
    }

    if (gameBoard._aiTurn) {
      AISelectsTile();
    }

    resetAnnouncerColor();
    renderTurnAnnouncer();
  };

  const renderScoreBoard = function () {
    if (gameBoard._opponent === 'friend') {
      player1Score.textContent = `Player X: ${gameBoard._player1Score}`;
      player2Score.textContent = `Player O: ${gameBoard._player2Score}`;
    } else {
      player1Score.textContent = `AI (X) Score: ${gameBoard._player1Score}`;
      player2Score.textContent = `Player (O) Score: ${gameBoard._player2Score}`;
    }

    if (gameBoard._roundWon && gameBoard._isGameActive)
      announceWinner.classList.remove('hide');

    if (
      !gameBoard._roundWon &&
      gameBoard._isGameActive &&
      !gameBoard._roundTie
    ) {
      announceWinner.classList.add('hide');
      announcer.classList.remove('hide');
      announcer.textContent = `Player ${gameBoard._currentPlayer}'s turn`;
    }

    if (!gameBoard._isGameActive) {
      announceWinner.textContent = `Player ${gameBoard._currentPlayer} wins the game!`;
      announceWinner.classList.remove('hide');
    }
  };

  const endGame = function () {
    gameBoard._isGameActive = false;
    renderScoreBoard();
  };

  /**********************************/
  // UI - Rendering

  const clearGameBoard = function () {
    tile.forEach((tile) => {
      tile.textContent = '';
      tile.classList.remove('playerX');
      tile.classList.remove('playerO');
    });
  };

  const renderNewBoard = function () {
    clearGameBoard();
  };

  const playWithFriend = function (e) {
    e.preventDefault();
    gameBoard._aiTurn = false;
    renderNewBoard();
    menu.classList.add('hide');
    game.classList.remove('hide');
    setOpponentAsFriend();
  };

  const playWithAI = function (e) {
    e.preventDefault();
    resetGame();
    menu.classList.add('hide');
    game.classList.remove('hide');

    // Only render tiles if all tiles are empty (debugging the restart bug)
    let emptyTilesRestart = [];
    tile.forEach((tile, index) => {
      if (tile.textContent === '') emptyTilesRestart.push(index);
    });
    if (emptyTilesRestart.length === 9) setOpponentAsAI();
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
    if (
      gameBoard._roundWon ||
      gameBoard._roundTie ||
      !gameBoard._isGameActive ||
      gameBoard._opponent === 'AI'
    )
      return;

    if (tile.textContent === '') {
      tile.textContent = gameBoard._currentPlayer;
      tile.classList.add(`player${gameBoard._currentPlayer}`);

      addPlayerMoves(index);
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

  /**********************************/
  // Minimax Algorithm - An unbeatable AI opponent
  // Player - Minimiser
  // AI - Maximiser

  const renderAITile = function (tile, randomEmptyTileIndex) {
    if (gameBoard._roundWon || gameBoard._roundTie || !gameBoard._isGameActive)
      return;

    if (gameBoard._playersTurn && gameBoard._opponent === 'AI') return;

    if (gameBoard._aiTurn) {
      tile[randomEmptyTileIndex].textContent = 'X';
      tile[randomEmptyTileIndex].classList.add(
        `player${gameBoard._currentPlayer}`
      );
    }
  };

  const AISelectsTile = function () {
    if (gameBoard._aiTurn && gameBoard._opponent === 'AI') {
      // Prevents player from clicking

      // AI searching for empty tile
      let emptyTiles = [];

      tile.forEach((tile, index) => {
        if (tile.textContent === '') emptyTiles.push(index);
      });
      console.log(emptyTiles);

      const randomEmptyTileIndex =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      console.log(`AI Selected: ${randomEmptyTileIndex}`);

      // Render AI move on board
      renderAITile(tile, randomEmptyTileIndex);

      // Store AI moves in data
      addPlayerMoves(randomEmptyTileIndex);

      // Check if game over or tie
      checkGameOver();

      // // Wait for player to go

      // Switch players
      switchPlayers();

      renderScoreBoard();
    }
  };
});
