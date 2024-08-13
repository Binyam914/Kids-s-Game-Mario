document.addEventListener("DOMContentLoaded", () => {
  const bgWrap = document.getElementById("bg-wrap");
  const app = document.getElementById("app");
  const backgroundSound = document.getElementById("bg-music");
  const successSound = document.getElementById("success-sound");
  const errorSound = document.getElementById("error-sound");
  
  document.addEventListener('DOMContentLoaded', () => {
    // Function to set the background image
    function setSuccessBackground() {
  bgWrap.style.backgroundImage = "url('path/to/your/static-background-image.jpg')"; // Update to your static background image
}

  
    // Example of setting the background image
    setBackgroundImage('./assets/Mario 1.webp');
  
    // to initialize the game
    // function to start the game:
    startGame();
  });
  

  const screens = {
    mainMenu: document.createElement("div"),
    gameScreen: document.createElement("div"),
    gameOverScreen: document.createElement("div"),
  };

  screens.mainMenu.id = "main-menu";
  screens.gameScreen.id = "game-screen";
  screens.gameOverScreen.id = "game-over";

  // Main Menu
  screens.mainMenu.classList.add("screen");
  screens.mainMenu.innerHTML = `
    <h1>Terrible Twos</h1>
    <button id="start-game" class="btn">Start Game</button>
    <button id="instructions" class="btn">Instructions</button>
  `;
  app.appendChild(screens.mainMenu);

  // Game Screen
  screens.gameScreen.classList.add("screen");
  screens.gameScreen.innerHTML = `
    <div class="score" id="score-counter">Score: 0</div>
    <div id="task-container">
      <div class="content">
        <p id="task-question"></p>
        <div id="task-options" class="task-options"></div>
      </div>
    </div>
  `;
  app.appendChild(screens.gameScreen);
  setSuccessBackground();

  // Game Over Screen
  screens.gameOverScreen.classList.add("screen");
  screens.gameOverScreen.innerHTML = `
    <h1>Game Over</h1>
    <p id="final-score"></p>
    <button id="restart-game" class="btn">Restart</button>
  `;
  app.appendChild(screens.gameOverScreen);

  // Initial Screen
  showScreen("mainMenu");
  setSuccessBackground();

  // Event Listeners
  document.getElementById("start-game").addEventListener("click", () => {
    startGame();
  });

  document.getElementById("restart-game").addEventListener("click", () => {
    startGame();
  });

  function showScreen(screen) {
    Object.values(screens).forEach((s) => (s.style.display = "none"));
    screens[screen].style.display = "flex";
  }

  let score = 0;
  let currentTaskIndex = 0;
  let correctAnswersInCurrentTask = 0;

  const tasks = [
    {
      question: "You woke up, what do you do?",
      options: ["Get dressed", "Wash face and hands", "Eat breakfast"],
      correctOrder: ["Get dressed", "Wash face and hands", "Eat breakfast"],
      images: [
        "assets/dressing.jpg",
        "assets/washing up.jpg",
        "assets/breakfast.webp",
      ],
    },
    {
      question: "Playtime at the park. What do you do?",
      options: ["Go to the park", "Share toys"],
      correctOrder: ["Go to the park", "Share toys"],
      images: ["assets/going to park.webp", "assets/sharing1.jpg"],
    },
    {
      question: "Lunch time, what do you do?",
      options: ["Wash hands", "Eat lunch", "Take a nap"],
      correctOrder: ["Wash hands", "Eat lunch", "Take a nap"],
      images: [
        "assets/washing hand.webp",
        "assets/breakfast.webp",
        "assets/nap1.jpg",
      ],
    },
    {
      question: "Dinner time, what do you do?",
      options: ["Wash hands", "Eat dinner", "Brush teeth", "Go to sleep"],
      correctOrder: ["Wash hands", "Eat dinner", "Brush teeth", "Go to sleep"],
      images: [
        "assets/washing hand.webp",
        "assets/breakfast.webp",
        "assets/brushing.png",
        "assets/sleeping.jpg",
      ],
    },
  ];

  function startGame() {
    score = 0;
    currentTaskIndex = 0;
    correctAnswersInCurrentTask = 0;
    updateScore();
    backgroundSound.play();
    shuffleTasks();
    showScreen("gameScreen");
    displayTask();
    setSuccessBackground();
  }

  function shuffleTasks() {
    tasks.forEach((task) => {
      for (let i = task.options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [task.options[i], task.options[j]] = [task.options[j], task.options[i]];
        [task.images[i], task.images[j]] = [task.images[j], task.images[i]];
      }
    });
  }

  function displayTask() {
    if (currentTaskIndex < tasks.length) {
      const task = tasks[currentTaskIndex];
      document.getElementById("task-question").textContent = task.question;
      const taskOptions = document.getElementById("task-options");
      taskOptions.innerHTML = "";
      task.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.classList.add("task-option");
        button.style.backgroundImage = `url('${task.images[index]}')`;
        button.dataset.option = option;
        button.innerHTML = `<span class="task-name">${option}</span>`;
        button.addEventListener("click", () => handleTask(button, option));
        taskOptions.appendChild(button);
      });
    } else {
      endGame();
    }
  }

  function handleTask(button, option) {
    const task = tasks[currentTaskIndex];
    const expectedOption = task.correctOrder[correctAnswersInCurrentTask];
    if (option === expectedOption) {
      score++;
      correctAnswersInCurrentTask++;
      successSound.play();
      button.classList.add("correct");
      // showCelebration(); // Call the celebration function i add the celebration
      setTimeout(() => {
        button.classList.remove("correct");
        button.style.visibility = "hidden";
        if (correctAnswersInCurrentTask === task.correctOrder.length) {
          correctAnswersInCurrentTask = 0;
          currentTaskIndex++;
          setTimeout(displayTask, 1000);
        }
        // Center remaining options
        const taskOptions = document.getElementById("task-options");
        taskOptions.style.display = "flex";
        taskOptions.style.justifyContent = "center";
      }, 500);
      updateScore();
    } else {
      errorSound.play();
      button.classList.add("incorrect");
      setTimeout(() => {
        button.classList.remove("incorrect");
        endGame(true);
      }, 500);
    }
  }

  function updateScore() {
    document.getElementById("score-counter").textContent = `Score: ${score}`;
  }

  function endGame(wrong = false) {
    backgroundSound.pause();
    const finalScoreElement = document.getElementById("final-score");
    if (wrong) {
      finalScoreElement.innerHTML = `Game Over! Your Score: ${score}`;
    } else {
      finalScoreElement.innerHTML = `
      <span style="font-size: 32px;">Congratulations!</span><br />
      You just completed the game.<br />
      <span style="font-size: 24px;">Tune in for more levels coming shortly.</span><br />
      Your Score: ${score}
    `;
    }
    showScreen("gameOverScreen");

    if (!wrong) {
      setSuccessBackground();
    }
  }

  function setSuccessBackground() {
    bgWrap.innerHTML = `
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient
            id="SuccessGradient"
            cx="50%"
            cy="50%"
            fx="0.441602%"
            fy="50%"
            r=".5"
          >
            <stop offset="0%" stop-color="rgba(0, 255, 0, 1)"></stop>
            <stop offset="100%" stop-color="rgba(0, 255, 0, 0)"></stop>
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#SuccessGradient)">
          <animate
            attributeName="x"
            dur="20s"
            values="25%;0%;25%"
            repeatCount="indefinite"
          ></animate>
          <animate
            attributeName="y"
            dur="21s"
            values="0%;25%;0%"
            repeatCount="indefinite"
          ></animate>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="7s"
            repeatCount="indefinite"
          ></animateTransform>
        </rect>
      </svg>
    `;
  }
});
