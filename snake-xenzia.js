const FIRST_CELL_IDX = 1;
const CELLS_IN_A_ROW = 120;
const TOTAL_CELLS = 14400;
const UPDATE_FREQUENCY = 50;

const snakeInitIndex = getRandomNumber(FIRST_CELL_IDX, TOTAL_CELLS);
const snake = {
  headIdx: snakeInitIndex,
  tailIdx: snakeInitIndex,
  size: 1,
  body: ["left", "right", "right", "right"],
  turnPoint: [],
  prevDirection: [],
  direction: "left",
  status: "pause",
};

let randomTargetIx = 0;
const createCellFunc = cellClosure();

createRows();
drawSnake();
generateTarget();

function updateSnakeDirection(direction) {
  snake.prevDirection.push(snake.direction);
  snake.direction = direction;
  snake.turnPoint.push(snake.headIdx);
}

function createRows() {
  let groundElement = document.getElementById("ground");

  for (let rowIdx = 1; rowIdx <= CELLS_IN_A_ROW; rowIdx++) {
    let rowElement = document.createElement("div");
    rowElement.className = "flex ground-row";
    rowElement.id = "ground-row-" + rowIdx;

    createCellFunc(rowElement);

    groundElement.appendChild(rowElement);
  }
}

function cellClosure() {
  let cellIdIdx = 1;

  return function createCell(rowElement) {
    for (let cellIdx = 1; cellIdx <= CELLS_IN_A_ROW; cellIdx++) {
      let cellElement = document.createElement("div");
      cellElement.className = "flex-item ground-cell";
      cellElement.id = cellIdIdx;
      cellIdIdx++;

      rowElement.appendChild(cellElement);
    }
  };
}

function drawSnake() {
  if (snake.direction == "left") {
    let size = 1;
    let cellIdx = snake.headIdx;

    while (cellIdx <= snake.tailIdx && size <= snake.size) {
      giveColorToSnake(cellIdx);

      size++;
      cellIdx++;
    }
  } else if (snake.direction == "right") {
    let size = 1;
    let cellIdx = snake.headIdx;

    while (cellIdx >= snake.tailIdx && size <= snake.size) {
      giveColorToSnake(cellIdx);

      size++;
      cellIdx--;
    }
  } else if (snake.direction == "down") {
    let size = 1;
    let cellIdx = snake.headIdx;

    while (cellIdx >= snake.tailIdx && size <= snake.size) {
      giveColorToSnake(cellIdx);

      size++;
      cellIdx -= CELLS_IN_A_ROW;
    }
  } else if (snake.direction == "up") {
    let size = 1;
    let cellIdx = snake.headIdx;

    while (cellIdx <= snake.tailIdx && size <= snake.size) {
      giveColorToSnake(cellIdx);

      size++;
      cellIdx += CELLS_IN_A_ROW;
    }
  }
}

function giveColorToSnake(cellIdx) {
  const snakeCellElement = document.getElementById(cellIdx);
  let snakeStyle =
    cellIdx == snake.headIdx ? "snake-head-present" : "snake-present";
  snakeCellElement.classList.add(snakeStyle);
}

function moveSnake() {
  removePreviousHead();
  updateNewHead();

  if (snake.headIdx == randomTargetIx) {
    generateTarget();
    snake.size++;
  } else {
    removePreviousTail();
    updateNewTail();
  }
}

function removePreviousHead() {
  let snakeHeadElement = document.getElementById(snake.headIdx);
  snakeHeadElement.classList.remove("snake-head-present");
  snakeHeadElement.classList.add("snake-present");
}

function removePreviousTail() {
  let snakeTailElement = document.getElementById(snake.tailIdx);
  snakeTailElement.classList.remove("snake-present");
}

function updateNewHead() {
  if (snake.direction == "right") {
    if (snake.headIdx % CELLS_IN_A_ROW == 0) {
      snake.headIdx = snake.headIdx - (CELLS_IN_A_ROW - 1);
    } else {
      snake.headIdx++;
    }
  } else if (snake.direction == "left") {
    if (snake.headIdx % CELLS_IN_A_ROW == 1) {
      snake.headIdx = snake.headIdx + (CELLS_IN_A_ROW - 1);
    } else {
      snake.headIdx--;
    }
  } else if (snake.direction == "up") {
    snake.headIdx -= CELLS_IN_A_ROW;

    if (snake.headIdx <= 0) {
      snake.headIdx = TOTAL_CELLS + (snake.headIdx % CELLS_IN_A_ROW);
    }
  } else if (snake.direction == "down") {
    snake.headIdx += CELLS_IN_A_ROW;
    if (snake.headIdx > TOTAL_CELLS) {
      snake.headIdx %= TOTAL_CELLS;
    }
  }

  let newSnakeHeadElement = document.getElementById(snake.headIdx);
  newSnakeHeadElement.classList.add("snake-head-present");
}

function updateNewTail() {
  if (snake.turnPoint.length > 0 && snake.turnPoint[0] == snake.tailIdx) {
    snake.turnPoint.shift();
    snake.prevDirection.shift();
  }

  const tailDirection =
    snake.prevDirection.length > 0 ? snake.prevDirection[0] : snake.direction;
  if (tailDirection == "right") {
    if (snake.tailIdx % CELLS_IN_A_ROW == 0) {
      snake.tailIdx = snake.tailIdx - (CELLS_IN_A_ROW - 1);
    } else {
      snake.tailIdx++;
    }
  } else if (tailDirection == "left") {
    if (snake.tailIdx % CELLS_IN_A_ROW == 1) {
      snake.tailIdx = snake.tailIdx + (CELLS_IN_A_ROW - 1);
    } else {
      snake.tailIdx--;
    }
  } else if (tailDirection == "up") {
    snake.tailIdx -= CELLS_IN_A_ROW;

    if (snake.tailIdx <= 0) {
      snake.tailIdx = TOTAL_CELLS + (snake.tailIdx % CELLS_IN_A_ROW);
    }
  } else if (tailDirection == "down") {
    snake.tailIdx += CELLS_IN_A_ROW;
    if (snake.tailIdx > TOTAL_CELLS) {
      snake.tailIdx %= TOTAL_CELLS;
    }
  }
}

function addControls() {
  let intervalObj = null;

  return function defineControlAction() {
    const controlElement = document.getElementById("control-button");
    let status = controlElement.getAttribute("data-status");

    if (status == "pause") {
      controlElement.setAttribute("data-status", "play");
      intervalObj = setInterval(moveSnake, UPDATE_FREQUENCY);
      controlElement.innerHTML = "PAUSE";
    } else if (status == "play") {
      controlElement.setAttribute("data-status", "pause");
      controlElement.innerHTML = "PLAY";
      clearInterval(intervalObj);
    }
  };
}

document.addEventListener("keydown", (event) => {
  if (event.keyCode == 32) {
    defineControlAction();
  } else if (event.keyCode == 37) {
    updateSnakeDirection("left");
  } else if (event.keyCode == 38) {
    updateSnakeDirection("up");
  } else if (event.keyCode == 39) {
    updateSnakeDirection("right");
  } else if (event.keyCode == 40) {
    updateSnakeDirection("down");
  }
});

const defineControlAction = addControls();

const controlElement = document.getElementById("control-button");
controlElement.addEventListener("click", defineControlAction);

const upControlElement = document.getElementById("up-control");
upControlElement.addEventListener("click", () => updateSnakeDirection("up"));
const downControlElement = document.getElementById("down-control");
downControlElement.addEventListener("click", () =>
  updateSnakeDirection("down")
);
const leftControlElement = document.getElementById("left-control");
leftControlElement.addEventListener("click", () =>
  updateSnakeDirection("left")
);
const rightControlElement = document.getElementById("right-control");
rightControlElement.addEventListener("click", () =>
  updateSnakeDirection("right")
);

// Move Snake Randomly
// setInterval(() => {
//   let randomIndex = Math.floor(Math.random() * 3);
//   let actionMap = ['up', 'down', 'left', 'right'];
//   snake.direction = actionMap[randomIndex];
// }, 500);

function generateTarget() {
  if (randomTargetIx != 0) {
    const randomTargetElement = document.getElementById(randomTargetIx);
    randomTargetElement.classList.remove("target");
  }
  randomTargetIx = getRandomNumber(FIRST_CELL_IDX, TOTAL_CELLS);
  const randomTargetElement = document.getElementById(randomTargetIx);
  randomTargetElement.classList.add("target");
}

function getRandomNumber(min, max) {
  // Add 1 to the range to include the maximum value
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
