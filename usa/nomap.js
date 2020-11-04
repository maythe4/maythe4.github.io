document.addEventListener('keydown', focusUserInput);
document.getElementById('start').addEventListener('click', start);
document.getElementById('start').focus();

const inputId = 'user-input-box';
const expected = ['Alabama', 'Alaska']; /*, 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];*/
let inputs = [];
let seconds = 0;
let timerInterval;

function start() {
    document.getElementById('control').innerHTML = '<div id="timer">0:00</div>';
    document.getElementById('user-input').innerHTML = '<input id="' + inputId + '" class="input">';
    document.getElementById(inputId).addEventListener('keydown', handleUserInput);
    document.getElementById(inputId).focus();
    timerInterval = setInterval(refreshTimer, 1000);
}

function refreshTimer() {
    seconds++;
    let text = Math.floor(seconds / 60) + ':';
    if (seconds % 60 < 10) {
        text += '0';
    }
    text += seconds % 60;
    document.getElementById('timer').innerHTML = text;
    if (seconds >= 360) {
        finish();
    }
}

function handleUserInput(event) {
    event.stopPropagation();
    var text = event.target.value;
    if (event.key == 'Enter' && text) {
        setError('');
        if (expected.includes(text)) {
            if (inputs.includes(text)) {
                setError(text + ' ist doppelt');
            }
            else {
                inputs.push(text);
                inputs.sort();
                showInputs();
                if (inputs.length >= expected.length) {
                    finish();
                }
            }
        }
        else {
            setError(text + ' ist falsch');
        }
        event.target.value = '';
    }
}

function focusUserInput(event) {
    event.stopPropagation();
    if (event.key == 'i') {
        document.getElementById(inputId).focus();
        event.preventDefault();
    }
}

function setError(error) {
    let innerHtml = error ? '<div class="error">' + error + '</div>' : '';
    document.getElementById('error').innerHTML = innerHtml;
}

function showInputs() {
    let ul = '<ol>';
    inputs.forEach(el => ul += '<li>' + el + '</li>');
    ul += '</ol>';
    document.getElementById('output').innerHTML = ul;
}

function showMissing() {
    let ul = '<ol>';
    expected.forEach(el => ul += '<li' + (inputs.includes(el) ? '' : ' class="missing"') + '>' + el + '</li>');
    ul += '</ol>';
    document.getElementById('output').innerHTML = ul;
}

function finish() {
    clearInterval(timerInterval);
    document.getElementById('user-input').innerHTML = '';
    showMissing();
    save('nomap');
}

function save(mode) {
    let usa = JSON.parse(localStorage.getItem('usa')) || {};    
    usa[mode] = (new Date()).toJSON().slice(0, 10);
    localStorage.setItem('usa', JSON.stringify(usa));
}
