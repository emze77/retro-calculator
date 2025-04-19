const STATS = {
    inputFirstOperator: true,
    operator: null,
    resultMode: false,
    firstOperator: "",
    secondOperator: "",
    result: "",
    ledNum: [1, "green"],
}

const originalStats = structuredClone(STATS);

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

const ERROR = {
    toolong: "too long!",
    divide0: "Don't do this!"
}

// === BUTTON CONSTROL ===

const operatorButton = document.querySelectorAll(".operatorButton");

operatorButton.forEach(button =>
    button.addEventListener('click', () => setOperator(button.textContent)));
document.querySelectorAll(".numberButton").forEach(button => 
    button.addEventListener('click', () => appendNumber(button.textContent)));
    
onClick ("#btnDot", () => appendNumber("."));
onClick ("#btnTakeOver", takeResultForFirstOp);
onClick ("#btnClear", clear);
onClick ("#btnDelete", deleteNumber);
onClick ("#btnAccept", handleAccept)


// === PURE LOGIC ===

function operate () {
    calculate();
    convertResult();
    updateDisplay();
    resultDisplayOn(true);
}


// === BUTTON FUNCTIONS ===


function clear () {
    Object.assign(STATS, originalStats);
    toggleLed(1, "green");
    colorOperator();
    updateDisplay();
}

function handleAccept () {
    if (STATS.inputFirstOperator && STATS.firstOperator.length > 0) {
        switchInputToSecOp();
    } else if (STATS.resultMode) {
        takeResultForFirstOp();
    } else if (STATS.secondOperator === "0" && STATS.operator === "/"){
        throwErrow("divide0");
        updateDisplay();
    } else if (!STATS.inputFirstOperator && STATS.secondOperator.length > 0) {
        operate();
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
    if (STATS.inputFirstOperator && STATS.firstOperator.length < 10) {
        STATS.firstOperator += number;
        if (STATS.firstOperator.length === 10) toggleLed(1, "red");
    }
    if (!STATS.inputFirstOperator && STATS.secondOperator.length < 10) {
        STATS.secondOperator += number;
        if (STATS.secondOperator.length === 10) toggleLed(2, "red");
    }
    updateDisplay();
}

function setOperator (operator) {
    STATS.operator = operator;
    colorOperator(operator);
    if (STATS.firstOperator.length > 0) switchInputToSecOp();
    if (STATS.secondOperator === "0" && STATS.operator === "/") {
        throwErrow("divide0");
    } else if (STATS.secondOperator.length > 0) {
        operate();
    }
   
}

function deleteNumber () {
    if (STATS.inputFirstOperator)
        STATS.firstOperator = STATS.firstOperator.slice(0, -1); 
    if (!STATS.inputFirstOperator);
        STATS.secondOperator = STATS.secondOperator.slice(0, -1); 
    updateDisplay();
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

function convertResult () {
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

function toggleLed (number, color) {
    LED.state = [number, color];
    if (color === "red") {
        LED.list.forEach((item, index) =>  {
            if (index === number) {
                item.forEach((e) => e.classList.add("ledRed"))
            } else {
                item.forEach((e) => e.classList.remove("ledGreen", "ledRed"))
            }
        })
    } else {
        console.log("green-led: " + LED.state)
        LED.list.forEach((item, index) =>  {
            if (index === number) {
                item.forEach((e) => e.classList.add("ledGreen"))
            } else {
                item.forEach((e) => e.classList.remove("ledGreen", "ledRed"))
            }
    })}
}

function colorOperator (operator) {
    operatorButton.forEach((item) => {
        if (item.textContent === operator) {
            item.classList.add("highlightButton");
        } else {
            item.classList.remove("highlightButton");
        }
    }
)}


// === HELPERS ===

function onClick (selector, handler) {
    const el = document.querySelector(selector);
    if (el) el.addEventListener('click', handler); 
}

function switchInputToFirstOp () {
    STATS.inputFirstOperator = true
    toggleLed(1, "green");
}

function switchInputToSecOp () {
    STATS.inputFirstOperator = false;
    toggleLed(2, "green");
}

function resultDisplayOn (state) {
    STATS.resultMode = state
    if (state) toggleLed(0, "green");
}

function throwErrow (error) {
    STATS.result = ERROR[error];
    toggleLed(0, "red")
    updateDisplay();
}
