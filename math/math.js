document.addEventListener('keydown', onKeyDown);
document.getElementById('buttons').addEventListener('click', onButtonClick);

let lastResult = 0;
let question = {};
let answer = '?';
let history = [];

createQuestion();

function createQuestion() {
    question = {};
    question.number1 = lastResult === 0 ? getRandomNumber() : lastResult;
    question.number2 = getRandomNumber();
    question.operation = question.number2 >= question.number1 ? 0 : Math.floor(Math.random() * 2); // 0 = +, 1 = -
    question.expectedAnswer = question.operation === 0 ? question.number1 + question.number2 : question.number1 - question.number2;
    answer = '?';
    showQuestion();
}

function getRandomNumber() {
    let extra = (Math.floor(history.length / 10) * 10) + 1;
    return Math.floor(Math.random() * 9) + extra;
}

function showQuestion() {
    question.text = question.number1 + (question.operation === 0 ? ' + ' : ' - ') + question.number2 + ' = ';
    document.getElementById('question').innerHTML = question.text;
    document.getElementById('answer').innerHTML = answer;
}

function onButtonClick(event) {
    event.target.classList = 'button-clicked';
    setTimeout(function() { event.target.classList = 'button'; }, 300);
    performAction(event.target.getAttribute('action'));
}

function onKeyDown(event) {
    switch(event.key) {
        case 'Enter':
        case '=':
            performAction('ok');
            break;
        case 'Backspace':
        case 'Delete':
            performAction('delete');
            break;
        default:
            performAction(event.key);
    }
}

function performAction(action) {
    switch(action) {
        case 'ok':
            checkAnswer();
            break;
        case 'delete':
            deleteFromAnswer();
            break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            addToAnswer(action);
            break;
    }
}

function addToAnswer(value) {
    if (answer === '?') {
        if (value !== '0') {
            answer = value;
        }
    } else {
        answer += value;
    }
    document.getElementById('answer').innerHTML = answer;
}

function deleteFromAnswer() {
    answer = answer.length <= 1 ? '?' : answer.slice(0, -1);
    document.getElementById('answer').innerHTML = answer;
}

function checkAnswer() {
    question.answer = answer;
    lastResult = question.expectedAnswer;
    putQuestionInHistory();
    createQuestion();
}

function putQuestionInHistory() {
    history.unshift(question);
    let mistakes = 0;
    let innerHtml = '<ol reversed>';
    for (let i = 0; i < history.length; i++) {
        if (history[i].expectedAnswer === parseInt(history[i].answer)) {
            innerHtml += '<li>' + history[i].text + history[i].answer + '</li>';
        } else {
            innerHtml += '<li class="wrong">' + history[i].text + history[i].expectedAnswer + ' (&ne; ' + history[i].answer + ')</li>';
            mistakes++;
        }
    }
    innerHtml += '</ol>';
    document.getElementById('history').innerHTML = innerHtml;
    document.getElementById('mistakes').innerHTML = 'Mistakes: ' + mistakes;
}
