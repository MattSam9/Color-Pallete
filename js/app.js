// ?selection and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll(".sliders input");
const currentHex = document.querySelectorAll(".color h2");
const adjustmentBtn = document.querySelectorAll(".adjust");
const lockBtn = document.querySelector(".lock");

// @ Event Listener's
generateBtn.addEventListener("click", randomColors);

sliders.forEach(slide => {
  slide.addEventListener('input', hslControls);
});

colorDivs.forEach((div, index) => {
  div.addEventListener('change', () => {
    updateTextUi(index);
  });
});

// //functions
function generateHex() {
  let hex = chroma.random();
  return hex;
}

function randomColors() {
  colorDivs.forEach((div, index) => {
    const randomColor = generateHex();
    const hexText = div.children[0];
    const adj = div.querySelector('.adjust');
    const lock = div.querySelector('.lock');
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    // !change HexText contrast
    checkTextcontrast(randomColor, hexText);
    // !change adjust button and lock button contrast
    checkTextcontrast(randomColor, adj);
    checkTextcontrast(randomColor, lock);
    // !Initial Colorize Sliders
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSlider(color, hue, brightness, saturation);
  });
}

function colorizeSlider(color, hue, brightness, saturation) {
  // ?colorized saturation sliders
  const noSaturation = chroma(color).set("hsl.s", 0);
  const fullSaturation = chroma(color).set("hsl.s", 1);
  const scaleSaturation = chroma.scale([noSaturation, color, fullSaturation]);
  saturation.style.backgroundImage = `linear-gradient(to right,${scaleSaturation(
    0
  )},${scaleSaturation(1)})`;
  saturation.value = chroma(color).get('hsl.s');
  
  // //colorized brightness sliders
  const midBrightness = chroma(color).set("hsl.l", 0.5);
  const scaleBrightness = chroma.scale(["black", midBrightness, "white"]);
  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBrightness(
    0
    )},${scaleBrightness(0.5)},${scaleBrightness(1)})`;
  brightness.value = chroma(color).get('hsl.l');

  // @colorized hue sliders
  hue.style.backgroundImage = `linear-gradient(to right,rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
  hue.value = chroma(color).get('hsl.h');
}

randomColors();

function checkTextcontrast(color, obj) {
  const luminance = chroma(color).luminance();
  if (luminance < 0.5) {
    obj.style.color = "white";
  } else {
    obj.style.color = "black";
  }
}

function hslControls(event) {
  const index = event.target.getAttribute('data-hue') || event.target.getAttribute('data-bright') || event.target.getAttribute('data-sat');
  const bgColor = colorDivs[index].querySelector('h2').innerText;
  let sliders = event.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];
  let color = chroma(bgColor).set('hsl.h', hue.value).set('hsl.l', brightness.value).set('hsl.s', saturation.value);
  colorDivs[index].style.backgroundColor = color;
}

function updateTextUi(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector('h2');
  textHex.innerText = color.hex();
  const icons = activeDiv.querySelectorAll('.controls button');
  for (const icon of icons) {
    checkTextcontrast(color, icon);
  }
  checkTextcontrast(color, textHex);
}



