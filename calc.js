/* script is inspired by michaelosman: 
https://github.com/michalosman/calculator/ */

const STATS = {
    inputFirstOperator: true,
    operator: null,
    resultMode: false,
    firstOperator: [],
    secondOperator: [],
    result: null,
    get arrays() {
        return [this.firstOperator, this.secondOperator]
    }
}

const DISPLAY = {
    firstOperator: document.querySelector("#firstOperatorDisplay"),
    secondOperator: document.querySelector("#secondOperatorDisplay"),
    result: document.querySelector("#resultDisplay"),
}

const LED = {
    result: document.querySelectorAll(".ledResult"),
    firstOperator: document.querySelectorAll(".ledFirstOperator"),
    secondOperator: document.querySelectorAll(".ledSecondOperator"),
    get list() {
        return [this.result, this.firstOperator, this.secondOperator];
    }
}

const BUTTONS = {
    numbers: document.querySelectorAll(".numberButton"),
    operators: document.querySelectorAll(".operatorButton"),
    dot: document.querySelector("#btnDot"),
    takeOver: document.querySelector("#btnTakeOver"),
    clear: document.querySelector("#btnClear"),
    delete: document.querySelector("#btnDelete"),
    accept: document.querySelector("#btnAccept"),
}

BUTTONS.dot.addEventListener('click', makeDot);
BUTTONS.takeOver.addEventListener('click', takeResultForFirstOp);
BUTTONS.clear.addEventListener('click', clear);
BUTTONS.delete.addEventListener('click', deleteNumber);
BUTTONS.accept.addEventListener('click', handleAccept)
BUTTONS.numbers.forEach(button => 
    button.addEventListener('click', () => appendNumber(button.textContent)))
BUTTONS.operators.forEach(button =>
    button.addEventListener('click', () => setOperator(button.textContent)))

// ---- logic ----

function clear () {
    resetOperators();
    updateDisplay();
    colorOperator(null);
    setOperator(null);
    resultDisplayOn(false);
    switchInputToFirstOp();
}

function handleAccept () {
    console.table(STATS);
    switch (true) {
        case (STATS.inputFirstOperator && STATS.firstOperator.length > 0):
            switchInputToSecOp();
            break;
        case (STATS.resultMode):
            clear();
            break;
        case (!STATS.inputFirstOperator && STATS.secondOperator.length > 0):
            operate();
            break;
    }
}

function appendNumber (number) {
    if (STATS.resultMode) clear();
    if (STATS.inputFirstOperator && STATS.firstOperator.length <= 10)
        STATS.firstOperator.push(number);
    if (!STATS.inputFirstOperator && STATS.firstOperator.length <= 10)
        STATS.secondOperator.push(number);
    updateDisplay();
}

function makeDot () {

}

let cache = toString(STATS.result).split("");
STATS.firstOperator = cache;
console.log("cachedOperator: " + STATS.firstOperator)


function takeResultForFirstOp () {
    if (STATS.resultMode) {
        let cache = STATS.result;
        clear();
        STATS.firstOperator = cache;
        updateDisplay();
        switchInputToSecOp;
        console.log("to the end!")
    }
}



function deleteNumber () {

}

function setOperator (operator) {
    STATS.operator = operator;
    colorOperator(operator);
    if (STATS.firstOperator.length > 0) switchInputToSecOp();
    if (STATS.secondOperator.length > 0) operate();
}

function toggleLed (number) {
    LED.list.forEach((item, index) =>  {
        if (index === number) {
            item.forEach((e) => e.classList.add("ledOn"))
        } else {
            item.forEach((e) => e.classList.remove("ledOn"))
        }
    })
}

function colorOperator (operator) {
    BUTTONS.operators.forEach((item) => {
        if (item.textContent === operator) {
            item.classList.add("highlightButton");
        } else {
            item.classList.remove("highlightButton");
        }
    }
)
}

function operate () {
    let a = Number(STATS.firstOperator.join(""));
    let b = Number(STATS.secondOperator.join(""));
    let res = 0;
    switch (STATS.operator) {
        case "+":
            res = a + b;
            break;
        case "-":
            res = a - b;
            break;
        case "/":
            res = a / b;
            break;
        case "x":
            res = a * b;
            break;
    }
    STATS.result = Array.from(String(res));
    console.log("STATS.result: " + STATS.result)
    // STATS.result = Number(res.toFixed(2))
    updateDisplay()
    resultDisplayOn(true);
}

function resetOperators () {
    STATS.arrays.forEach((e) => e.length = 0);
    STATS.result = null;
}

function updateDisplay () {
    DISPLAY.firstOperator.textContent = STATS.firstOperator.join("");
    DISPLAY.secondOperator.textContent = STATS.secondOperator.join("");
    DISPLAY.result.textContent = STATS.result;
}

function switchInputToFirstOp () {
    STATS.inputFirstOperator = true
    toggleLed(1);
}

function switchInputToSecOp () {
    STATS.inputFirstOperator = false;
    toggleLed(2);
}

function resultDisplayOn (state) {
    STATS.resultMode = state
    if (state) toggleLed(0);
}