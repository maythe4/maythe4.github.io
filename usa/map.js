let correct = 0;
let expectedAnswer = '';
let allPaths = [];
let paths = [];
let wrong = 0;

window.onload = function() {
    initializePaths();
    normalizeStates();
    showScore();

    switch(window.location.search) {
        case '?short':
            initializeShortName();
            break;
        case '?location':
            initializeLocation();
            break;
        default:
            initializeFullName();
    }
}

function evaluateAnswer(answer) {
    if (answer === expectedAnswer) {
        correct++;
        hide('error');
    } else {
        wrong++;
        paths.push(paths[0]);
        showError('Correct is ' + expectedAnswer + ', not ' + answer);
    }
    paths.shift();
    showScore();
}

function hide(id) {
    document.getElementById(id).classList = 'invisible';
}

function highlightState(id) {
    document.getElementById(id).classList = 'highlight';
}

function initializeFullName() {
    setQuestionText('full name');
    let answer = document.getElementById('answer');
    answer.addEventListener('keypress', event => {
        if (event.code === 'Enter') {
            evaluateAnswer(answer.value);
            if (paths && paths.length > 0) {
                playFullName();
            }
            else {
                hide('question');
                save('full');
            }
        }
    });
    playFullName();
}

function initializeShortName() {
    setQuestionText('short name');
    let answer = document.getElementById('answer');
    answer.addEventListener('keypress', event => {
        if (event.code === 'Enter') {
            evaluateAnswer(answer.value.toLowerCase());
            if (paths && paths.length > 0) {
                playShortName();
            }
            else {
                hide('question');
                save('short');
            }
        }
    });
    playShortName();
}

function initializeLocation() {
    hide('answer');
    for (let path of paths) {
        path.addEventListener("mouseover", event => highlightState(event.target.id));
        path.addEventListener("mouseout", _ => normalizeStates());
        path.addEventListener("click", event => {
            evaluateAnswer(event.target.id);
            if (paths && paths.length > 0) {
                playLocation();
            }
            else {
                hide('question');
                save('location');
            }
        });
    }
    playLocation();
}

function initializePaths() {
    paths = [];
    for (let path of document.getElementsByTagName('path')) {
        if (path.hasAttribute('fullname')) {
            paths.push(path);
        }
    }
    shuffleArray(paths);
    allPaths = [...paths];
}

function normalizeStates() {
    for (path of allPaths) {
        path.classList = 'state';
    }
}

function playFullName() {
    normalizeStates();
    highlightState(paths[0].id);
    expectedAnswer = paths[0].getAttribute('fullname');
    document.getElementById('answer').value = '';
}

function playShortName() {
    normalizeStates();
    highlightState(paths[0].id);
    expectedAnswer = paths[0].id.toLowerCase();
    document.getElementById('answer').value = '';
}

function playLocation() {
    expectedAnswer = paths[0].id;
    setQuestionText('Where is ' + paths[0].getAttribute('fullname') + '?');
}

function save(mode) {
    let usa = JSON.parse(localStorage.getItem('usa')) || {};    
    usa[mode] = (new Date()).toJSON().slice(0, 10);
    localStorage.setItem('usa', JSON.stringify(usa));
}

function setQuestionText(text) {
    document.getElementById('question-text').innerHTML = text;
}

function showError(text) {
    let div = document.getElementById('error');
    div.innerHTML = text;
    div.classList = 'elements-row wrong';
}

function showScore() {
    document.getElementById('correct').innerHTML = 'correct: ' + correct;
    document.getElementById('wrong').innerHTML = 'wrong: ' + wrong;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
