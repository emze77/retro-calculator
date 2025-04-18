const STATS = {
    inputFirstOperator: true,
    operator: null,
    resultMode: false,
    firstOperator: "",
    secondOperator: "",
    result: "",
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
    // numbers: document.querySelectorAll(".numberButton"),
    operators: document.querySelectorAll(".operatorButton"),
    dot: document.querySelector("#btnDot"),
    takeOver: document.querySelector("#btnTakeOver"),
    clear: document.querySelector("#btnClear"),
    delete: document.querySelector("#btnDelete"),
    accept: document.querySelector("#btnAccept"),
}

document.querySelectorAll(".numberButton").forEach(button => 
    button.addEventListener('click', () => appendNumber(button.textContent)));

const ERROR = {
    toolong: "too long!",
    divide0: "Don't do this!"
}

BUTTONS.takeOver.addEventListener('click', takeResultForFirstOp);
BUTTONS.clear.addEventListener('click', clear);
BUTTONS.delete.addEventListener('click', deleteNumber);
BUTTONS.accept.addEventListener('click', handleAccept);
// BUTTONS.numbers.forEach(button => 
//     button.addEventListener('click', () => appendNumber(button.textContent)));
BUTTONS.dot.addEventListener('click', () => appendNumber("."));
BUTTONS.operators.forEach(button =>
    button.addEventListener('click', () => setOperator(button.textContent)));

// === PURE LOGIC ===

function clear () {
    resetOperators();
    updateDisplay();
    colorOperator(null);
    setOperator(null);
    resultDisplayOn(false);
    switchInputToFirstOp();
    resetErrorMode();
}

function operate () {
    calculate();
    convertResult();
    updateDisplay();
    resultDisplayOn(true);
}


// === BUTTON FUNCTIONS ===

function handleAccept () {
    switch (true) {
        case (STATS.inputFirstOperator && STATS.firstOperator.length > 0):
            switchInputToSecOp();
            break;
        case (STATS.resultMode):
            takeResultForFirstOp();
            break;
        case (!STATS.inputFirstOperator && STATS.secondOperator.length > 0):
            operate();
            break;
    }
}

function takeResultForFirstOp () {
    if (STATS.resultMode) {
        let cache = STATS.result;
        clear();
        STATS.firstOperator = cache;
        updateDisplay();
        switchInputToSecOp();
    }
}

function appendNumber (number) {
    if (STATS.resultMode) clear();
    if (STATS.inputFirstOperator && STATS.firstOperator.length <= 10)
        STATS.firstOperator += number;
    if (!STATS.inputFirstOperator && STATS.secondOperator.length <= 10)
        STATS.secondOperator += number;
    updateDisplay();
}

function setOperator (operator) {
    STATS.operator = operator;
    colorOperator(operator);
    if (STATS.firstOperator.length > 0) switchInputToSecOp();
    if (STATS.secondOperator.length > 0) operate();
}

function deleteNumber () {

}

// ==== MATHY STUFF ===

function calculate () {
    let a = Number(STATS.firstOperator);
    let b = Number(STATS.secondOperator);
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
    STATS.result = res;
}

function convertResult (res) {
    STATS.result = Number((STATS.result).toFixed(2)).toString();
    if (STATS.result.length <= 10) {
        STATS.result = STATS.result;
    } else {
        throwErrow("toolong");
    }
}



// ==== DISPLAY ====

function updateDisplay () {
    DISPLAY.firstOperator.textContent = STATS.firstOperator;
    DISPLAY.secondOperator.textContent = STATS.secondOperator;
    DISPLAY.result.textContent = STATS.result;
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


// === SMALL HELPERS ===

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

function throwErrow (error) {
    STATS.errorMode = true;
    STATS.result = ERROR[error]
}

function resetErrorMode () {
    STATS.errorMode = false;
}

function resetOperators () {
    STATS.result = "";
    STATS.firstOperator = "";
    STATS.secondOperator = "";
}