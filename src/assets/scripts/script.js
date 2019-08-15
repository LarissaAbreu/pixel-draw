const settings = document.getElementById('settings');
const cardSettings = document.getElementById('modalSettings');
const cancelSettings = document.getElementById('cancelSettings');
const saveSettings = document.getElementById('saveSettings');

const inputColor = document.getElementById('inputColor');
const nameColor = document.getElementById('inputNameColor');
const buttonAddColor = document.getElementById('addColor');

const colorList = document.getElementById('listColor');

const colorCurrent = document.getElementById('currentColor');

const inputSize = document.getElementById('size');
const inputRows = document.getElementById('rows');
const inputColumns = document.getElementById('columns');

const grid = document.getElementById('grid');

let currentColor;
let totalPixel = 0;

const gridConfigs = {
  pixelSize: 0,
  rows: 0,
  columns: 0,
};

const customProperties = {};

const generateCode = document.getElementById('generateCode');
const htmlBox = document.getElementById('codeHtml');
const cssBox = document.getElementById('codeCss');

const createGrid = () => {
  grid.style = `--size: ${inputSize.value}px; --row: ${inputRows.value}; --column: ${inputColumns.value};`;

  totalPixel = inputRows.value * inputColumns.value;

  grid.innerHTML = '';

  for (let index = 0; index < totalPixel; index++) {
    const pixel = document.createElement('div');

    pixel.addEventListener('click', (e) => {
      const array = Object.keys(customProperties);

      array.forEach(key => {
        if (customProperties[key] == currentColor) {
          e.target.style = `--color: var(--${key}, ${currentColor});`;
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

createGrid();

settings.addEventListener('click', () => {
  cardSettings.hasAttribute('style')
  ? cardSettings.removeAttribute('style')
  : cardSettings.style.display = 'block';
});

function closeCardSettings() {cardSettings.removeAttribute('style')};

cancelSettings.addEventListener('click', closeCardSettings);

saveSettings.addEventListener('click', () => {
  closeCardSettings();
  createGrid();
  htmlBox.value = '';
  cssBox.value= '';
});

buttonAddColor.addEventListener('click', () => {
  const li = document.createElement('li');
  li.classList.add('listColor__item');
  li.currentColor = inputColor.value;
  li.addEventListener('click', () => {
    currentColor = li.currentColor;
    colorCurrent.style = `--item-color: ${currentColor}`;
  });

  const span = document.createElement('span');
  const spanText = document.createTextNode(nameColor.value);
  span.classList.add('listColor__item__nameColor');
  span.style = `--item-color: ${inputColor.value};`;
  span.appendChild(spanText);

  li.appendChild(span);

  colorList.appendChild(li);

  const nameColorNormalize = nameColor.value.toLowerCase().replace(/\s/g, '');

  customProperties[nameColorNormalize] = li.currentColor;

  nameColor.value = '';
});

currentColor
? colorCurrent.style.display = 'block'
: colorCurrent.style.display = 'none'

const generateHTML = () => {
  let allDivs = '';

  const pixels = document.querySelectorAll('.pixel');
  pixels.forEach(element => {
    allDivs = allDivs + '\t' + element.outerHTML + '\n';
  });

  htmlBox.value = `<div class="grid">\n${allDivs}</div>`;
};

const generateCSS = () => {
  const array = Object.keys(customProperties);

  let variables = '';

  array.forEach(key => {
    variables = `${variables}--${key}: ${customProperties[key]};\n\t`;
  });

  cssBox.value = `.grid {\n\t${variables}display: inline-grid;\n\tgrid-template-rows: repeat(${gridConfigs.rows}, ${gridConfigs.pixelSize}px);\n\tgrid-template-columns: repeat(${gridConfigs.columns}, ${gridConfigs.pixelSize}px);\n}\n\n.pixel {\n\tbackground-color: var(--color);\n}`;
};

generateCode.addEventListener('click', () => {
  generateHTML();
  generateCSS();
});

const copyToClipboard = (el) => {
  el.select();
  document.execCommand('copy');
};

const copyHTML = document.getElementById('copyHTML');
copyHTML.addEventListener('click', () => copyToClipboard(htmlBox));

const copyCSS = document.getElementById('copyCSS');
copyCSS.addEventListener('click', () => copyToClipboard(cssBox));
