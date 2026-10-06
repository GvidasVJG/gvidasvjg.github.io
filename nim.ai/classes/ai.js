class AI extends Player {
    choiceMade = (e) => this.makeMove(e);
    go = (e) => this.selectMove(e);

    makeMove(event) {
        let choice = Number.parseInt(event.target.innerHTML);
        document.getElementById(`select${choice}`).dispatchEvent(new CustomEvent('send', { detail: [choice, this.name] }));
    }

    generateMoves = (game) => {
        let arr = new Array();
        for (let i = 2; i <= game.startState; ++i) {
            if (i == 2) {
                arr.push([1]);
            } else if (i == 3) {
                arr.push([1, 2])
            } else {
                arr.push([1, 2, 3]);
            }
        }

        this.moves = new Array(game.startState + 1);
        for (let i = 2; i < arr.length + 2; ++i) {
            this.moves[i] = arr[i - 2];
        }
        this.represent(game);

    }

    represent = (game) => {
        let turn = game.player1 == this ? 1 : 2;
        for (let i = 2; i < this.moves.length; ++i) {
            document.getElementById(`name${turn}_${i}`).innerHTML = `| ${i} | `;
            let toPut = '';
            this.moves[i].forEach((m) => {
                toPut += `${m} `
            });
            document.getElementById(`box${turn}_${i}`).innerHTML = toPut;
        }
    }

    selectMove = (event) => {
        let game = event.detail[0];
        let state = game.currState;
        const runId = game.runId;
        let mv = undefined;
        mv = new Promise(res => {
            res(this.moves[state][randInt(0, this.moves[state].length - 1)])
        });
        mv.then(move => {
            let turn = event.detail[1];
            if (move == undefined) {
                document.getElementById(`resignAI${turn}`).dispatchEvent(new CustomEvent('resign', { detail: this }));
                return;
            }
            this.lastMove = [state, move];
            setTimeout(() => {
                if (game.active && game.runId === runId && game.currPlayer === this && game.currState === state)
                    document.getElementById(`btn${turn}_${move}`).dispatchEvent(new Event('click'));
            }, 50);
        });
    }

    forgetMove(state, move) {
        this.moves[state] = this.moves[state].filter((v, i, a) => i !== a.lastIndexOf(move));
        console.log(`${this.name} Forgot move: ${move} from state: ${state}`);
    }

    learnMove(state, move) {
        this.moves[state].push(move);
        console.log(`${this.name} Learned move: ${move} from state: ${state}`);
    }

    teach = (winner) => {
        if (this.learningMethod == 'np') {
            if (winner == this) {
                this.learnMove(this.lastMove[0], this.lastMove[1]);
            } else {
                this.forgetMove(this.lastMove[0], this.lastMove[1]);
            }
        } else if (this.learningMethod == 'n') {
            if (!(winner == this)) {
                this.forgetMove(this.lastMove[0], this.lastMove[1]);
            }
        } else if (this.learningMethod == 'p') {
            if (winner == this) {
                this.learnMove(this.lastMove[0], this.lastMove[1]);
            }
        }
    }

    constructor(name, mode, lm) {
        super(name);
        this.mode = mode;
        this.learningMethod = lm;
    }
}

AI.prototype.name = 'AI';
AI.prototype.moves = [];
AI.prototype.lastMove = [];
AI.prototype.mode = 'lp';
AI.prototype.learningMethod = 'np';
