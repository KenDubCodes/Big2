import Deck from './deck.mjs'
import Player from './player.mjs'
import Rules from './rules.mjs';
import AI from './ai.mjs';


//Game Variables
var deck, rule, Players, Round, PositionArray, IndexArray,
PlayerinCommand, PlayerinTurn, CardsonTable, CardsonTableRanking,
CardsSelected, GameOver

//Graphics Variables
var P0container, P1container, P2container, P3container, 
P0CardsonTablecontainer, P1CardsonTablecontainer, 
P2CardsonTablecontainer, P3CardsonTablecontainer,
HitButtonActivated, PassButtonActivated;

var manifest = [
    {"src": "startscreen.jpg", "id": "startscreen"},
    {"src": "winner.jpg", "id": "winner"},
    {"src": "cardback.jpg", "id": "cardback"},
    {"src": "2♠.png", "id": "2♠"},{"src": "2♣.png", "id": "2♣"},
    {"src": "2♥.png", "id": "2♥"},{"src": "2♦.png", "id": "2♦"},
    {"src": "3♠.png", "id": "3♠"},{"src": "3♣.png", "id": "3♣"},
    {"src": "3♥.png", "id": "3♥"},{"src": "3♦.png", "id": "3♦"},
    {"src": "4♠.png", "id": "4♠"},{"src": "4♥.png", "id": "4♥"},
    {"src": "4♣.png", "id": "4♣"},{"src": "4♦.png", "id": "4♦"},
    {"src": "5♠.png", "id": "5♠"},{"src": "5♣.png", "id": "5♣"},
    {"src": "5♥.png", "id": "5♥"},{"src": "5♦.png", "id": "5♦"},
    {"src": "6♠.png", "id": "6♠"},{"src": "6♣.png", "id": "6♣"},
    {"src": "6♥.png", "id": "6♥"},{"src": "6♦.png", "id": "6♦"},
    {"src": "7♠.png", "id": "7♠"},{"src": "7♣.png", "id": "7♣"},
    {"src": "7♥.png", "id": "7♥"},{"src": "7♦.png", "id": "7♦"},
    {"src": "8♠.png", "id": "8♠"},{"src": "8♣.png", "id": "8♣"},
    {"src": "8♥.png", "id": "8♥"},{"src": "8♦.png", "id": "8♦"},
    {"src": "9♠.png", "id": "9♠"},{"src": "9♣.png", "id": "9♣"},
    {"src": "9♥.png", "id": "9♥"},{"src": "9♦.png", "id": "9♦"},
    {"src": "10♠.png", "id": "10♠"},{"src": "10♣.png", "id": "10♣"},
    {"src": "10♥.png", "id": "10♥"},{"src": "10♦.png", "id": "10♦"},
    {"src": "A♠.png", "id": "A♠"},{"src": "A♣.png", "id": "A♣"},
    {"src": "A♥.png", "id": "A♥"},{"src": "A♦.png", "id": "A♦"},
    {"src": "J♠.png", "id": "J♠"},{"src": "J♣.png", "id": "J♣"},
    {"src": "J♥.png", "id": "J♥"},{"src": "J♦.png", "id": "J♦"},
    {"src": "K♠.png", "id": "K♠"},{"src": "K♣.png", "id": "K♣"},
    {"src": "K♥.png", "id": "K♥"},{"src": "K♦.png", "id": "K♦"},
    {"src": "Q♠.png", "id": "Q♠"},{"src": "Q♣.png", "id": "Q♣"},
    {"src": "Q♥.png", "id": "Q♥"},{"src": "Q♦.png", "id": "Q♦"}
];

//1. Initialize
var stage = new createjs.Stage("GameCanvas");

//Tickers
createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
createjs.Ticker.addEventListener("tick", stage);

var loader = new createjs.LoadQueue(true);
loader.addEventListener("complete", handleComplete);
loader.loadManifest(manifest, true, "./images/");

var background = new createjs.Shape();
background.graphics.beginLinearGradientFill(["#229954", "#1E8449"], [0.05, 1],
0, 0, 0, 720).drawRect(0, 0, 1080, 720);
background.x = 0;
background.y = 0;
background.name = "background";
stage.addChild(background);

//Start Screen
var StartScreenContainer = new createjs.Container();
stage.addChild(StartScreenContainer);

//Add Start Screen and Start Button
function handleComplete() {
    AddStartScreen();
    CreatStartButton();
}

function AddStartScreen(){

    var startscreen = new createjs.Bitmap(loader.getResult("startscreen"));
    startscreen.shadow = new createjs.Shadow("#424949", 5, 5, 10);
    startscreen.x = 140;
    startscreen.y = 60;
    startscreen.name = "startscreen";
    StartScreenContainer.addChild(startscreen); 
}

function RemoveStartScreen() {
    StartScreenContainer.removeAllChildren();
}

//Winner Screen
var WinnerScreenContainer = new createjs.Container();
stage.addChild(WinnerScreenContainer);

function AddWinnerScreen() {

    var winnerscreen = new createjs.Bitmap(loader.getResult("winner"));
    winnerscreen.x = 140;
    winnerscreen.y = 60;
    winnerscreen.name = "winnerscreen";
    WinnerScreenContainer.addChild(winnerscreen); 

}

function WinnerText(PlayerinTurn){
    if (PlayerinTurn == 0) {
        var wintext = new createjs.Text("YOU WIN", "70px Copperplate", "#FFFFFF");
    }
    if (PlayerinTurn == 1) {
        var wintext = new createjs.Text("P1 WINS", "70px Copperplate", "#FFFFFF");
    }
    if (PlayerinTurn == 2) {
        var wintext = new createjs.Text("P2 WINS", "70px Copperplate", "#FFFFFF");
    }
    if (PlayerinTurn == 3) {
        var wintext = new createjs.Text("P3 WINS", "70px Copperplate", "#FFFFFF");
    }
    wintext.x = 570;
    wintext.y = 300;
    wintext.textBaseline = "alphabetic";
    WinnerScreenContainer.addChild(wintext);
}

function RemoveWinnerScreen() {
    if (WinnerScreenContainer.children.length !== 0) {
        WinnerScreenContainer.removeAllChildren();
    }
}


//2. Define Container to hold each player's hand information
P0container = new createjs.Container();
stage.addChild(P0container);
P1container = new createjs.Container();
stage.addChild(P1container);
P2container = new createjs.Container();
stage.addChild(P2container);
P3container = new createjs.Container();
stage.addChild(P3container);
P0CardsonTablecontainer = new createjs.Container();   
stage.addChild(P0CardsonTablecontainer);
P1CardsonTablecontainer = new createjs.Container();  
stage.addChild(P1CardsonTablecontainer);
P2CardsonTablecontainer = new createjs.Container(); 
stage.addChild(P2CardsonTablecontainer);
P3CardsonTablecontainer = new createjs.Container(); 
stage.addChild(P3CardsonTablecontainer);


//Define functions to display each player's cards
var P0HandSelectCheck = [];
function DisplayP0Hand(hand) {
    var cards = [];
    var align = 465 - (hand.length * 20);
    var count = 0;
    for (let n = 0; n <= hand.length - 1; n++) {
        P0HandSelectCheck.push(false);
        count += 40;
        cards.push(new createjs.Bitmap(loader.getResult(hand[n].name)));
        cards[n].scale = 0.7;
        cards[n].x = align + count;
        cards[n].y = 520;
        cards[n].name = n;
        P0container.addChild(cards[n]);
    } 
}

//Selection Function to pick cards
var P0selectedcards = [];
function P0SelectedCards () {

    //Pop up the cards if it has not been selected
    for (let i = 0; i <= P0container.children.length - 1; i++){
        let card = P0container.children[i];
        card.addEventListener("click", function(event) {
      
            if (card.y == 520) {

                P0selectedcards.push(P0container.children.indexOf(card));
                card.y = 480;
                console.log("P0selectedcards: ", P0selectedcards);
                return;
            }

            if (card.y == 480) {

                for (let n = P0selectedcards.length - 1; n >= 0; n--) {
                    if (P0selectedcards[n] == i){
                        P0selectedcards.splice(n, 1);
                    }
                }
                card.y = 520;
                console.log("P0selectedcards: ", P0selectedcards)
                return;
            }
        });
    }
} 

function createP1CardBack(i) {

    var show = i - 1;
    var align = 310 - (i*10);
    if (show >= 0){
        var cardbacks = [];
        var count = 0;
        for (let n = 0; n <= show; n++) {
            count += 25;
            cardbacks.push(new createjs.Bitmap(loader.getResult("cardback")));
            cardbacks[n].scale = 0.6;
            cardbacks[n].x = 925;
            cardbacks[n].y = align + count;
            cardbacks[n].rotation = 270;
            P1container.addChild(cardbacks[n]);
        } 
    }
}

function createP2CardBack(i) {

    var show = i - 1;
    var align = 465 - (i*10);
    if(show >= 0); {
        var cardbacks = [];
        var count = 0;
        for (let n = 0; n <= show; n++) {
            count += 25;
            cardbacks.push(new createjs.Bitmap(loader.getResult("cardback")));
            cardbacks[n].scale = 0.6;
            cardbacks[n].x = align + count;
            cardbacks[n].y = 20;
            P2container.addChild(cardbacks[n]);
        } 
    }
}


function createP3CardBack(i) {

    var show = i - 1;
    var align = 240 - (i*10);
    if(show >= 0) {
        var cardbacks = [];
        var count = 0;
        for (let n = 0; n <= show; n++) {
            count += 25;
            cardbacks.push(new createjs.Bitmap(loader.getResult("cardback")));
            cardbacks[n].scale = 0.6;
            cardbacks[n].x = 150;
            cardbacks[n].y = align + count;
            cardbacks[n].rotation = 90;
            P3container.addChild(cardbacks[n]);
        } 
    }
}

function DisplayHandCount(HandCount1, HandCount2, HandCount3) {
    createP1CardBack(HandCount1);
    createP2CardBack(HandCount2);
    createP3CardBack(HandCount3);
}

//Define the Cards on Table Areas
function P0CardsonTable(CardsonTable) {

    var P0hits = [];
    var count = 0;
    var align = 475 - (CardsonTable.length*20);
    for (let i = 0; i <= CardsonTable.length - 1; i++){
        count += 45;
        P0hits.push(new createjs.Bitmap(loader.getResult(CardsonTable[i])));
        P0hits[i].scale = 0.55;
        P0hits[i].x = align + count;
        P0hits[i].y = 320;
        P0CardsonTablecontainer.addChild(P0hits[i]);
    }
}

function P1CardsonTable(CardsonTable) {

    var P1hits = [];
    var count = 0;
    var align = 385 + (CardsonTable.length*25);
    for (let i = 0; i <= CardsonTable.length - 1; i++){
        count += 45;
        P1hits.push(new createjs.Bitmap(loader.getResult(CardsonTable[i])));
        P1hits[i].scale = 0.55;
        P1hits[i].x = 765;
        P1hits[i].y = align - count;
        P1hits[i].rotation = 270;
        P1CardsonTablecontainer.addChild(P1hits[i]);
    }
}

function P2CardsonTable(CardsonTable) {

    var P2hits = [];
    var count = 0;
    var align = 475 - (CardsonTable.length*20);
    for (let i = 0; i <= CardsonTable.length - 1; i++){
        count += 45;
        P2hits.push(new createjs.Bitmap(loader.getResult(CardsonTable[i])));
        P2hits[i].scale = 0.55;
        P2hits[i].x = align + count;
        P2hits[i].y = 170;
        P2CardsonTablecontainer.addChild(P2hits[i]);
    }
}

function P3CardsonTable(CardsonTable) {

    var P3hits = [];
    var count = 0;
    var align = 245 - (CardsonTable.length*20);
    for (let i = 0; i <= CardsonTable.length - 1; i++){
        count += 45;
        P3hits.push(new createjs.Bitmap(loader.getResult(CardsonTable[i])));
        P3hits[i].scale = 0.55;
        P3hits[i].x = 310;
        P3hits[i].y = align + count;
        P3hits[i].rotation = 90;
        P3CardsonTablecontainer.addChild(P3hits[i]);
    }
}

function TextPass(PlayerinTurn) {
    var textpass = new createjs.Text("PASS", "50px Copperplate", "#FFFFFF");

    if (PlayerinTurn == 0) {
        P0CardsonTablecontainer.removeAllChildren();
    
        textpass.x = 485;
        textpass.y = 450;
        textpass.textBaseline = "alphabetic";
        P0CardsonTablecontainer.addChild(textpass);
    }

    if (PlayerinTurn == 1) {
        P1CardsonTablecontainer.removeAllChildren();

        textpass.x = 890;
        textpass.y = 380;
        textpass.rotation = 270;
        textpass.textBaseline = "alphabetic";
        P1CardsonTablecontainer.addChild(textpass);
    }

    if (PlayerinTurn == 2) {
        P2CardsonTablecontainer.removeAllChildren();

        textpass.x = 485;
        textpass.y = 215;
        textpass.textBaseline = "alphabetic";
        P2CardsonTablecontainer.addChild(textpass);
    }

    if (PlayerinTurn == 3) {
        P3CardsonTablecontainer.removeAllChildren();

        textpass.x = 185;
        textpass.y = 250;
        textpass.rotation = 90;
        textpass.textBaseline = "alphabetic";
        P3CardsonTablecontainer.addChild(textpass);

    }
}

function ClearCardsonTable(){
    if (typeof P0CardsonTablecontainer !== "undefined") {
        P0CardsonTablecontainer.removeAllChildren();
    }
    if (typeof P1CardsonTablecontainer !== "undefined") {
        P1CardsonTablecontainer.removeAllChildren();
    }
    if (typeof P2CardsonTablecontainer !== "undefined") {
        P2CardsonTablecontainer.removeAllChildren();
    }
    if (typeof P3CardsonTablecontainer !== "undefined") {
        P3CardsonTablecontainer.removeAllChildren();
    }
}


//3. Create The Hit Button
var ButtonHit = new createjs.Container();
function CreateHitButton(){
    var hitbox = new createjs.Shape();
    hitbox.graphics.beginFill("#85929E").drawRoundRectComplex(
        0, 0, 170, 75, 10, 10, 10, 10);
    hitbox.shadow = new createjs.Shadow("#424949", 3, 3, 5);
    hitbox.x = 880;
    hitbox.y = 525;
    hitbox.name = "hitbox";
    ButtonHit.addChild(hitbox);
    var hittext = new createjs.Text("Hit", "30px Copperplate", "#FFFFFF");
    hittext.x = 940;
    hittext.y = 570;
    hittext.textBaseline = "alphabetic";
    ButtonHit.addChild(hittext);
    stage.addChild(ButtonHit);
    }


//4. Create The Pass Button
var ButtonPass = new createjs.Container();
function CreatePassButton() {
    var passbox = new createjs.Shape();
    passbox.graphics.beginFill("#85929E").drawRoundRectComplex(
        0, 0, 170, 75, 10, 10, 10, 10)
    passbox.shadow = new createjs.Shadow("#424949", 3, 3, 5);
    passbox.x = 880;
    passbox.y = 615;
    passbox.name = "passbox";
    ButtonPass.addChild(passbox);
    var passtext = new createjs.Text("Pass", "30px Copperplate", "#FFFFFF");
    passtext.x = 930;
    passtext.y = 660;
    passtext.textBaseline = "alphabetic";
    ButtonPass.addChild(passtext);
    stage.addChild(ButtonPass);
    ButtonPass.addEventListener("click", function(event) {
        if (PlayerinTurn == 0) {
            Pass(PlayerinTurn);
        }
    });
}

//Button Activations
HitButtonActivated = false;
PassButtonActivated = false;
function ActivateHitButton() {
    var hitbox = ButtonHit.getChildByName("hitbox");
    hitbox.graphics.clear().beginLinearGradientFill(["#F1C40F", "#B7950B"], [0.05, 1],
    0, 0, 0, 120).drawRect(0, 0, 170, 75);
    hitbox.shadow = new createjs.Shadow("#424949", 3, 3, 5);
    hitbox.x = 880;
    hitbox.y = 525;

    HitButtonActivated = true;

    ButtonHit.addEventListener("click", function(event) {
        if (PlayerinTurn == 0) {
            PlayCard(PlayerinTurn);
        }
    });

}

function ActivatePassButton(PlayerinTurn) {
    //Can only Pass when not in command
    if (Players[PlayerinTurn].command == false) {

        var passbox = ButtonPass.getChildByName("passbox");
        passbox.graphics.clear().beginLinearGradientFill(["#2980B9", "#1F618D"], [0.05, 1],
        0, 0, 0, 120).drawRect(0, 0, 170, 75);
        passbox.shadow = new createjs.Shadow("#424949", 3, 3, 5);
        passbox.x = 880;
        passbox.y = 615;  
    
        PassButtonActivated = true;
        
        ButtonPass.addEventListener("click", function(event) {
            if (PlayerinTurn == 0) {
                Pass(PlayerinTurn);
            }
        });
    }
}

function DeactivateHitButton() {

    if (HitButtonActivated == true) {
        var hitbox = ButtonHit.getChildByName("hitbox");
        hitbox.graphics.clear().beginFill("#85929E").drawRect(0, 0, 170, 75);
        hitbox.shadow = new createjs.Shadow("#424949", 3, 3, 5);
        hitbox.x = 880;
        hitbox.y = 525;
        ButtonHit.removeAllEventListeners(); 
        
        HitButtonActivated = false;
    }
}

function DeactivatePassButton() {

    if (PassButtonActivated == true) {
        var passbox = ButtonPass.getChildByName("passbox");
        passbox.graphics.clear().beginFill("#85929E").drawRect(0, 0, 170, 75);
        passbox.shadow = new createjs.Shadow("#424949", 3, 3, 5);
        passbox.x = 880;
        passbox.y = 615;  
        ButtonPass.removeAllEventListeners();

        PassButtonActivated = false;
    }
}

//5. Create the Start Button
var ButtonStart = new createjs.Container();

function CreatStartButton(){
    var startbox = new createjs.Shape();
    startbox.graphics.beginLinearGradientFill(["#CB4335", "#B03A2E"], [0.05, 1],
    0, 0, 0, 120).drawRoundRectComplex(0, 0, 200, 120, 10, 10, 10, 10);
    startbox.shadow = new createjs.Shadow("#424949", 3, 3, 5);
    startbox.x = 640;
    startbox.y = 390;
    startbox.name = "startbox";
    ButtonStart.addChild(startbox);
    var starttext = new createjs.Text("Start", "40px Copperplate", "#FFFFFF");
    starttext.x = 685;
    starttext.y = 460;
    starttext.textBaseline = "alphabetic";
    ButtonStart.addChild(starttext);
    stage.addChild(ButtonStart);
}


//6. Game Flow: Start Game
ButtonStart.addEventListener("click", function() { 

    //Graphics
    //Deactiviate Start Button untill end game
    RemoveWinnerScreen();
    RemoveStartScreen();
    ButtonStart.removeAllChildren();

    CreateHitButton();
    CreatePassButton();
    //

    StartGame();
    
    AddPlayer();

    DealCard();

    PositionArray = [Players[0], Players[1], Players[2], Players[3]];

    //Graphics: Display Cards
    DisplayP0Hand(Players[0].hand);
    P0SelectedCards();

    DisplayHandCount(
        Players[1].hand.length,
        Players[2].hand.length,
        Players[3].hand.length);
    //

    FindDiamond3();

    console.log("Position Array: ", PositionArray)

    PlayerinTurn = PositionArray[0].id;
    PositionArray[0].turn = true;
    Round = 0
    
    //Graphics: Activate Buttons
    if (Players[PlayerinTurn].id == 0) {
        ActivateHitButton();
        ActivatePassButton(PlayerinTurn);
    }
    //

    Players.forEach(element => {console.log(element);});

    //AI
    Players[PlayerinTurn].ai.UpdateCardsonTable(
        Round, Players[PlayerinTurn].command, CardsonTable, CardsonTableRanking);
    
    //AI Start running if not Player 0
    if (Players[PlayerinTurn].id !== 0) {
        setTimeout(() => { AIPlay(PlayerinTurn, Analyze(PlayerinTurn))}, 1000);
    } else {
    //Analyze for Player 0 if not AI turn
    Analyze(PlayerinTurn);
    }

})

//Functions for Start Game
function StartGame() {

    GameOver = false;
    deck = new Deck();
    rule = new Rules();
    deck.shuffle();
    CardsonTable = [];
}

function AddPlayer() {

    Players = []

    for (let i = 0; i <= 3; i++) {

        //player.id[0] is me, player.id[1] 1 is the next player to me...
        Players.push(new Player(i));

        Players[i].ai = new AI(i, Players[i].analytics);
    }
}

function DealCard() {

    //First 13 cards for player 0, next 13 for player 1...
    for (let p = 0; p <= 3; p++) {

        for(let i = 1;  i <= 13; i++) {

            var Deal = deck.draw();
            Players[p].hand.push(Deal)

        }

        //Sort Card from smallest to largest
        Players[p].hand.sort((a, b) => a.cardranking - b.cardranking);

        //Update each player's analytics
        Players[p].analytics.UpdateCardsLeft(Players[p].hand);
    }
}

function FindDiamond3() {

    for (let i = 0; i <= 3; i++) {

        for (let j = 0; j <= 12; j++) {

            if (Players[i].hand[j].cardranking == 1 && i > 0) {

                // Move Player with Diamond 3 to first
                PositionArray = PositionArray.concat(PositionArray.splice(0, i))
  
            }           
        }
    } 

    PlayerinCommand = PositionArray[0].id;

    //Diamond 3 Player in Command
    Players[PlayerinCommand].command = true;

}

function Analyze(PlayerinTurn) {

    //Update Analytics for decision making
    Players[PlayerinTurn].analytics.UpdateRemainingCombinations();

    var handcounts = []
    for (let p = 0; p <= 3; p++) {
        if (Players[p].turn == false) {
            handcounts.push(Players[p].hand.length);
        }
    }
    console.log("Hand Counts:", handcounts)

    Players[PlayerinTurn].analytics.AnalyzeHand(
        Players[PlayerinTurn].hand, 
        handcounts[0], handcounts[1], handcounts[2]);

    var cardsselected = Players[PlayerinTurn].ai.PickCards(
        handcounts[0], handcounts[1], handcounts[2]);

    console.log("Player in Turn: ", Players[PlayerinTurn].ai);
    console.log("AI Pick: ", cardsselected)

    return cardsselected;

}

//7. Game Flow: Playing Cards ot Pass
function PlayCard(i) {

    if (Players[i].turn === true) {

        CardsSelected = []

        //Create a new array of cards for comparison   
        for (let j = P0selectedcards.length -1; j >= 0; j--){

            var pickcard = [...Players[i].hand].splice(P0selectedcards[j],1);
            CardsSelected = CardsSelected.concat(pickcard)
        }

        //Sort the selected cards for rule checking
        CardsSelected.sort((a, b) => a.cardranking - b.cardranking);


        //Constraint for First Round Player
        if (Round == 0 && rule.ValidFirstCommand(CardsSelected) == true) {

            CardsonTable = [];
            
            ///Remove the card from Player's hand
            for (let j = P0selectedcards.length -1; j >= 0; j--) {

                Players[i].hand.splice(P0selectedcards[j],1);              
            }
            
            //Change Command position
            Players[PlayerinCommand].command = false;
            PlayerinCommand = i;
            Players[i].command = true
         
            
            //If Selected Card matches the rules
            CardsonTable = CardsonTable.concat(CardsSelected);
            CardsonTableRanking = rule.CardsontheTableRanking(CardsonTable)

            //Update Analytics
            for (let k = 0; k <= 3; k++){
                Players[k].analytics.UpdateCardsLeft(CardsonTable);
            }

            //Graphics: Update Player0's hand
            P0container.removeAllChildren();
            DisplayP0Hand(Players[0].hand);
            P0selectedcards = [];
            P0SelectedCards();
                        
            //Display the Cards on Table
            var cardsontablearray = [];
            for (let i = 0; i <= CardsonTable.length - 1; i++) {
                cardsontablearray.push(CardsonTable[i].name)
            }     
    
            if (PlayerinTurn == 0) {
                P0CardsonTable(cardsontablearray);
            }
            //

            console.log("Cards on Table: ", CardsonTable)
            return EndTurn(PlayerinTurn)

        }

        if (Round > 0){
            // If Play in Command or hit is valid
            if (((Players[i].command == true) &&
                (rule.ValidCommand(CardsSelected) == true)) ||
                ((Players[i].command == false) &&
                (rule.ValidHit(CardsSelected, CardsonTable) == true))) {
                
                CardsonTable = [];
                
                ///Remove the card from Player's hand
                for (let j = P0selectedcards.length -1; j >= 0; j--) {

                    Players[i].hand.splice(P0selectedcards[j],1);              
                }
                
                //Change Command position
                Players[PlayerinCommand].command = false;
                PlayerinCommand = i;
                Players[i].command = true
        
                
                //If Selected Card matches the rules
                CardsonTable = CardsonTable.concat(CardsSelected)
                CardsonTableRanking = rule.CardsontheTableRanking(CardsonTable)

                //Update Analytics
                for (let k = 0; k <= 3; k++){
                    Players[k].analytics.UpdateCardsLeft(CardsonTable)
                }

                //Graphics: Update Player0's hand
                P0container.removeAllChildren();
                DisplayP0Hand(Players[0].hand);
                P0selectedcards = [];
                P0SelectedCards();

                //Display the Cards on Table
                var cardsontablearray = [];
                for (let i = 0; i <= CardsonTable.length - 1; i++) {
                    cardsontablearray.push(CardsonTable[i].name)
                }     

                ClearCardsonTable();
        
                if (PlayerinTurn == 0) {
                    P0CardsonTable(cardsontablearray);
                }
                //               
                
                console.log("Cards on Table: ", CardsonTable);

                CheckWinner(PlayerinTurn);

                if (GameOver === false) {    
                    return EndTurn(PlayerinTurn)
                } else {
                    
                    return console.log("Winner is Player ID: " + Players[i].id)
                }  
            }
        } 
        return alert("Invalid Hand")
    } 
}

function AIPlay(PlayerinTurn, CardsSelected) {
    
    if (CardsSelected.length !== 0) {

        CardsonTable = [];
        
        ///Remove the card from Player's hand
        for (let i = 0; i <= CardsSelected.length - 1; i++) {
            for (let j = Players[PlayerinTurn].hand.length - 1; j >= 0; j--) {

                if (CardsSelected[i].cardranking == 
                    Players[PlayerinTurn].hand[j].cardranking) {

                    Players[PlayerinTurn].hand.splice(j,1);
                } 
            }
        }

        //Change Command position
        Players[PlayerinCommand].command = false;
        PlayerinCommand = PlayerinTurn;
        Players[PlayerinTurn].command = true
              
        //If Selected Card matches the rules
        CardsonTable = CardsonTable.concat(CardsSelected)
        CardsonTableRanking = rule.CardsontheTableRanking(CardsonTable)

        //Update Analytics
        for (let k = 0; k <= 3; k++){
            Players[k].analytics.UpdateCardsLeft(CardsonTable)
        }                

        //Graphics: Update AI's CardsonTable and each AI's Hand Count
        var cardsontablearray = [];
        for (let i = 0; i <= CardsonTable.length - 1; i++) {
            cardsontablearray.push(CardsonTable[i].name)
        }
        console.log("Cards Names: ", cardsontablearray)

        ClearCardsonTable();

        if (PlayerinTurn == 1) {
            P1CardsonTable(cardsontablearray);
        }

        if (PlayerinTurn == 2) {
            P2CardsonTable(cardsontablearray);
        }

        if (PlayerinTurn == 3) {
            P3CardsonTable(cardsontablearray);
        }

        P1container.removeAllChildren();
        P2container.removeAllChildren();
        P3container.removeAllChildren();
        DisplayHandCount(
            Players[1].hand.length,
            Players[2].hand.length,
            Players[3].hand.length)
        //

        console.log("Cards on able: ", CardsonTable);

        CheckWinner(PlayerinTurn);

        if (GameOver === false) {    
            return EndTurn(PlayerinTurn)
        } else {

            return console.log("Winner is Player ID " + Players[PlayerinTurn].id)
        }                  

    }

    //Pass if receive empty array
    if (CardsSelected.length == 0) {
        Pass(PlayerinTurn);
    }

}

function CheckWinner(PlayerinTurn) {
    if (Players[PlayerinTurn].hand.length == 0) {
        GameOver = true;
        if (PlayerinTurn == 0) {
            DeactivateHitButton();
            DeactivatePassButton();
        }

        setTimeout(() => {
            AddWinnerScreen();
            WinnerText(PlayerinTurn);
            ClearCardsonTable();
            P0container.removeAllChildren();
            P1container.removeAllChildren();
            P2container.removeAllChildren();
            P3container.removeAllChildren();
            ButtonHit.removeAllChildren();
            ButtonPass.removeAllChildren(); 
            CreatStartButton();   
            
        }, 1500);
    }
}

function EndTurn(i) {

    //Graphics: Deactivate Buttons
    if (PlayerinTurn == 0) {
        DeactivateHitButton();
        DeactivatePassButton();
    }
    //

    Players[i].turn = false;
    PlayerinTurn = i + 1;

    //Loop to Playing Position 0 
    if (PlayerinTurn > 3) {
        PlayerinTurn = 0;
        Players[PlayerinTurn].turn = true;
    } else {
        Players[PlayerinTurn].turn = true;
    }

    Round++

    //Graphics: Activate Buttons if it's Player 0 turn
    if (PlayerinTurn == 0) {
        ActivateHitButton();
        ActivatePassButton(PlayerinTurn);
    }
    
    //Next Player Starts to Analyze
    Players[PlayerinTurn].ai.UpdateCardsonTable(
        Round, Players[PlayerinTurn].command, CardsonTable, CardsonTableRanking);
        
    //AI Start running if not Player 0
    if (PlayerinTurn !== 0) {
        setTimeout(() => {AIPlay(PlayerinTurn, Analyze(PlayerinTurn))}, 1000);
    } else {

    //Analyze for Player 0 if not AI turn
    console.log("Your Turn")
    Analyze(PlayerinTurn);
    }

}

//Pass
function Pass() {
    TextPass(PlayerinTurn);
    console.log("Passed. Player ID: ", PlayerinTurn);
    EndTurn(PlayerinTurn);

}
