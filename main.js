var GAMEPLAY_WIDTH   = 10,
    GAMEPLAY_HEIGHT  = 10,
    COLOR_DIFFERENCE = 100;

var config = {
  time: 60,
  score: 0,
  difficulty: [1, 2, 3, 4, 5, 6, 7]
};

var values = {
  rowClass: "row",
  cellClass: "cell",
  scoreId: "score",
  gameplayId: "gameplay",
  entranceId: "entrance",
  playButtonId: "play-button",
  scoreboardId: "scoreboard",
  finalScoreId: "final-score",
  hiddenClass: "hidden",
  replayButtonId: "replay-button",
  scoreLabel: "Score: ",
}

/* ---------------
 * Utility methods
 * ---------------
 */
function random(number) {
  return Math.floor(Math.random() * number);
}


/* --------------------------
 * Score manipulation methods
 * --------------------------
 */
function setScore(score) {
  config.score = score;
  document.getElementById(values.scoreId).innerHTML = score;
}

function incrementScore() {
  config.score = config.score + 1;
  setScore(config.score);
}


/* ----------------------------
 * Color manipulation functions
 * ----------------------------
 */
function generateColorDifference() {
  var difficultyLevel = random(config.difficulty.length);
  return COLOR_DIFFERENCE / config.difficulty[difficultyLevel];
}

function getRGB(red, green, blue) {
  return 'rgb(' + [red, green, blue].join(',') + ')';
}


/* ------------------------
 * DOM manipulation methods
 * ------------------------
 */
function removeAllChildren(elementId) {
  while (true) {
    var element = document.getElementById(elementId);
    if (!element || !element.firstChild) break;
    element.removeChild(element.firstChild);
  }
}

function setupGrid() {

  function createElementWithParentId(parentId, elementType, className) {
    var parent = document.getElementById(parentId),
        child  = document.createElement(elementType);

    child.className = className;
    parent.appendChild(child);
  }

  function createElementWithParentClass(parentClass, elementType, className) {
    var parents = document.getElementsByClassName(parentClass);

    for (var i = 0; i < parents.length; i++) {
      var child = document.createElement(elementType);
      child.className = className;
      parents[i].appendChild(child);
    }
  }

  removeAllChildren(values.gameplayId);

  // Adds rows
  for (var i = 0; i < GAMEPLAY_HEIGHT; i++) {
    createElementWithParentId(values.gameplayId, "div", values.rowClass);
  }

  // Adds cells
  for (var i = 0; i < GAMEPLAY_WIDTH; i++) {
    createElementWithParentClass(values.rowClass, "div", values.cellClass);
  }
}

function setupCellColor(colorOffset) {
  var randomRed   = random(256 - colorOffset),
      randomGreen = random(256 - colorOffset),
      randomBlue  = random(256 - colorOffset),
      rgb = [randomRed, randomGreen, randomBlue];
  var randomColor = getRGB(rgb[0], rgb[1], rgb[2]);

  // Sets background color for all cells
  var cells = document.getElementsByClassName("cell");
  for (var i = 0; i < cells.length; i++) {
    cells[i].style.backgroundColor = randomColor;
  }
}

function setupUniqueCell(colorOffset) {
  var cells = document.getElementsByClassName(values.cellClass),
      index = random(cells.length),
      color = cells[index].style.backgroundColor;

  function parsePrimaryColor(rgb) {
    var startIndex = rgb.indexOf('(') + 1,
        endIndex   = rgb.indexOf(')');
    var rgbValues  = rgb.substring(startIndex, endIndex);
    return rgbValues.split(',').map(function(value) {
      return parseInt(value);
    });
  }

  // Creates new color for unique cell
  var rgb = parsePrimaryColor(color);
  rgb[0] = Math.floor(rgb[0] + colorOffset);
  rgb[1] = Math.floor(rgb[1] + colorOffset);
  rgb[2] = Math.floor(rgb[2] + colorOffset);
  randomColor = getRGB(rgb[0], rgb[1], rgb[2]);
  
  // Sets new color and event listener for the random cell
  cells[index].style.backgroundColor = randomColor;
  cells[index].addEventListener("click", function() {
    setupGameplay();
    incrementScore();
  });
}

function setupGameplay() {
  var colorOffset = generateColorDifference();

  setupGrid();
  setupCellColor(colorOffset);
  setupUniqueCell(colorOffset);
}

function setupEntrance() {
  var playButton = document.getElementById(values.playButtonId);
  playButton.addEventListener("click", function() {
    var entrance = document.getElementById(values.entranceId);
    entrance.className += " hidden";
    setupTimeCounter();
  });
}

function main() {
  setupEntrance();
  setupGameplay();
}

/* --------------------------------
 * Time counter running in parallel
 * --------------------------------
 */
function showScoreboard() {

  function resetConfig() {
    config.time  = 60;
    config.score = 0;
  }

  document.getElementById(values.scoreboardId).className = "";
  document.getElementById(values.finalScoreId).innerHTML = values.scoreLabel + config.score;
  document.getElementById(values.scoreId).innerHTML = "0";
  document.getElementById(values.replayButtonId).addEventListener("click", function() {
    scoreboard.className = values.hiddenClass;

    resetConfig();
    setupGameplay();
    setupTimeCounter();
  });
}

function setupTimeCounter() {
  setTimeout(function() {
    config.time = config.time - 1;
    if (config.time === 0) {
      showScoreboard();
      return;
    }
    document.getElementById("time").innerHTML = config.time;
    setupTimeCounter();
  }, 1000);
}

main();