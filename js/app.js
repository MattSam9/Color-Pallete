// ?selection and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll(".sliders");
const currentHex = document.querySelectorAll(".color h2");
const adjustmentBtn = document.querySelectorAll(".adjust");
const lockBtn = document.querySelector(".lock");

// //functions
function generateHex() {
  let letter = "0123456789ABCDEF";
  let hash = "#";
  for (let i = 0; i < 6; i++) {
    hash += letter[Math.floor(Math.random() * 16)];
  }
  return hash;
}
function generateHex2() {
  let hex = chroma.random();
  return hex;
}

function randomColors() {
  colorDivs.forEach((div, index) => {
    const randomColor = generateHex2();
    const hexText = div.children[0];
    const adj = div.children[1].children[0];
    const lock = div.children[1].children[1];
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

  // //colorized brightness sliders
  const midBrightness = chroma(color).set("hsl.l", 0.5);
  const scaleBrightness = chroma.scale(["black", midBrightness, "white"]);
  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBrightness(
    0
  )},${scaleBrightness(0.5)},${scaleBrightness(1)})`;

  // @colorized hue sliders
  hue.style.backgroundImage = `linear-gradient(to right,rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
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

// @ Event Listener's
generateBtn.addEventListener("click", () => {
  randomColors();
});
