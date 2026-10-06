let toggleAIvsHuman = true;
let toggleAIlearning = true;
let info_tgl = false;
let startingNum = 11;
let btns = document.querySelectorAll(`[id^="btn2"]`);
let selections = document.querySelectorAll(`[id^="select"]`);

let human1 = new Player('Žmogus');
let human2 = new Player('Žmogus.2');
let AI1 = new AI('nim.AI', 'lp', 'n');
let AI2 = new AI('nim.AI.2', 'lp', 'p');

let player1 = AI1;
let player2 = human1;

let nim = new Game(startingNum, player1, player2);

function AIplayer() {
    toggleAIvsHuman = !toggleAIvsHuman;
    document.getElementById('enableAI2').removeEventListener('go', player2.go);
    btns.forEach((b) => {
        b.removeEventListener('click', player2.choiceMade);
    });
    if(toggleAIvsHuman){
        document.getElementById('AI_toggle').innerHTML = `<span>Įjungta</span>`;
        player2 = human1;
    } else {
        document.getElementById('AI_toggle').innerHTML = `<span>Išjungta</span>`;
        player2 = AI2;
    }
    nim.player2 = player2;
    start();    
}

function AIlearning() {
    toggleAIlearning = !toggleAIlearning;
    if(toggleAIlearning){
        document.getElementById('AI_toggle_learning').innerHTML = `<span>Įjungta</span>`;
    } else {
        document.getElementById('AI_toggle_learning').innerHTML = `<span>Išjungta</span>`;
    }
}

function moreinfo() {
    document.getElementsByName('info_item').forEach((el) => {
        el.classList.toggle('hidden');
        el.classList.toggle('info');
    });
}

function makeStates() {
    let states1 = document.getElementById('states1');
    for(let i = 2; i < startingNum+1; ++i){
        let box = document.createElement('div');
        box.classList.add('box');
        let namebox = document.createElement('div');
        let boxbox = document.createElement('div');
        namebox.id = `name1_${i}`;
        boxbox.id = `box1_${i}`;
        box.appendChild(namebox);
        box.appendChild(boxbox);
        states1.appendChild(box);
    }

    let states2 = document.getElementById('states2');
    for(let i = 2; i < startingNum+1; ++i){
        let box = document.createElement('div');
        box.classList.add('box');
        let namebox = document.createElement('div');
        let boxbox = document.createElement('div');
        namebox.id = `name2_${i}`;
        boxbox.id = `box2_${i}`;
        box.appendChild(namebox);
        box.appendChild(boxbox);
        states2.appendChild(box);
    }
}

let start = () => {
    nim.resetGame();
    nim.active = false;
    document.getElementById('player_1').innerHTML = player1.name+":";
    nim.player1_wins = 0;
    nim.player2_wins = 0;
    document.getElementById('player1_wins').innerHTML = 0;
    document.getElementById('player2_wins').innerHTML = 0;

    document.getElementById('player_2').innerHTML = player2.name+":";
    if (player1 instanceof AI) {
        document.getElementById('enableAI1').addEventListener('go', player1.go);
        document.getElementById('moves1').style.pointerEvents = 'none';
        document.getElementById('states1').style.display = 'flex';
        document.getElementById('ai1').innerHTML = `${player1.name} būsenos`;
    } else {
        document.getElementById('moves1').style.pointerEvents = 'auto';
        document.getElementById('states1').style.display = 'none';
        document.getElementById('ai1').innerHTML = ``;
    }
    if (player2 instanceof AI) {
        document.getElementById('enableAI2').addEventListener('go', player2.go);
        player2.generateMoves(nim);
        document.getElementById('moves2').style.pointerEvents = 'none';
        document.getElementById('states2').style.display = 'flex';
        document.getElementById('ai2').innerHTML = `${player2.name} būsenos:`;
    } else {
        document.getElementById('moves2').style.pointerEvents = 'auto';
        document.getElementById('states2').style.display = 'none';
        document.getElementById('ai2').innerHTML = ``;
    }

    let matches_box = document.getElementById('matches');
    let matches = '';
    for(let i = 0; i < startingNum; ++i){
        matches += '<img src="match.png" style="width:30px;">';
    }
    matches_box.innerHTML = matches;

    let btns = document.querySelectorAll(`[id^="btn1"]`);
    btns.forEach((b) => {
        b.addEventListener('click', player1.choiceMade);
    });
    btns = document.querySelectorAll(`[id^="btn2"]`);
    btns.forEach((b) => {
        b.addEventListener('click', player2.choiceMade);
    });

    // let selections = document.querySelectorAll(`[id^="select"]`);
    selections.forEach((sel) => {
        sel.addEventListener('send', nim.moveMade);
    });
    document.getElementById('reset').addEventListener('click', nim.reset);
    document.getElementById('resignAI1').addEventListener('resign', nim.aiResign);
    document.getElementById('resignAI2').addEventListener('resign', nim.aiResign);
    document.getElementById('reset').innerHTML = '&#9658;';

}

makeStates();
player1.generateMoves(nim);
start();
