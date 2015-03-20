var GAMEPLAY_WIDTH = 10,
    GAMEPLAY_HEIGHT = 10,
    COLOR_DIFFERENCE = 100;

var config = {
  time: 60,
  score: 0,
  difficulty: [1, 2, 3, 4, 5, 6, 7]
};

function setScore(score) {
  config.score = score;
  document.getElementById("score").innerHTML = score;
}

function incrementScore() {
  config.score = config.score + 1;
  setScore(config.score);
}

function generateColorDifference() {
  var levelOfDifficulty = Math.floor(Math.random() * config.difficulty.length);
  return COLOR_DIFFERENCE / config.difficulty[levelOfDifficulty];
}

function getRGB(red, green, blue) {
  return 'rgb(' + [red, green, blue].join(',') + ')';
}

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

  removeAllChildren("gameplay");

  // Adds rows
  for (var i = 0; i < GAMEPLAY_HEIGHT; i++) {
    createElementWithParentId("gameplay", "div", "row");
  }

  // Adds cells
  for (var i = 0; i < GAMEPLAY_WIDTH; i++) {
    createElementWithParentClass("row", "div", "cell");
  }
}

function setupColor(colorOffset) {
  var randomRed   = Math.floor(Math.random() * (256 - colorOffset)),
      randomGreen = Math.floor(Math.random() * (256 - colorOffset)),
      randomBlue  = Math.floor(Math.random() * (256 - colorOffset)),
      rgb = [randomRed, randomGreen, randomBlue];
  var randomColor = getRGB(rgb[0], rgb[1], rgb[2]);

  // Sets background color for all cells
  var cells = document.getElementsByClassName("cell");
  for (var i = 0; i < cells.length; i++) {
    cells[i].style.backgroundColor = randomColor;
  }
}

function setupUniqueCell(colorOffset) {
  var cells = document.getElementsByClassName("cell"),
      index = Math.floor(Math.random() * cells.length),
      color = cells[index].style.backgroundColor;

  function parsePrimaryColor(rgb) {
    var startIndex = rgb.indexOf('(') + 1,
        endIndex   = rgb.indexOf(')');
    var colorList  = rgb.substring(startIndex, endIndex);

    return colorList.split(',').map(function(value) {
      return parseInt(value);
    });
  }

  // Creates new color for unique cell
  var rgb = parsePrimaryColor(color);
  rgb[0] = Math.floor(rgb[0] + colorOffset);
  rgb[1] = Math.floor(rgb[1] + colorOffset);
  rgb[2] = Math.floor(rgb[2] + colorOffset);
  randomColor = getRGB(rgb[0], rgb[1], rgb[2]);
  
  cells[index].style.backgroundColor = randomColor;
  cells[index].addEventListener("click", function() {
    setupGameplay();
    incrementScore();
  });
}

function setupGameplay() {
  var colorOffset = generateColorDifference();

  setupGrid();
  setupColor(colorOffset);
  setupUniqueCell(colorOffset);
}

function setupEntrance() {
  document.getElementById("play-button").addEventListener("click", function() {
    var entrance = document.getElementById("entrance");
    entrance.className += " hidden";
  });
}

function main() {
  setupEntrance();
  setupGameplay();
}

main();