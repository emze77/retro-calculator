/* script is inspired by michaelosman: 
https://github.com/michalosman/calculator/ */

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

const STATS = {
    inputFirstOperator: true,
    operator: "",
}

BUTTONS.dot.addEventListener('click', makeDot);
BUTTONS.takeOver.addEventListener('click', takeOverResult);
BUTTONS.clear.addEventListener('click', clear);
BUTTONS.delete.addEventListener('click', deleteNumber);
BUTTONS.accept.addEventListener('click', handleAccept)

BUTTONS.numbers.forEach(button => 
    button.addEventListener('click', () => appendNumber(button.textContent))
)

BUTTONS.operators.forEach(button =>
    button.addEventListener('click', () => setOperator(button.textContent))
)

toggleLed(1);

function appendNumber (number) {
    if (STATS.inputFirstOperator) {
        DISPLAY.firstOperator.textContent += number;
    } else {
        DISPLAY.secondOperator.textContent += number;
    }
}

function makeDot () {

}

function takeOverResult () {

}

function handleAccept () {

}

function clear () {
    DISPLAY.firstOperator.textContent = "";
    DISPLAY.secondOperator.textContent = "";
    DISPLAY.result.textContent = "";
    STATS.inputFirstOperator = true
    colorOperator(null);
    toggleLed(1);
}

function deleteNumber () {

}

function setOperator (operator) {
    STATS.operator = operator;
    colorOperator(operator);
    if (DISPLAY.firstOperator.textContent.length > 0) {
        STATS.inputFirstOperator = false;
        toggleLed(2);
    }
    if (DISPLAY.secondOperator.textContent.length > 0) operate();
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

}