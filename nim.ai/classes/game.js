class Game {
    moveMade = (e) => this.turn(e);
    reset = () => this.start();
    aiResign = (e) => this.resignAI(e);
    player2_wins = 0;
    player1_wins = 0;

    constructor(startState, player1, player2) {
        this.startState = startState;
        this.currState = startState;
        this.player1 = player1;
        this.player2 = player2;
        this.display.innerText = startState;
        this.currPlayer = this.player1;
    };

    redrawMatches = () => {
        let matches_box = document.getElementById('matches');
        let matches = '';
        for(let i = 0; i < this.currState; ++i){
            matches += '<img src="match.png" style="width:30px;">';
        }
        matches_box.innerHTML = matches;
    }

    displayWinner = (type) => {
        if(type=='win')
            this.display.innerText = `${this.winner.name} laimėjo`;
        else {
            if(this.winner == this.player1)
                this.display.innerText = `${this.player2.name} pasidavė`;
            else
                this.display.innerText = `${this.player1.name} pasidavė`;
        }
    }

    teachAI = () => {
        if (!toggleAIlearning) return;
        if (player1 instanceof AI) {
            if (this.player1.mode == 'lp' || this.player1.mode == 'l') {
                this.player1.teach(this.winner);
            }
            this.player1.represent(this);
        }
        if (player2 instanceof AI) {
            if (this.player2.mode == 'lp' || this.player2.mode == 'l') {
                this.player2.teach(this.winner);
            }
            this.player2.represent(this);
        }
    }

    finishGame = (type) => {
        this.active = false;
        this.displayWinner(type);
        this.teachAI();
        if ( this.winner.name == 'nim.AI' || this.winner.name == 'Pirmasis žmogus'){
            document.getElementById('player1_wins').innerHTML = ++this.player1_wins;
        } else if ( this.winner.name == 'nim.AI.2' || this.winner.name == 'Antrasis žmogus' || this.winner.name == 'Žmogus'){
            document.getElementById('player2_wins').innerHTML = ++this.player2_wins;
        }
        if (this.player1 instanceof AI && this.player2 instanceof AI) {
            this.start();
        }
    }

    resignAI = (event) => {
        let ai = event.detail;
        if (this.currPlayer == ai) {
            this.winner = this.nextPlayer;
        } else {
            this.winner = this.currPlayer;
        }
        this.finishGame('resign');
        return;
    }

    turn = (event) => {
        let choice = event.detail[0];
        if (!this.active || event.detail[1] !== this.currPlayer.name || !Number.isInteger(choice) || choice < 1 || choice > 3 || choice >= this.currState) return;

        this.currState -= choice;
        if (this.currState <= 3) {
            document.getElementById('btn1_3').classList.add('unavailable');
            document.getElementById('btn2_3').classList.add('unavailable');
        }
        if (this.currState <= 2) {
            document.getElementById('btn1_2').classList.add('unavailable');
            document.getElementById('btn2_2').classList.add('unavailable');
        }
        if (this.currState <= 1) {
            document.getElementById('btn1_1').classList.add('unavailable');
            document.getElementById('btn2_1').classList.add('unavailable');
        }
        if (this.currState == 1) {
            this.winner = this.currPlayer;
            this.redrawMatches();
            this.finishGame('win');
            return;
        }
        ++this.turnNo;
        this.display.innerHTML = this.currState;
        this.redrawMatches();
        this.swapPlayers();
    }

    swapPlayers = () => {
        let swap = this.currPlayer;
        this.currPlayer = this.nextPlayer;
        this.nextPlayer = swap;
        document.getElementById('moves1').classList.toggle('hidden');
        document.getElementById('moves2').classList.toggle('hidden');
        if (this.currPlayer instanceof AI && this.currPlayer == this.player1) {
            document.getElementById('enableAI1').dispatchEvent(new CustomEvent('go', { detail: [this, 1] }));
        } else if (this.currPlayer instanceof AI && this.currPlayer == this.player2) {
            document.getElementById('enableAI2').dispatchEvent(new CustomEvent('go', { detail: [this, 2] }));
        }
    }

    resetGame = () => {
        this.runId = (this.runId || 0) + 1;
        this.active = true;
        this.currState = this.startState;
        this.turnNo = Player.prototype.turnNo;
        let btns = document.querySelectorAll(`[id^="btn1"], [id^="btn2"]`);
        btns.forEach((b) => {
            if (b.classList.contains('unavailable')) {
                b.classList.remove('unavailable');
            }
        });
        if (document.getElementById('moves1').classList.contains('hidden')) {
            document.getElementById('moves1').classList.toggle('hidden');
            document.getElementById('moves2').classList.toggle('hidden');
        }
        this.display.innerHTML = this.currState;
        this.currPlayer = this.player1;
        this.nextPlayer = this.player2;
        this.redrawMatches();
    }

    start = () => {
        this.resetGame();
        document.getElementById('reset').innerHTML = '↻';
        if (this.currPlayer instanceof AI) {
            document.getElementById('enableAI1').dispatchEvent(new CustomEvent('go', { detail: [this, 1] }));
        }
    }
}

Game.prototype.display = document.getElementById('display');
Game.prototype.turnNo = 1;
Game.prototype.startState = 11;
Game.prototype.currState = 11;
Game.prototype.player1 = new Player('Player1');
Game.prototype.player2 = new Player('Player2');
Game.prototype.winner = null;
