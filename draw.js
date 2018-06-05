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

let currentColor = '#000';
let totalPixel = 0;

const gridConfigs = {
  pixelSize: 0,
  rows: 0,
  columns: 0,
};

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

  li.appendChild(span);
  li.appendChild(button);

  colorList.appendChild(li);
});

const createGrid = () => {
  grid.style = `--size: ${inputSize.value}px; --row: ${inputRows.value}; --column: ${inputColumns.value};`;
  totalPixel = inputRows.value * inputColumns.value;

  grid.innerHTML = '';

  for (let index = 0; index < totalPixel; index++) {
    const pixel = document.createElement('div');

    pixel.addEventListener('click', (e) => {
      e.target.style = `--color: ${currentColor}`;
    })
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
  cssBox.value = `.grid {
    display: inline-grid;
    grid-template-rows: repeat(${gridConfigs.rows}, ${gridConfigs.pixelSize}px);
    grid-template-columns: repeat(${gridConfigs.columns}, ${gridConfigs.pixelSize}px);
  }
  
  .pixel {
    background-color: var(--color);
  }`;
};

generateCode.addEventListener('click', () => {
  generateHTML();
  generateCSS();
});
