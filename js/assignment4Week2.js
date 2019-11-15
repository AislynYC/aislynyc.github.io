//Request 1: Click to Change Text.

var mainBanner = document.getElementById('main-banner');
var welcomeMsg = document.getElementById('welcome-msg');

function changeMsg() {
    welcomeMsg.innerHTML = 'Have a Good Time!';
}

mainBanner.addEventListener('click', changeMsg);

//Request 2: Click to Show/Close Menu.

var menuBtn = document.getElementById('main-menu-btn');
var navCard = document.getElementById('nav-card');
var menuCloseBtn = document.getElementById('menu-close-btn');

function openMenuCard() {
    navCard.style.display = 'block';
}

function closeMenuCard() {
    navCard.style.display = 'none';
}
menuBtn.addEventListener('click', openMenuCard);
menuCloseBtn.addEventListener('click', closeMenuCard);

//Request 3: Click to Show More Content Boxes.
var actionBtn = document.getElementById('action-btn');
var addRow = document.getElementById('additional-row');

function showAdditionalRow() {
    if (window.matchMedia("(min-width:500px)").matches) {
        addRow.style.display = 'flex';
    } else {
        addRow.style.display = 'block';
    }
}

actionBtn.addEventListener('click', showAdditionalRow);