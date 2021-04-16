// ?selection and variables
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders2 = document.querySelectorAll('.sliders input');
const currentHex = document.querySelectorAll('.color h2');

// //functions
function generateHex() {
    let letter = '0123456789ABCDEF';
    let hash = '#';
    for (let i = 0; i < 6; i++) {
        hash += letter[Math.floor(Math.random() * 16)];
    }
    return hash;
}

function randomColors() {
    colorDivs.forEach((div, index) => {
        const randomColor = generateHex();
        const hexText = div.children[0];
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
    });
}
randomColors();