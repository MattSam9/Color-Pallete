// ?Selection

const colorDivs = document.querySelectorAll(".color");
const hexview = document.querySelectorAll(".hex");
const adjustBtn = document.querySelectorAll(".adjust");
const lockBtn = document.querySelectorAll(".lock");
const sliderContainer = document.querySelectorAll(".slider");
const sliders = document.querySelectorAll(".slider input[type=range]");
const hueSliders = document.querySelectorAll(".hue-input");
const sliderCloseBtn = document.querySelectorAll(".slider .slider-close");
const libraryBtn = document.querySelector(".library-btn");
const generateBtn = document.querySelector(".generate-btn");
const saveBtn = document.querySelector(".save-btn");
const copyContainer = document.querySelector(".copy-container");
const copyPopup = document.querySelector(".copy-popup");
const libraryContainer = document.querySelector(".library-container");
const libraryPopup = document.querySelector(".library-popup");
const saveContainer = document.querySelector(".save-container");
const savePopup = document.querySelector(".save-popup");
const saveSubmit = document.querySelector(".save-submit");
const saveInput = document.querySelector("#save-name");
const closeSavePopup = document.querySelector(".closeSavePopup");
const closeLibraryPopup = document.querySelector(".closelibPopup");
const deleteLibItem = document.getElementsByClassName("delete-lib-item");
const selectLibItem = document.querySelectorAll(".select-lib-item");


let initialColors = [];
let savePaletteObjectArray = [];

// tip Event listener

document.addEventListener("DOMContentLoaded", () => {
  savePaletteObjectArray = checkLocalStorage();
  savePaletteObjectArray.forEach(palette => {
    createlibraryItems(palette);
  });
});

generateBtn.addEventListener("click",bgDivRandomColor);

sliders.forEach(slider => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div,index) =>{
  div.addEventListener("change", () =>{
    changeTextUI(index);
  });
});

hueSliders.forEach((slider,index) => {
  slider.addEventListener("input",() =>{
    const color = chroma(colorDivs[index].style.backgroundColor);
    const brightness = colorDivs[index].children[2].children[4];
    const saturation = colorDivs[index].children[2].children[6];
    updateSlidersColor(color,brightness,saturation);
  });
});

hueSliders.forEach((slider,index) => {
  slider.addEventListener("change",() =>{
    const color = chroma(colorDivs[index].style.backgroundColor);
    initialColors.splice(index,1,color.hex());
  });
});

hexview.forEach((hex,index) =>{
  hex.addEventListener("click",() =>{
    copyToClipBoard(index);
  });
});

copyPopup.addEventListener("transitionend",()=>{
  copyContainer.classList.remove("active");
  copyPopup.classList.remove("active");
});

adjustBtn.forEach((btn,index) => {
  btn.addEventListener("click", () => {
    sliderContainer[index].classList.toggle("active");
  });
});

sliderCloseBtn.forEach((btn,index) => {
  btn.addEventListener("click", () => {
    sliderContainer[index].classList.remove("active");
  });
});

lockBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    if(btn.classList.contains("locked")){
      btn.classList.remove("locked");
      btn.innerHTML = '<i class="fas fa-lock-open fa-xl"></i>';
    } else {
      btn.classList.add("locked");
      btn.innerHTML = '<i class="fas fa-lock fa-xl"></i>';
    }
  });
});

libraryBtn.addEventListener("click",() => {
  libraryContainer.classList.add("active");
  libraryPopup.classList.add("active");
  const savePaletteObjectArray = checkLocalStorage();
  if (savePaletteObjectArray.length === 0) {
    libraryPopup.children[1].innerText = "Your color palette is empty!";
  }
});

closeLibraryPopup.addEventListener("click", () => {
  libraryContainer.classList.remove("active");
  libraryPopup.classList.remove("active");
});

saveBtn.addEventListener("click",() => {
  saveContainer.classList.add("active");
  savePopup.classList.add("active");
  saveInput.focus();
});

closeSavePopup.addEventListener("click", () => {
  saveContainer.classList.remove("active");
  savePopup.classList.remove("active");
});

saveSubmit.addEventListener("click", (event) => {
  savePalette(event);
});

saveInput.addEventListener("keyup",(event) => {
  if(event.keyCode === 13) savePalette(event);
});




// // Function

function generateRandomColor() {
  const hexColor = chroma.random();
  return hexColor;
}

function bgDivRandomColor() {
  initialColors = [];
  for(const div of colorDivs) {
    const lockBtn = div.children[1].children[1];
    const divHex = div.children[0];
    const randomColor = generateRandomColor();
    if(lockBtn.classList.contains("locked")) {
      initialColors.push(divHex.innerText);
      continue;
    }else{
      initialColors.push(randomColor.hex());
    }
    const adjustBtn = div.children[1].children[0];
    div.style.backgroundColor = randomColor;
    divHex.innerText = randomColor;
    checkItemContrast(randomColor, divHex);
    checkItemContrast(randomColor, adjustBtn);
    checkItemContrast(randomColor, lockBtn);
    const sliders = div.querySelectorAll(".slider input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSlider(randomColor, hue, brightness, saturation);
  }
  resetSlidersInput();
} 


function checkItemContrast(color,item){
  const luminance = chroma(color).luminance();
  if(luminance > 0.4){
    item.style.color = "Black";
  } else {
    item.style.color = "white";
  }
}

function colorizeSlider(color, hueSlider, brightnessSlider, saturationSlider){
  const noSat = chroma(color).set("hsl.s",0);
  const fullSat = chroma(color).set("hsl.s",1);
  const saturationScale = chroma.scale([noSat,color,fullSat]);
  saturationSlider.style.backgroundImage = `linear-gradient(to right,${saturationScale(0)},${saturationScale(1)})`;

  const midBrightness = chroma(color).set("hsl.l",0.5);
  const brightnessScale = chroma.scale(["#000",midBrightness,"#fff"]);
  brightnessSlider.style.backgroundImage = `linear-gradient(to right,${brightnessScale(0)},${brightnessScale(0.5)},${brightnessScale(1)})`;

  const hueSpectrum = chroma.scale(["rgb(204,75,75)","rgb(204,204,75)","rgb(75,204,75)","rgb(75,204,204)","rgb(75,75,204)","rgb(204,75,204)","rgb(204,75,75)"]);

 hueSlider.style.backgroundImage = `linear-gradient(to right,${hueSpectrum(0)},${hueSpectrum(0.1)},${hueSpectrum(0.2)},${hueSpectrum(0.3)},${hueSpectrum(0.4)},${hueSpectrum(0.5)},${hueSpectrum(0.6)},${hueSpectrum(0.7)},${hueSpectrum(0.8)},${hueSpectrum(0.9)},${hueSpectrum(1)})`;

}

function hslControls(event){
  let index = event.target.getAttribute("data-hue") || event.target.getAttribute("data-bright") || event.target.getAttribute("data-sat");
  const slider = event.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = slider[0];
  const brightness = slider[1];
  const saturation = slider[2];
  const color = chroma(initialColors[index]).set("hsl.h",hue.value).set("hsl.l",brightness.value).set("hsl.s", saturation.value);
  colorDivs[index].style.backgroundColor = color;
  colorDivs[index].children[0].innerText = color;
  initialColors[index].splice(index,1,color);
  updateSlidersColor(color,brightness,saturation);
}

function changeTextUI(index){
  const div = colorDivs[index];
  const color = chroma(div.style.backgroundColor);
  const hexText = div.children[0];
  const adjustBtn = div.children[1].children[0];
  const lockBtn = div.children[1].children[1];
  checkItemContrast(color,hexText);
  checkItemContrast(color,adjustBtn);
  checkItemContrast(color,lockBtn);
}

function resetSlidersInput(){
  sliders.forEach(slider => {
    if (slider.name === "hue-input"){
      const index = slider.getAttribute("data-hue");
      const color = chroma(initialColors[index]);
      const hueValue = color.hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "sat-input"){
      const index = slider.getAttribute("data-sat");
      const color = chroma(initialColors[index]);
      const saturationValue = color.hsl()[1];
      slider.value = Math.floor(saturationValue * 100) /100;
    }
    if (slider.name === "bright-input"){
      const index = slider.getAttribute("data-bright");
      const color = chroma(initialColors[index]);
      const brightValue = color.hsl()[2];
      slider.value = Math.floor(brightValue * 100) /100;
    }
  });
}
function updateSlidersColor(color, brightnessSlider, saturationSlider){
    const noSat = chroma(color).set("hsl.s",0);
    const fullSat = chroma(color).set("hsl.s",1);
    const saturationScale = chroma.scale([noSat,color,fullSat]);
    saturationSlider.style.backgroundImage = `linear-gradient(to right,${saturationScale(0)},${saturationScale(1)})`;
  
    const midBrightness = chroma(color).set("hsl.l",0.5);
    const brightnessScale = chroma.scale(["#000",midBrightness,"#fff"]);
    brightnessSlider.style.backgroundImage = `linear-gradient(to right,${brightnessScale(0)},${brightnessScale(0.5)},${brightnessScale(1)})`;  
}

function copyToClipBoard(index){
  const color = initialColors[index];
  const textArea = document.createElement("textarea");
  const popupText = copyPopup.children[0];
  popupText.innerText = color;
  popupText.style.color = color;
  textArea.value = color;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
  copyContainer.classList.add("active");
  copyPopup.classList.add("active");
}

function savePalette(event){
  const localStoragePalette = checkLocalStorage();
  saveContainer.classList.remove("active");
  savePopup.classList.remove("active");
  let name;
  if(saveInput.value === ""){
    name = `palette ${localStoragePalette.length+1}`;
  }else{
    name = saveInput.value;
  }
  saveInput.value = "";
  const colors = [];
  for(let color of initialColors) {
    colors.push(color);
  }
  const paletteNumber = cuid();
  const saveObj = {name,colors, number: paletteNumber};
  savePaletteObjectArray.push(saveObj); 
  saveToLocal(saveObj);
  createlibraryItems(saveObj);
}

function checkLocalStorage(arrayNameInStorage = "palette"){
  let localPalette = [];
  if (localStorage.getItem(arrayNameInStorage) === null) {
    localPalette = [];
  } else {
    localPalette = JSON.parse(localStorage.getItem(arrayNameInStorage));
  }
  return localPalette;
}

function saveToLocal(paletteObject){
  const storagePalette = checkLocalStorage();
  storagePalette.push(paletteObject);
  localStorage.setItem("palette", JSON.stringify(storagePalette));
}

function createlibraryItems(paletteObject){
  const paletteContainer = document.createElement("div");
  const colorsContainer = document.createElement("div");
  const name = document.createElement("h5");
  const selectPalette = document.createElement("button");
  const deletePalette = document.createElement("button");

  paletteContainer.classList.add("lib-palette-container");
  paletteContainer.setAttribute("paletteNr", paletteObject.number);
  name.innerText = paletteObject.name;
  name.title = "Palette name";
  paletteContainer.appendChild(name);
  colorsContainer.classList.add("lib-color-container");
  const colorDiv = [];
  for (let i = 0; i < 5; i++) {
    colorDiv[i] = document.createElement("div");
    colorDiv[i].classList.add("lib-color-div");
    colorDiv[i].style.backgroundColor = paletteObject.colors[i];
    colorsContainer.appendChild(colorDiv[i]);
  }
  paletteContainer.appendChild(colorsContainer);
  paletteContainer.title = "palette";

  selectPalette.innerHTML = `<i class="fas fa-square-check fa-2x enactive"></i>`;
  selectPalette.classList.add("select-lib-item");
  selectPalette.title = "Select Palette";
  selectPalette.addEventListener("click", () => {
    const paletteCUID = selectPalette.parentElement.getAttribute("paletteNr");
    showPaletteOnScreen(paletteCUID);
  });

  deletePalette.innerHTML = `<i class="fas fa-trash-alt fa-2x"></i>`;
  deletePalette.classList.add("delete-lib-item");
  deletePalette.title = "Delete Palette";
  deletePalette.addEventListener("click", () => {
    const paletteCUID = deletePalette.parentElement.getAttribute("paletteNr");
    deletePaletteFromStorage(paletteCUID);
  });

  paletteContainer.appendChild(selectPalette);
  paletteContainer.appendChild(deletePalette);
  libraryPopup.appendChild(paletteContainer);
  libraryPopup.children[1].innerText = "Pick your color palette";
}

function deletePaletteFromStorage(paletteCUID){
  savePaletteObjectArray = checkLocalStorage();
  if(savePaletteObjectArray.length === 0) return;
  let index = null;
  savePaletteObjectArray.forEach((item,i) => {
      if (item.number === paletteCUID){
        index = i;
      }
  });
  savePaletteObjectArray.splice(index,1);
  if (savePaletteObjectArray.length === 0) {
    localStorage.clear();
  } else {
    localStorage.setItem("palette", JSON.stringify(savePaletteObjectArray));
  }
  const paletteContainers = document.querySelectorAll(".lib-palette-container");
  paletteContainers.forEach(container => {
    const paletteNumber = container.getAttribute("paletteNr");
    if(paletteNumber === paletteCUID) {
      libraryPopup.removeChild(container);
      return;
    }
  });
  if(savePaletteObjectArray.length === 0){
    libraryContainer.classList.remove("active");
    libraryPopup.classList.remove("active");
  }
}

function showPaletteOnScreen(paletteCUID){
  const savePaletteObjectArray = checkLocalStorage();
  let storageIndex = null;
  savePaletteObjectArray.forEach((item,i) => {
      if (item.number === paletteCUID){
        storageIndex = i;
      }
  });
  initialColors = [];
  for(const div of colorDivs) {
    const index = div.getAttribute("div-num");
    const lockBtn = div.children[1].children[1];
    const divHex = div.children[0];
    const randomColor = savePaletteObjectArray[storageIndex].colors[index];
    if(lockBtn.classList.contains("locked")) {
      initialColors.push(divHex.innerText);
      continue;
    }else{
      initialColors.push(randomColor);
    }
    const adjustBtn = div.children[1].children[0];
    div.style.backgroundColor = randomColor;
    divHex.innerText = randomColor;
    checkItemContrast(randomColor, divHex);
    checkItemContrast(randomColor, adjustBtn);
    checkItemContrast(randomColor, lockBtn);
    const sliders = div.querySelectorAll(".slider input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSlider(randomColor, hue, brightness, saturation);
  }
  resetSlidersInput();
}

bgDivRandomColor();