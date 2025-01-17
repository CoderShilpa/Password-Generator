const inputslider = document.querySelector("[data-lengthslider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generator = document.querySelector(".passwordgenerator");
const allCheckBoxes = document.querySelectorAll("input[type=checkbox]");

const symbols = "~!@#$%^&*()_+{}|:<>?,;/";

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
// Set strength circle color to gray initially
setIndicator("#ccc");

function handleSlider() {
    inputslider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputslider.min;
    const max = inputslider.max;
    const value = (passwordLength - min) * 100 / (max - min);
    inputslider.style.background = `linear-gradient(to right, #9400D3 ${value}%, #4A0069 ${value}%)`;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 10).toString();
}

function generateLowercase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUppercase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbols() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength<= 8) {
        setIndicator("green"); // Strong password
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength <=14) {
        setIndicator("yellow"); // Medium strength password
    } else {
        setIndicator("red"); // Weak password
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (err) {
        console.error('Failed to copy: ', err);
        copyMsg.innerText = "Failed to copy";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array.join('');
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBoxes.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputslider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

generator.addEventListener('click', () => {
    if (checkCount <= 0) return;

    password = "";
    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUppercase);
    }

    if (lowercaseCheck.checked) {
        funcArr.push(generateLowercase);
    }

    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }

    if (symbolsCheck.checked) {
        funcArr.push(generateSymbols);
    }

    // Ensure that at least one character from each selected type is included
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Fill the rest of the password length with random characters from selected types
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    passwordDisplay.style.color = "red"; // Set password color to red
    calcStrength();
});

copyBtn.addEventListener('click', copyContent);
