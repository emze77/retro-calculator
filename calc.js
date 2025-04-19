const LED = {
    colors: ["out", "green", "red"],
    result: document.querySelectorAll(".ledResult"),
    firstOperator: document.querySelectorAll(".ledFirstOperator"),
    secondOperator: document.querySelectorAll(".ledSecondOperator"),
    get list() {
        return [this.result, this.firstOperator, this.secondOperator];
    }
}

const STATS = {
    inputFirstOperator: true,
    operator: null,
    resultMode: false,
    firstOperator: "",
    secondOperator: "",
    result: "",
    leds: [1, 1],
    waitingTimeout: null,
    prepareShow: false,
    waiting: true,
    waitingCounter: 0,
    waitingArray: [0, null , 0, null , 1, null, 1, null, 2, null, 2, null],
    waitingColor: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
}

const originalStats = structuredClone(STATS);
let waiting_STATS = {};

const DISPLAY = {
    firstOperator: document.querySelector("#firstOperatorDisplay"),
    secondOperator: document.querySelector("#secondOperatorDisplay"),
    result: document.querySelector("#resultDisplay"),
}



const ERROR = {
    toolong: "too long!",
    divide0: "Don't do this!"
}

const operatorButton = document.querySelectorAll(".operatorButton");

operatorButton.forEach(button =>
    button.addEventListener('click', () => setOperator(button.textContent)));
document.querySelectorAll(".numberButton").forEach(button => 
    button.addEventListener('click', () => appendNumber(button.textContent)));
document.querySelectorAll(".button").forEach(button =>
    button.addEventListener('click', () => waitingTimer()))

onClick ("#btnDot", () => appendNumber("."));
onClick ("#btnTakeOver", takeResultForFirstOp);
onClick ("#btnClear", clear);
onClick ("#btnDelete", deleteNumber);
onClick ("#btnAccept", handleAccept)


function operate () {
    calculate();
    convertResult();
    updateDisplay();
    resultDisplayOn(true);
}

function clear () {
    Object.assign(STATS, originalStats);
    toggleLed(1, 1);
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
    if (STATS.resultMode && !isNaN(Number(STATS.result))) {
        console.log(isNaN(Number(STATS.result)));
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
        if (STATS.firstOperator.length === 10) toggleLed(1, 2);
    }
    if (!STATS.inputFirstOperator && STATS.secondOperator.length < 10) {
        STATS.secondOperator += number;
        if (STATS.secondOperator.length === 10) toggleLed(2, 2);
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

function updateDisplay () {
    DISPLAY.firstOperator.textContent = STATS.firstOperator;
    DISPLAY.secondOperator.textContent = STATS.secondOperator;
    DISPLAY.result.textContent = STATS.result;
}

function toggleLed (number, color) {
    STATS.leds = [number, color];
    console.log("Stats.leds: " + STATS.leds)
    LED.list.forEach((item, index) =>  {
    if (index === number) {
        item.forEach((e) => e.classList.add(LED.colors[color]))
    } else {
        item.forEach((e) => e.classList.remove(LED.colors[0], LED.colors[1], LED.colors[2]))
    }})
}

function colorOperator (operator) {
    operatorButton.forEach((item) => {
        if (item.textContent === operator) {
            item.classList.add("highlightButton");
        } else {
            item.classList.remove("highlightButton");
        }
    })
}

// ==== WAITING =====

function waitingTimer () {
    if (!STATS.prepareShow) {
        STATS.prepareShow = true;
        waiting_STATS = structuredClone(STATS);
        console.table(waiting_STATS);
        console.log("timer läuft");
        STATS.waitingTimeout = setTimeout(waiting, 5000);
    } else {
        clearTimeout(STATS.waitingTimeout);
        STATS.prepareShow = false;
        waitingTimer();
    }
}

function waiting (numberCache, colorCache) {
    console.log("Waiting rennt! ")
    toggleLed(STATS.waitingArray[STATS.waitingCounter], 
        STATS.waitingColor[STATS.waitingCounter]);
    if (STATS.waitingCounter < STATS.waitingArray.length) {
        STATS.waitingCounter++;
        setTimeout(waiting, 500);
    } else {
        STATS.waitingCounter = 0;
        toggleLed(waiting_STATS.leds[0], waiting_STATS.leds[1]);
    };
}


// ==== HELPERS ====

function onClick (selector, handler) {
    const el = document.querySelector(selector);
    if (el) el.addEventListener('click', handler); 
}

function switchInputToFirstOp () {
    STATS.inputFirstOperator = true
    toggleLed(1, 1);
}

function switchInputToSecOp () {
    STATS.inputFirstOperator = false;
    toggleLed(2, 1);
}

function resultDisplayOn (state) {
    STATS.resultMode = state
    if (state) toggleLed(0, 1);
}

function throwErrow (error) {
    STATS.result = ERROR[error];
    toggleLed(0, 2)
    updateDisplay();
}
