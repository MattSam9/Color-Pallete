// ?selection and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll(".sliders input");
const currentHex = document.querySelectorAll(".color h2");
const adjustmentBtn = document.querySelectorAll(".adjust");
const lockBtn = document.querySelector(".lock");
const copyHexBtn = document.querySelectorAll(".color h2");
const copyClipboard = document.querySelector(".copy-container");
const copyPopup = document.querySelector(".copy-popup");
let initialColors;

// @ Event Listener's
generateBtn.addEventListener("click", randomColors);

sliders.forEach((slide) => {
  slide.addEventListener("input", hslControls);
});

copyHexBtn.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    copyToClipboard(index);
  });
});

copyPopup.addEventListener("transitionend", () => {
  copyClipboard.classList.remove("active");
  copyPopup.classList.remove("active");
});

// //functions
function generateHex() {
  let hex = chroma.random();
  return hex;
}

function randomColors() {
  initialColors = [];
  colorDivs.forEach((div) => {
    const randomColor = generateHex().hex();
    initialColors.push(randomColor);
    const hexText = div.children[0];
    const adj = div.querySelector(".adjust");
    const lock = div.querySelector(".lock");
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
  fixInputsValue();
}
randomColors();

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

function checkTextcontrast(color, obj) {
  const luminance = chroma(color).luminance();
  if (luminance < 0.5) {
    obj.style.color = "white";
  } else {
    obj.style.color = "black";
  }
}

function hslControls(event) {
  const index =
    event.target.getAttribute("data-hue") ||
    event.target.getAttribute("data-bright") ||
    event.target.getAttribute("data-sat");
  let sliders = event.target.parentElement.querySelectorAll(
    'input[type="range"]'
  );
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];
  const bgColor = initialColors[index];
  const color = chroma(bgColor)
    .set("hsl.h", hue.value)
    .set("hsl.l", brightness.value)
    .set("hsl.s", saturation.value);
  colorDivs[index].style.backgroundColor = color;

  // !upate text UI
  const activeDiv = colorDivs[index];
  const hexText = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  hexText.innerText = color.hex();
  checkTextcontrast(color, hexText);
  for (const icon of icons) {
    checkTextcontrast(color, icon);
  }

  // *update slider background color
  colorizeSlider(color, hue, brightness, saturation);
}

function fixInputsValue() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const index = slider.getAttribute("data-hue");
      const color = initialColors[index];
      slider.value = Math.floor(chroma(color).hsl()[0]);
    }
    if (slider.name === "brightness") {
      const index = slider.getAttribute("data-bright");
      const color = initialColors[index];
      slider.value = Math.floor(chroma(color).hsl()[2] * 100) / 100;
    }
    if (slider.name === "saturation") {
      const index = slider.getAttribute("data-sat");
      const color = initialColors[index];
      slider.value = Math.floor(chroma(color).hsl()[1] * 100) / 100;
    }
  });
}

function copyToClipboard(index) {
  const box = document.createElement("textarea");
  const colorHex = chroma(colorDivs[index].style.backgroundColor).hex();
  box.value = colorHex;
  document.body.appendChild(box);
  box.select();
  document.execCommand("copy");
  document.body.removeChild(box);
  copyClipboard.classList.add("active");
  copyPopup.classList.add("active");
}
