document.addEventListener('keydown', onKeyDown);
document.getElementById('buttons').addEventListener('click', onButtonClick);

let state = {};
loadState();
createQuestion();

function createQuestion() {
    state.question = {};
    state.question.number1 = state.lastResult === 0 ? getRandomNumber() : state.lastResult;
    state.question.number2 = getRandomNumber();
    state.question.operation = state.question.number2 >= state.question.number1 ? 0 : Math.floor(Math.random() * 2); // 0 = +, 1 = -
    state.question.expectedAnswer = state.question.operation === 0 ? state.question.number1 + state.question.number2 : state.question.number1 - state.question.number2;
    state.question.answer = '';
    showQuestion();
}

function getRandomNumber() {
    if (state.randomNumbers.length < 1)  {
        let start = (Math.floor((state.history.length + 1) / 10) * 10) + 1;
        for (let i = start; i < start + 9; i++) state.randomNumbers.push(i);
        shuffleArray(state.randomNumbers);
        state.randomNumbers.push(state.randomNumbers[0]);
    }
    return state.randomNumbers.pop();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showQuestion() {
    state.question.text = state.question.number1 + (state.question.operation === 0 ? ' + ' : ' - ') + state.question.number2 + ' = ';
    document.getElementById('question').innerHTML = state.question.text + state.question.answer;
}

function onButtonClick(event) {
    let target = findTargetWithAction(event.target);
    if (target)
    {
        target.classList = 'button-clicked';
        setTimeout(function() { target.classList = 'button'; }, 300);
        performAction(target.getAttribute('action'));
    }
}

function findTargetWithAction(target) {
    if (target) {
        return target.getAttribute('action') ? target : findTargetWithAction(target.parentElement);
    }
    return target;
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
    state.question.answer += value;
    showQuestion();
}

function deleteFromAnswer() {
    state.question.answer = state.question.answer.slice(0, -1);
    showQuestion();
}

function checkAnswer() {
    state.lastResult = state.question.expectedAnswer;
    putQuestionInHistory();
    showHistory();
    createQuestion();
}

function putQuestionInHistory() {
    state.history.unshift(state.question);
    state.historyDate = (new Date()).toLocaleDateString('en-US', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    saveState();
}

function showHistory() {
    let mistakes = 0;
    let innerHtml = '<ol reversed>';
    for (let i = 0; i < state.history.length; i++) {
        if (state.history[i].expectedAnswer === parseInt(state.history[i].answer)) {
            innerHtml += '<li>' + state.history[i].text + state.history[i].answer + '</li>';
        } else {
            innerHtml += '<li class="wrong">' + state.history[i].text + state.history[i].expectedAnswer + ' (&ne; ' + state.history[i].answer + ')</li>';
            mistakes++;
        }
    }
    innerHtml += '</ol>';
    document.getElementById('history').innerHTML = innerHtml;
    document.getElementById('mistakes').innerHTML = state.historyDate + ', mistakes: ' + mistakes;
    createHistoryButtons();
}

function createHistoryButtons() {
    let container = document.getElementById('history-buttons');
    if (!container.innerHTML) {
        let div = document.createElement('div');
        container.appendChild(div);
        div.classList = 'button';
        div.innerHTML = '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';
        div.addEventListener('click', function() { 
            resetState();
            createQuestion();
        });
    } 
}

function saveState() {
    if (state) localStorage.setItem('math', JSON.stringify(state));
    else localStorage.removeItem('math');
}

function loadState() {
    let savedState = localStorage.getItem('math');
    if (savedState) {
        state = JSON.parse(savedState);
        createQuestion();
        showHistory();
    }
    else {
        resetState();
    }
}

function resetState() {
    state = {
        lastResult: 0,
        question: {},
        randomNumbers: [],
        history: []
    }
    document.getElementById('mistakes').innerHTML = '';
    document.getElementById('history').innerHTML = '';
    document.getElementById('history-buttons').innerHTML = '';
}
