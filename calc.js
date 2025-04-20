// === OBJECTS ===

const STATS = {
    inputFirstOperator: true,
    operator: null,
    resultMode: false,
    firstOperator: "",
    secondOperator: "",
    result: "",
    leds: [1, 1],
    blinkingPhase: false,
    waitingCounter: 0,
    blinkingArray: [],
}

const originalStats = structuredClone(STATS);

const TIMEOUTS = {
    waiting: undefined,
    impuls: undefined,
}

const LED = {
    colors: ["out", "green", "red"],
    result: document.querySelectorAll(".ledResult"),
    firstOperator: document.querySelectorAll(".ledFirstOperator"),
    secondOperator: document.querySelectorAll(".ledSecondOperator"),
    get list() {
        return [this.result, this.firstOperator, this.secondOperator];
    }
}

const DISPLAY = {
    firstOperator: document.querySelector("#firstOperatorDisplay"),
    secondOperator: document.querySelector("#secondOperatorDisplay"),
    result: document.querySelector("#resultDisplay"),
}

const ERROR = {
    toolong: "too long!",
    divide0: "Don't do this!"
}


// === BUTTONS, KEYS & PAGELOAD ===

const operatorButton = document.querySelectorAll(".operatorButton");

document.querySelectorAll(".button").forEach(button =>
    button.addEventListener('click', () => waitingTimer()))
operatorButton.forEach(button =>
    button.addEventListener('click', () => setOperator(button.textContent)));
document.querySelectorAll(".numberButton").forEach(button => 
    button.addEventListener('click', () => appendNumber(button.textContent)));

onClick ("#btnDot", () => appendNumber("."));
onClick ("#btnTakeOver", takeResultForFirstOp);
onClick ("#btnClear", clear);
onClick ("#btnDelete", deleteNumber);
onClick ("#btnAccept", handleAccept)

document.addEventListener('keydown', (el) => {
    if (!isNaN(el.key)) {
        appendNumber(el.key)
    } else if (el.key === "Enter") {
        handleAccept();
    } else if (["/", "*", "x", "+", "-"].includes(el.key)) {
        setOperator(el.key)    
    }
    waitingTimer();
    })

window.addEventListener('load', () => {
    switchInputToFirstOp ();
    waitingTimer();
})

// === LOGIC ===

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
    if (operator === "*") operator = "x";
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

// === WAITING-MODE ===

function waitingTimer () {
    if (STATS.blinkingPhase) {
        if (typeof TIMEOUTS.impuls === "number") 
            clearTimeout(TIMEOUTS.impuls);
        clearWaiting();
    }
    if (typeof TIMEOUTS.waiting === "number")
        clearTimeout(TIMEOUTS.waiting)
    TIMEOUTS.waiting = setTimeout(createBlinkTable, 10000);
}

function createBlinkTable () {
    STATS.blinkingArray = [];
    let twoTimes = false;
    for (i = 1; i <= 13; i++) {
        if (!(i % 2)) {
            STATS.blinkingArray.push([null, 0]);
        } else {
            STATS.blinkingArray.push([STATS.leds[0], STATS.leds[1]]);
            if (twoTimes) {
                STATS.leds[0]++;
                if (STATS.leds[0] === 3) STATS.leds[0] = 0;
                twoTimes = false;
            } else {
                twoTimes = true;
            }
        }
    }
    waiting();
}

function waiting () {
    STATS.blinkingPhase = true;
    toggleLed(
        STATS.blinkingArray[STATS.waitingCounter][0], 
        STATS.blinkingArray[STATS.waitingCounter][1]);
    if (STATS.waitingCounter < 12) {
        STATS.waitingCounter++;
        TIMEOUTS.impuls = setTimeout(waiting, 500);
    } else {
        if (typeof TIMEOUTS.impuls === "number") {
            clearTimeout(TIMEOUTS.impuls)}
        clearWaiting();
    }
}

function clearWaiting () {
    toggleLed(STATS.blinkingArray[0][0], STATS.blinkingArray[0][1]);
    STATS.waitingCounter = 0;
    STATS.blinkingArray = [];
    STATS.blinkingPhase = false;
    waitingTimer();
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
    if (state) toggleLed(0, [STATS.leds[1]]);
}

function throwErrow (error) {
    STATS.result = ERROR[error];
    toggleLed(0, 2)
    updateDisplay();
}
