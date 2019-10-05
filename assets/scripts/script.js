'use strict';

var settings = document.getElementById('settings');
var cardSettings = document.getElementById('modalSettings');
var cancelSettings = document.getElementById('cancelSettings');
var saveSettings = document.getElementById('saveSettings');

var inputColor = document.getElementById('inputColor');
var nameColor = document.getElementById('inputNameColor');
var buttonAddColor = document.getElementById('addColor');

var btnRemoveAll = document.getElementById('removeAllColors');

var colorList = document.getElementById('listColor');

var colorCurrent = document.getElementById('currentColor');

var inputSize = document.getElementById('size');
var inputRows = document.getElementById('rows');
var inputColumns = document.getElementById('columns');

var grid = document.getElementById('grid');

var currentColor = void 0;
var totalPixel = 0;

// Define default grid configs
var gridConfigs = {
  pixelSize: 0,
  rows: 0,
  columns: 0
};

var customProperties = {};

var generateCode = document.getElementById('generateCode');
var htmlBox = document.getElementById('codeHtml');
var cssBox = document.getElementById('codeCss');

// Create grid based in configs
var createGrid = function createGrid() {
  grid.style = '--size: ' + inputSize.value + 'px; --row: ' + inputRows.value + '; --column: ' + inputColumns.value + ';';

  totalPixel = inputRows.value * inputColumns.value;

  grid.innerHTML = '';

  // Create all grid layout divs
  for (var index = 0; index < totalPixel; index++) {
    var pixel = document.createElement('div');

    // Add a individual click in grid divs
    pixel.addEventListener('click', function (e) {
      var array = Object.keys(customProperties);

      // Insert current color in clicked div
      array.forEach(function (key) {
        if (customProperties[key] == currentColor) {
          e.target.style = '--color: var(--' + key + ', ' + currentColor + ');';
        };
      });
    });

    pixel.classList.add('pixel');

    grid.appendChild(pixel);
  };

  gridConfigs.pixelSize = inputSize.value;
  gridConfigs.rows = inputRows.value;
  gridConfigs.columns = inputColumns.value;
};

// Verify if has 0 or 1 color in palette and show or remove button "Remove all colors"
var hasCollor = function hasCollor() {
  var colorPalette = document.querySelectorAll('.listColor__item');

  colorPalette.length <= 1 ? btnRemoveAll.style.display = 'none' : btnRemoveAll.style.display = 'block';
};

createGrid();
hasCollor();

// Configure box of grid settings
settings.addEventListener('click', function () {
  cardSettings.hasAttribute('style') ? cardSettings.removeAttribute('style') : cardSettings.style.display = 'block';
});

function closeCardSettings() {
  cardSettings.removeAttribute('style');
};

cancelSettings.addEventListener('click', closeCardSettings);

saveSettings.addEventListener('click', function () {
  closeCardSettings();
  createGrid();
  htmlBox.value = '';
  cssBox.value = '';
});

// Clear all grid divs
var buttonClear = document.getElementById('clear');
buttonClear.addEventListener('click', function () {
  createGrid();
  htmlBox.value = '';
  cssBox.value = '';
});

var nameColorNormalize = function nameColorNormalize(color) {
  return color.toLowerCase().replace(/\s/g, '');
};

buttonAddColor.addEventListener('click', function () {

  // Create a li element
  var li = document.createElement('li');
  li.classList.add('listColor__item');

  // Create a div element
  var div = document.createElement('div');
  div.classList.add('listColor__item__div');
  div.setAttribute('title', 'Select color');

  // When click in div add color to current color
  div.currentColor = inputColor.value;
  div.addEventListener('click', function () {
    currentColor = div.currentColor;
    colorCurrent.style = '--item-color: ' + currentColor;
  });

  // Create a span with name color and a before element with the color
  var span = document.createElement('span');
  var spanText = void 0;

  // Add name color in Custom Properties list
  if (nameColor.value) {
    spanText = document.createTextNode(nameColor.value);
    span.appendChild(spanText);
    customProperties[nameColorNormalize(nameColor.value)] = div.currentColor;
    nameColor.value = '';
  } else {
    // Case user don't declarate a name for color
    var formatColor = function formatColor(color) {
      return color.substr(1);
    };
    var color = inputColor.value;
    var url = 'https://api.color.pizza/v1/' + formatColor(color);

    fetch(url).then(function (resp) {
      return resp.json();
    }).then(function (data) {
      spanText = document.createTextNode(data.colors[0].name);
      span.appendChild(spanText);
      customProperties[nameColorNormalize(data.colors[0].name)] = div.currentColor;
    }).catch(function (err) {
      return console.log(err);
    });
  };
  span.classList.add('listColor__item__nameColor');
  span.style = '--item-color: ' + inputColor.value + ';';

  // Create a remove color button
  var button = document.createElement('button');
  button.setAttribute('title', 'Remove color');
  button.classList.add('listColor__item__removeColor__button');

  // Create a remove color icon and add to remove color button
  var icon = document.createElement('img');
  icon.classList.add('listColor__item__icon');
  icon.setAttribute('src', '../icons/delete.svg');
  button.appendChild(icon);

  div.appendChild(span);

  li.appendChild(div);
  li.appendChild(button);

  // Add and remove hover style on item
  div.addEventListener('mouseover', function (e) {
    return e.target.closest('li').classList.add('hover__item');
  });

  div.addEventListener('mouseout', function (e) {
    return e.target.closest('li').classList.remove('hover__item');
  });

  // Remove color from palette
  button.addEventListener('click', function (e) {
    var ul = e.target.closest('ul');
    var li = e.target.closest('li');

    ul.removeChild(li);
    hasCollor();
  });

  colorList.appendChild(li);
  hasCollor();
});

// Button remove all colors
btnRemoveAll.addEventListener('click', function () {
  while (colorList.hasChildNodes()) {
    colorList.removeChild(colorList.firstChild);
  };
  hasCollor();
});

// Show or remove "current color" span
currentColor ? colorCurrent.style.display = 'block' : colorCurrent.style.display = 'none';

// Generate the HTML code
var generateHTML = function generateHTML() {
  var allDivs = '';

  var pixels = document.querySelectorAll('.pixel');
  pixels.forEach(function (element) {
    allDivs = allDivs + '\t' + element.outerHTML + '\n';
  });

  htmlBox.value = '<div class="grid">\n' + allDivs + '</div>';
};

// Gerenate the CSS code
var generateCSS = function generateCSS() {
  var array = Object.keys(customProperties);

  var variables = '';

  array.forEach(function (key) {
    variables = variables + '--' + key + ': ' + customProperties[key] + ';\n\t';
  });

  cssBox.value = '.grid {\n\t' + variables + 'display: inline-grid;\n\tgrid-template-rows: repeat(' + gridConfigs.rows + ', ' + gridConfigs.pixelSize + 'px);\n\tgrid-template-columns: repeat(' + gridConfigs.columns + ', ' + gridConfigs.pixelSize + 'px);\n}\n\n.pixel {\n\tbackground-color: var(--color);\n}';
};

generateCode.addEventListener('click', function () {
  generateHTML();
  generateCSS();
});

// Copy to clipboard button
var copyToClipboard = function copyToClipboard(el) {
  el.select();
  document.execCommand('copy');
};

var copyHTML = document.getElementById('copyHTML');
copyHTML.addEventListener('click', function () {
  return copyToClipboard(htmlBox);
});

var copyCSS = document.getElementById('copyCSS');
copyCSS.addEventListener('click', function () {
  return copyToClipboard(cssBox);
});