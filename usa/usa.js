window.onload = function() {
    let container = document.getElementById('items-container');
    for (let item of createItems()) {
        container.appendChild(item);
    }
}

function createItems() {
    let items = [];
    let usa = JSON.parse(localStorage.getItem('usa')) || getDefaultSettings();
    const nomap = createItem('full state names without map', 'nomap.html', usa.nomap);
    const full = createItem('full state names', 'map.html?full', usa.full);
    const short = createItem('short state names', 'map.html?short', usa.short);
    const location = createItem('state locations', 'map.html?location', usa.location);
    items.push(full);
    if (usa && usa.short < usa.full) {
        items.unshift(short);
    } else {
        items.push(short);
    }
    if (usa && usa.location < usa.short) {
        items.unshift(location);
    } else {
        items.push(location);
    }
    if (usa && usa.nomap === (new Date()).toJSON().slice(0, 10))
    {
        items.push(nomap);
    } else {
        items.unshift(nomap);
    }
    return items;
}

function createItem(title, href, last) {
    let item = document.createElement('div');
    item.classList = 'item';
    
    let h2 = document.createElement('h2');
    item.appendChild(h2);

    let a = document.createElement('a');
    h2.appendChild(a);
    a.href = href;
    a.innerHTML = title;

    let p = document.createElement('p');
    item.appendChild(p);
    p.innerHTML = 'last: ' + last;
    
    return item;
}

function getDefaultSettings() {
    let usa = {};
    usa.nomap = usa.full = usa.short = usa.location = '-';
    localStorage.setItem('usa', JSON.stringify(usa));
    return usa;
}
