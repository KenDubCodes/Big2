import Analytics from './analytics.mjs';

export default class Player {
    constructor(id) {
        this.id = id;
        this.hand = [];
        this.command = false;
        this.turn = false;
        this.analytics = new Analytics(id);
    }

    //For Text Demo only
    getHTML() {
        const PlayerDiv = document.createElement("div");
        PlayerDiv.innerText= "Player ID: " + this.id + " Hand Count: " + this.hand.length + " Hand:  " + JSON.stringify(this.hand);
        return PlayerDiv
    }
}