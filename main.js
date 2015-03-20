var GAMEPLAY_WIDTH = 10,
    GAMEPLAY_HEIGHT = 10,
    COLOR_DIFFERENCE = 25;

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

function setupColor() {
  var randomRed   = Math.floor(Math.random() * (256 - COLOR_DIFFERENCE)),
      randomGreen = Math.floor(Math.random() * (256 - COLOR_DIFFERENCE)),
      randomBlue  = Math.floor(Math.random() * (256 - COLOR_DIFFERENCE)),
      rgb = [randomRed, randomGreen, randomBlue];
  var randomColor = getRGB(rgb[0], rgb[1], rgb[2]);

  // Sets background color for all cells
  var cells = document.getElementsByClassName("cell");
  for (var i = 0; i < cells.length; i++) {
    cells[i].style.backgroundColor = randomColor;
  }
}

function setupUniqueCell() {
  var cells = document.getElementsByClassName("cell"),
      index = Math.floor(Math.random() * cells.length),
      color = cells[index].style.backgroundColor;

  function parsePrimaryColor(rgb) {
    var startIndex = rgb.indexOf('(') + 1,
        endIndex   = rgb.indexOf(')');
    var colorList  = rgb.substring(startIndex, endIndex);
    return colorList.split(',');
  }

  // Creates new color for unique cell
  var rgb   = parsePrimaryColor(color);
  rgb[0] = parseInt(rgb[0]) + COLOR_DIFFERENCE;
  rgb[1] = parseInt(rgb[1]) + COLOR_DIFFERENCE;
  rgb[2] = parseInt(rgb[2]) + COLOR_DIFFERENCE;
  randomColor = getRGB(rgb[0], rgb[1], rgb[2]);

  cells[index].style.backgroundColor = randomColor;
  cells[index].addEventListener("click", function() {
    setupGameplay();
  });
}

function setupGameplay() {
  setupGrid();
  setupColor();
  setupUniqueCell();
}

function main() {
  setupGameplay();
}

main();