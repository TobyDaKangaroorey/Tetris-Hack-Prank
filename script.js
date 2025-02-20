/************************************/
/* 1) Fake "Hacking" / Loading Bar  */
/************************************/

const messages = [
    "Initializing Mangebac backdoor access...",
    "Bypassing firewall...",
    "Decrypting administrator passwords...",
    "Accessing Grade Database...",
    "Extracting student grades...",
    "Wait... what's this?",
    "ERROR: Student grade modification detected!",
    "LOCKING ACCOUNT...",
    "DISABLING INTERNET, ALL WIFI DRIVERS BECOMING OUTDATED...",
    "STEALING THE MOON? 😬"
  ];
  
  let output = document.getElementById("output");
  let loadingBar = document.querySelector(".loading-bar");
  let bellaCiao = new Audio("bellaciao.mp3"); // Bella Ciao instead of hacking noise
  bellaCiao.loop = true; // Initially looping for the hack phase
  
  let i = 0;
  let totalMessages = messages.length;
  
  /**
   * Displays the next message and updates the progress bar.
   */
  function displayNextMessage() {
    if (i < totalMessages) {
      output.innerHTML += messages[i] + "\n";
      i++;
      // Update progress bar percentage
      let progress = (i / totalMessages) * 100;
      loadingBar.style.width = progress + "%";
      setTimeout(displayNextMessage, 1500);
    } else {
      setTimeout(() => {
        alert("HACK COMPLETE: You have now been added to the 'Best Student' list 😆");
        // Show the "Continue with Verification" button
        document.getElementById("continueBtn").style.display = "inline-block";
      }, 2000);
    }
  }
  
  /**
   * Starts the prank: goes fullscreen, plays Bella Ciao, and displays messages.
   */
  function startPrank() {
    document.documentElement.requestFullscreen();
    bellaCiao.play();
    displayNextMessage();
  }
  
  /**************************************/
  /* 2) Tetris Game with Challenge Mode */
  /**************************************/
  
  // Global variables for Tetris and challenge
  let canvas, context;
  let arena;
  let player;
  let dropCounter = 0;
  let dropInterval = 1000; // Drop every 1 second
  let lastTime = 0;
  let gameOver = false;
  
  // Challenge variables
  let score = 0;
  let challengeTimeRemaining = 0;  // In seconds
  let challengeInterval;           // For countdown timer
  
  /**
   * Creates a w x h matrix filled with zeros.
   */
  function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
      matrix.push(new Array(w).fill(0));
    }
    return matrix;
  }
  
  /**
   * Returns a Tetris piece matrix based on type.
   */
  function createPiece(type) {
    switch (type) {
      case 'T':
        return [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ];
      case 'O':
        return [
          [2, 2],
          [2, 2],
        ];
      case 'L':
        return [
          [3, 0, 0],
          [3, 0, 0],
          [3, 3, 0],
        ];
      case 'J':
        return [
          [0, 4, 0],
          [0, 4, 0],
          [4, 4, 0],
        ];
      case 'I':
        return [
          [5, 5, 5, 5],
        ];
      case 'S':
        return [
          [0, 6, 6],
          [6, 6, 0],
          [0, 0, 0],
        ];
      case 'Z':
        return [
          [7, 7, 0],
          [0, 7, 7],
          [0, 0, 0],
        ];
    }
  }
  
  /**
   * Draws the arena and the player's piece.
   */
  function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
  }
  
  /**
  
   */
  function drawMatrix(matrix, offset) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] !== 0) {
          context.fillStyle = 'lime'; // All pieces are lime
          context.fillRect((x + offset.x) * 20, (y + offset.y) * 20, 20, 20);
        }
      }
    }
  }
  
  /**

   */
  function merge(arena, player) {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  }
  
  /**
   * 
   */
  function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (
          m[y][x] !== 0 &&
          (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0
        ) {
          return true;
        }
      }
    }
    return false;
  }
  
  /**

   */
  function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
      player.pos.y--;
      merge(arena, player);
      playerReset();
      arenaSweep();
    }
    dropCounter = 0;
  }
  
  /**
 
   */
  function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
      player.pos.x -= dir;
    }
  }
  
  /**

   */
  function playerRotate() {
    const matrix = player.matrix;
    // Transpose
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < y; x++) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
      }
    }
  
    matrix.forEach(row => row.reverse());
  
    if (collide(arena, player)) {
   
      matrix.forEach(row => row.reverse());
      for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < y; x++) {
          [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
      }
    }
  }
  
  /**
 
   */
  function arenaSweep() {
    let rowCleared = 0;
    outer: for (let y = arena.length - 1; y > 0; y--) {
      if (!arena[y].includes(0)) {
        arena.splice(y, 1);
        arena.unshift(new Array(arena[0].length).fill(0));
        rowCleared++;
        y++;
      }
    }
    if (rowCleared > 0) {
      score += rowCleared * 10; // 10 points per cleared row
      document.getElementById('score').innerText = score;
  
      if (score >= 100) {
        endChallenge();
      }
    }
  }
  
  /**
   *
   */
  function playerReset() {
    const pieces = 'TOLJISZ';
    const randPiece = pieces[Math.floor(Math.random() * pieces.length)];
    player.matrix = createPiece(randPiece);
    player.pos.y = 0;
    player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
    if (collide(arena, player)) {
      gameOver = true;
      alert("Game Over! The hack is incomplete!");
      arena.forEach(row => row.fill(0));
    }
  }
  
  /**
   *
   */
  function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (!gameOver) {
      if (dropCounter > dropInterval) {
        playerDrop();
      }
      draw();
      requestAnimationFrame(update);
    }
  }
  

  function startTetris() {
    // Hide the hacking UI
    document.querySelector('.terminal').style.display = 'none';

    document.getElementById('tetris-container').style.display = 'block';
    
   
    bellaCiao.loop = false;
  

    canvas = document.getElementById('tetris');
    context = canvas.getContext('2d');
  

    arena = createMatrix(10, 20);
  
  
    player = {
      pos: { x: 0, y: 0 },
      matrix: null,
    };
  
    playerReset();
    draw();
    update();
  
   
    let challengeTimeTotal = 60; // default 60 seconds
    if (bellaCiao.duration && !isNaN(bellaCiao.duration)) {
      challengeTimeTotal = Math.floor(bellaCiao.duration);
    }
    challengeTimeRemaining = challengeTimeTotal;
    document.getElementById('timeRemaining').innerText = challengeTimeRemaining;
    challengeInterval = setInterval(updateChallengeTimer, 1000);
  
    
    document.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {
        playerMove(-1);
      } else if (event.key === 'ArrowRight') {
        playerMove(1);
      } else if (event.key === 'ArrowDown') {
        playerDrop();
      } else if (event.key === 'ArrowUp') {
        playerRotate();
      }
    });
  }
  
  /**
   
   */
  function updateChallengeTimer() {
    challengeTimeRemaining--;
    document.getElementById('timeRemaining').innerText = challengeTimeRemaining;
    if (challengeTimeRemaining <= 0) {
      clearInterval(challengeInterval);
      endChallenge();
    }
  }
  
  /**

   */
  function endChallenge() {
    clearInterval(challengeInterval);
    gameOver = true; // Stop the game loop
    if (score >= 100) {
      alert("Challenge complete! Grades have been reverted!\nTime remaining: " + challengeTimeRemaining + " seconds");
    } else {
      alert("Time's up! Hack incomplete. Grades remain altered.");
    }
  }
  
