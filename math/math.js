document.addEventListener('keydown', onKeyDown);
document.getElementById('buttons').addEventListener('click', onButtonClick);

let lastResult = 0;
let question = {};
let randomNumbers = [];
let history = [];

createQuestion();

function createQuestion() {
    question = {};
    question.number1 = lastResult === 0 ? getRandomNumber() : lastResult;
    question.number2 = getRandomNumber();
    question.operation = question.number2 >= question.number1 ? 0 : Math.floor(Math.random() * 2); // 0 = +, 1 = -
    question.expectedAnswer = question.operation === 0 ? question.number1 + question.number2 : question.number1 - question.number2;
    question.answer = '';
    showQuestion();
}

function getRandomNumber() {
    if (randomNumbers.length < 1)  {
        let start = (Math.floor((history.length + 1) / 10) * 10) + 1;
        for (let i = start; i < start + 9; i++) randomNumbers.push(i);
        shuffleArray(randomNumbers);
        randomNumbers.push(randomNumbers[0]);
    }
    return randomNumbers.pop();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showQuestion() {
    question.text = question.number1 + (question.operation === 0 ? ' + ' : ' - ') + question.number2 + ' = ';
    document.getElementById('question').innerHTML = question.text + question.answer;
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
    question.answer += value;
    showQuestion();
}

function deleteFromAnswer() {
    question.answer = question.answer.slice(0, -1);
    showQuestion();
}

function checkAnswer() {
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
    document.getElementById('mistakes').innerHTML = (new Date()).toLocaleDateString('en-US', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'}) + ', mistakes: ' + mistakes;
}
