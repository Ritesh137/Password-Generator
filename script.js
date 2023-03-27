const passwordDisplay = document.querySelector('.passwordDisplay');
const copyButton = document.querySelector('.copybtn');
const copymsg = document.querySelector('.tooltip');

const inputslider = document.querySelector('.length-slider');
const lengthnumber = document.querySelector('.length-number');
const uppercase = document.querySelector('#uppercase');
const lowercase = document.querySelector('#lowercase');
const symbolsCheck = document.querySelector('#symbols');
const numbersCheck = document.querySelector('#numbers');
const indicator = document.querySelector('.indicator');
const generatebutton = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initial
let password = "";
let passwordlength = 10;
let checkCount = 0;
handleSlider();
setIndicator('#ccc');

function handleSlider(){
    inputslider.value = passwordlength;
    lengthnumber.innerText = passwordlength;
    
}

function setIndicator(color){
    indicator.style.backgroundColor = color;

}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function genRandomNumber(){
    return getRndInteger(0, 9);
}

function genLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function genUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function genSymbols(){
    const symb = getRndInteger(0, symbols.length);
    return symbols.charAt(symb);
}

function calcstrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercase.checked) hasUpper = true;
    if (lowercase.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
      setIndicator("#0f0");
    } 
    else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordlength >= 6
    ) {
      setIndicator("#ff0");
    } 
    else {
      setIndicator("#f00");
    }
}

async function copypassword(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copymsg.innerText = "Copied";
    }
    catch(e){
        copymsg.innerText = "failed";
    }

    copymsg.classList.add("active");

    setTimeout( () => {
        copymsg.classList.remove("active");
    },2000);
    
}

function shuffle(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;    
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBox(){
    checkCount = 0;
    allCheckBox.forEach( (checkBox) =>{
        if(checkBox.checked)
        checkCount++;
    });

    if(passwordlength < checkCount ) {
        passwordlength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkBox) =>{
    checkBox.addEventListener('change', handleCheckBox)
});


inputslider.addEventListener('input', (evnt) => {
    passwordlength = evnt.target.value;
    handleSlider();
});

copyButton.addEventListener('click', () => {
    if(passwordDisplay.value){
        copypassword();
    }
    else{
       alert("Empty Password");
       copypassword();
    }
});

generatebutton.addEventListener('click', () => {

    if(checkCount == 0){
        return alert("Please tick atleast one checkbox");
    }
    

    if(passwordlength < checkCount){
    passwordlength = checkCount;
    handleSlider();
    }

    console.log("Start");

    password = "";

    let funcArr = [];

    if(uppercase.checked){
        funcArr.push(genUpperCase)
    }

    if(lowercase.checked){
        funcArr.push(genLowerCase)
    }

    if(numbersCheck.checked){
        funcArr.push(genRandomNumber)
    }

    if(symbolsCheck.checked){
        funcArr.push(genSymbols)
    }

    //compulsory
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("Comp");

    //remaining
    for(let i=0; i<passwordlength-funcArr.length; i++){
        let remaining = getRndInteger(0, funcArr.length);
        console.log("remaining" + remaining);
        password += funcArr[remaining]();
    }

    console.log("Remain");

    password = shuffle(Array.from(password));
    console.log("Shuffle");

    passwordDisplay.value = password;
    console.log("UI");
    calcstrength();

});