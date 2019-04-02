const inputSize = document.getElementById('size');
const inputRows = document.getElementById('row');
const inputColumns = document.getElementById('column');
const buttonSave = document.getElementById('save');

const inputColor = document.getElementById('color');
const nameColor = document.getElementById('nameColor');
const buttonSaveColor = document.getElementById('saveColor');
const colorList = document.getElementById('listColor');

const colorCurrent = document.getElementById('currentColor');

const generateCode = document.getElementById('generate');

const htmlBox = document.getElementById('htmlCode');
const cssBox = document.getElementById('cssCode');

const grid = document.getElementById('grid');

let currentColor;
let totalPixel = 0;

const gridConfigs = {
  pixelSize: 0,
  rows: 0,
  columns: 0,
};

const customProperties = {}

buttonSaveColor.addEventListener('click', () => {
  const li = document.createElement('li');
  li.classList.add('item');
  li.style = `--item-color: ${inputColor.value};`;
  li.currentColor = inputColor.value;
  li.addEventListener('click', () => {
    currentColor = li.currentColor;
    colorCurrent.style = `--item-color: ${currentColor}`;
  });

  const span = document.createElement('span');
  const spanText = document.createTextNode(nameColor.value);
  span.appendChild(spanText);

  const button = document.createElement('button');
  const buttonText = document.createTextNode('Remove color');
  button.appendChild(buttonText);

  button.addEventListener('click', (e) => {
    li.remove();
		currentColor = '';
		console.log(currentColor);
    // colorCurrent.style = `--item-color: none;`;
  });

  li.appendChild(span);
  li.appendChild(button);

  colorList.appendChild(li);

  const nameColorNormalize = nameColor.value.toLowerCase().replace(/\s/g,'');

  customProperties[nameColorNormalize] = li.currentColor;
});

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
          e.target.style = `--color: var(--${key}, ${currentColor})`;
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

buttonSave.addEventListener('click', createGrid);

createGrid();

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
    variables = `${variables}--${key}: ${customProperties[key]};\n`;
  });

  cssBox.value = `.grid {\n\t${variables}\tdisplay: inline-grid;\n\tgrid-template-rows: repeat(${gridConfigs.rows}, ${gridConfigs.pixelSize}px);\n\tgrid-template-columns: repeat(${gridConfigs.columns}, ${gridConfigs.pixelSize}px);\n}
  
  .pixel {\n\tbackground-color: var(--color);\n}`;
};

generateCode.addEventListener('click', () => {
  generateHTML();
  generateCSS();
});
