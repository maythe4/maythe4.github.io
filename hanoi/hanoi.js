let tower1 = [9, 8, 7, 6, 5, 4, 3, 2, 1];
let tower2 = [];
let tower3 = [];
const towers = [tower1, tower2, tower3];

createTowers();

function createTowers() {
    let container = document.getElementById('container');
    container.innerHTML = '';
    container.appendChild(createTower(1));
    container.appendChild(createTower(2));
    container.appendChild(createTower(3));
}

function createTower(nr) {
    let div = document.createElement('div');
    div.classList = "tower";
    div.appendChild(createPlates(nr));
    div.appendChild(createButtons(nr));
    return div;
}

function createPlates(nr) {
    let div = document.createElement('div');
    div.classList = 'plates';
    towers[nr - 1].forEach(el => div.appendChild(createPlate(el)));
    return div;
}

function createPlate(size) {
    let width = size * 20;
    let div = document.createElement('div');
    div.classList = 'plate';
    div.setAttribute('style', 'width:' + width + 'px');
    return div;
}

function createButtons(nr) {
    let div = document.createElement('div');
    div.classList = 'buttons';
    div.appendChild(createButton(nr, 1));
    div.appendChild(createButton(nr, 2));
    div.appendChild(createButton(nr, 3));
    return div;
}

function createButton(towerNr, buttonNr) {
    let inactive = document.createElement('div');
    inactive.classList = 'button inactive-button';
    inactive.innerHTML = buttonNr;

    let source = towers[towerNr - 1];
    let destination = towers[buttonNr - 1];

    if (towerNr === buttonNr) return inactive;
    if (source.length < 1) return inactive;
    if (destination.length >= 1) {
        let destinationTop = destination[destination.length - 1];
        let sourceTop = source[source.length - 1];
        if (sourceTop > destinationTop) {
            return inactive;
        }
    }
    
    let newButton = document.createElement('div');
    newButton.id = 'button_' + towerNr + '_' + buttonNr;
    newButton.classList = 'button active-button';
    newButton.innerHTML = buttonNr;
    newButton.onclick = function() {
        destination.push(source.pop());
        createTowers();
    };
    return newButton;
}