class Player {
    choiceMade = (e) => this.makeMove(e);

    makeMove(event) {
        let choice = Number.parseInt(event.target.innerHTML);
        document.getElementById(`select${choice}`).dispatchEvent(new CustomEvent('send', { detail: [choice, this.name] }));
    }

    constructor(name) {
        this.name = name;
    }
}

Player.prototype.name = 'player';
Player.prototype.lastMove = null;