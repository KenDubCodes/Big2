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
P0NameContainer, P1NameContainer, P2NameContainer, P3NameContainer,
HitButtonActivated, PassButtonActivated;

var manifest = [
    {"src": "startscreen.png", "id": "startscreen"},
    {"src": "startbutton.png", "id": "startbutton"},
    {"src": "startbuttonclicked.png", "id": "startbuttonclicked"},
    {"src": "hitbutton.png", "id": "hitbutton"},
    {"src": "hitbuttonclicked.png", "id": "hitbuttonclicked"},
    {"src": "hitbuttondeactivated.png", "id": "hitbuttondeactivated"},
    {"src": "passbutton.png", "id": "passbutton"},
    {"src": "passbuttonclicked.png", "id": "passbuttonclicked"},
    {"src": "passbuttondeactivated.png", "id": "passbuttondeactivated"},
    {"src": "P0name.png", "id": "P0name"}, {"src": "P1name.png", "id": "P1name"},
    {"src": "P2name.png", "id": "P2name"}, {"src": "P3name.png", "id": "P3name"},
    {"src": "P0namehighlighted.png", "id": "P0namehighlighted"}, 
    {"src": "P1namehighlighted.png", "id": "P1namehighlighted"}, 
    {"src": "P2namehighlighted.png", "id": "P2namehighlighted"}, 
    {"src": "P3namehighlighted.png", "id": "P3namehighlighted"}, 
    {"src": "passtext.png", "id": "passtext"},
    {"src": "winner.png", "id": "winner"},
    {"src": "P0win.png", "id": "P0win"},{"src": "P1win.png", "id": "P1win"},
    {"src": "P2win.png", "id": "P2win"},{"src": "P3win.png", "id": "P3win"},
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


var canvasheight = 720;
var canvaswidth = canvasheight * 1280 / 720;

console.log("canvasheight", canvasheight, 
"canvaswidth", canvaswidth);


var background = new createjs.Shape();
background.graphics.beginRadialGradientFill(["#2E7D32", "#F2E64E"], [0.05, 1],
canvaswidth/2, canvasheight/2, canvaswidth/1.5, canvaswidth/2, canvasheight/2, 0)
.drawRect(0, 0, canvaswidth, canvasheight);
background.x = 0;
background.y = 0;
background.name = "background";
var bgwidth = background.graphics.command.w;
var bgheight = background.graphics.command.h;
stage.addChild(background);

console.log("bgheight", bgheight, "bgwidth", bgwidth, 
);

//Loading Text
var loadingcontainer = new createjs.Container();
stage.addChild(loadingcontainer);


var loadingtext = new createjs.Text("Loading...", "40px Copperplate", "#FFFFFF");
loadingtext.shadow = new createjs.Shadow("#7B7D7D ", 2, 2, 5);
loadingtext.x = 0;
loadingtext.y = 0;
loadingtext.name = "loadingtext";
loadingtext.textBaseline = "alphabetic";
loadingcontainer.addChild(loadingtext);
loadingcontainer.x = (bgwidth - loadingtext.getBounds().width) / 2;
loadingcontainer.y = (bgheight - loadingtext.getBounds().height) / 2;
createjs.Tween.get(loadingcontainer, {loop: true})
.to({alpha: 0}, 500, createjs.Ease.getPowInOut(3))
.to({alpha: 1}, 1000, createjs.Ease.getPowInOut(3));


//Start Screen
var StartScreenContainer = new createjs.Container();
stage.addChildAt(StartScreenContainer, 1);

//Add Start Screen and Start Button
function handleComplete() {
    loadingcontainer.removeAllChildren();
    AddStartScreen();
    CreatStartButton(StartScreenContainer);
    StartScreenContainer.addChild(ButtonStart);
    ShowScreenAnimate(StartScreenContainer);
}

function AddStartScreen(){

    var startscreen = new createjs.Bitmap(loader.getResult("startscreen"));
    startscreen.shadow = new createjs.Shadow("#424949", 1, 1, 10);
    startscreen.x = 0;
    startscreen.y = 0;
    //startscreen.scale = bgheight / 720;
    startscreen.name = "startscreen";
    StartScreenContainer.addChild(startscreen);
    StartScreenContainer.x = (bgwidth - startscreen.getBounds().width * startscreen.scale) / 2;
    StartScreenContainer.y = bgheight * startscreen.scale;
}

function RemoveStartScreen() {
    StartScreenContainer.removeAllChildren();
}

function ShowScreenAnimate(ScreenContainer) {
    createjs.Tween.get(ScreenContainer)
    .to({y: (bgheight - ScreenContainer.getBounds().height) / 2 - bgheight/36}, 
        800, createjs.Ease.getPowInOut(3))
    .to({y: (bgheight - ScreenContainer.getBounds().height) / 2}
        , 200, createjs.Ease.getPowInOut(3))    
}

function QuitScreenAnimate(ScreenContainer) {
    createjs.Tween.get(ScreenContainer)
    .to({y: (bgheight - ScreenContainer.getBounds().height) / 2 - bgheight/36}
        , 200, createjs.Ease.getPowInOut(3))
    .to({y: bgheight}, 800,
        createjs.Ease.getPowInOut(3));
}


//Winner Screen
var WinnerScreenContainer = new createjs.Container();
stage.addChildAt(WinnerScreenContainer, 2);

function AddWinnerScreen() {

    var winnerscreen = new createjs.Bitmap(loader.getResult("winner"));
    winnerscreen.shadow = new createjs.Shadow("#424949", 5, 5, 10);
    winnerscreen.x = 0;
    winnerscreen.y = 0;
    winnerscreen.name = "winnerscreen";
    WinnerScreenContainer.addChild(winnerscreen); 
    WinnerScreenContainer.x = (bgwidth - winnerscreen.getBounds().width) / 2;
    WinnerScreenContainer.y = bgheight;
}

function WinnerText(PlayerinTurn){

    if (PlayerinTurn == 0) {
        var wintext = new createjs.Bitmap(loader.getResult("P0win"));
    }
    if (PlayerinTurn == 1) {
        var wintext = new createjs.Bitmap(loader.getResult("P1win"));
    }
    if (PlayerinTurn == 2) {
        var wintext = new createjs.Bitmap(loader.getResult("P2win"));
    }
    if (PlayerinTurn == 3) {
        var wintext = new createjs.Bitmap(loader.getResult("P3win"));
    }
    wintext.x = 0;
    wintext.y = 0;
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
P1container = new createjs.Container();
P2container = new createjs.Container();
P3container = new createjs.Container();
P0CardsonTablecontainer = new createjs.Container();   
P1CardsonTablecontainer = new createjs.Container();  
P2CardsonTablecontainer = new createjs.Container(); 
P3CardsonTablecontainer = new createjs.Container(); 
P0NameContainer = new createjs.Container();
P1NameContainer = new createjs.Container();
P2NameContainer = new createjs.Container();
P3NameContainer = new createjs.Container();

stage.addChildAt(P0container,P1container,P2container,P3container,
    P0CardsonTablecontainer,P1CardsonTablecontainer,P2CardsonTablecontainer,
    P3CardsonTablecontainer, P0NameContainer, P1NameContainer, P2NameContainer,
    P3NameContainer, 1); 

//Define functions to display each player's cards

var P0HandSelectCheck = [];
function DisplayP0Hand(hand) {
    var cardface = new createjs.Bitmap(loader.getResult("2♠"));
    var cardfacewidth = cardface.getBounds().width;

    var cards = [];
    var align = ((bgwidth - cardfacewidth) / 2) - ((hand.length - 1) * bgwidth / 54);
    var count = 0;
    for (let n = 0; n <= hand.length - 1; n++) {
        P0HandSelectCheck.push(false);
        count += bgwidth / 27;
        cards.push(new createjs.Bitmap(loader.getResult(hand[n].name)));

        //Card Scale need to reevaluated if DIFFERENT ASPECT card face uploaded
        cards[n].scale = bgwidth * 0.1 / cardfacewidth;
        cards[n].x = align + count;
        cards[n].y = bgheight * 13/18;
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
      
            if (card.y == bgheight * 13/18) {

                P0selectedcards.push(P0container.children.indexOf(card));
                card.y = bgheight * 12/18;
                console.log("P0selectedcards: ", P0selectedcards);
                return;
            }

            if (card.y == bgheight * 12/18) {

                for (let n = P0selectedcards.length - 1; n >= 0; n--) {
                    if (P0selectedcards[n] == i){
                        P0selectedcards.splice(n, 1);
                    }
                }
                card.y = bgheight * 13/18;
                console.log("P0selectedcards: ", P0selectedcards)
                return;
            }
        });
    }
} 

//Hit Button only activates when Valid Cards are picked
function HitActivateListener () {
    for (let i = 0; i <= P0container.children.length - 1; i++){
        let card = P0container.children[i];
        card.addEventListener("click", function(event) {

            ActivateHitConditions(P0selectedcards, CardsonTable);

        });
    }
}


function createP1CardBack(i) {
    var cardback = new createjs.Bitmap(loader.getResult("cardback"));
    var cardbackwidth = cardback.getBounds().width;
    
    var show = i - 1;
    var align = ((bgheight - cardbackwidth) / 2) - (i * bgheight / 72);
    if (show >= 0){
        var cardbacks = [];
        var count = 0;
        for (let n = 0; n <= show; n++) {
            count += cardbackwidth / 5;
            cardbacks.push(new createjs.Bitmap(loader.getResult("cardback")));

            //Card Scale need to reevaluated if DIFFERENT ASPECT card face uploaded
            cardbacks[n].scale = (bgwidth * 5/72) / cardbackwidth;
            cardbacks[n].x = bgwidth * 925 / 1080;
            cardbacks[n].y = align + count;
            cardbacks[n].rotation = 270;
            P1container.addChild(cardbacks[n]);
        } 
    }
}

function createP2CardBack(i) {
    
    var cardback = new createjs.Bitmap(loader.getResult("cardback"));
    var cardbackwidth = cardback.getBounds().width;

    var show = i - 1;
    var align = ((bgwidth - cardbackwidth) / 2) - (i * bgwidth / 108);;
    if(show >= 0); {
        var cardbacks = [];
        var count = 0;
        for (let n = 0; n <= show; n++) {
            count += cardbackwidth / 5;
            cardbacks.push(new createjs.Bitmap(loader.getResult("cardback")));
            cardbacks[n].scale = (bgwidth * 5/72) / cardbackwidth;
            cardbacks[n].x = align + count;
            cardbacks[n].y = bgheight / 36;
            P2container.addChild(cardbacks[n]);
        } 
    }
}


function createP3CardBack(i) {

    var cardback = new createjs.Bitmap(loader.getResult("cardback"));
    var cardbackwidth = cardback.getBounds().width;

    var show = i - 1;
    var align = ((bgheight - cardbackwidth) * 0.4) - (i * bgwidth / 108);
    if(show >= 0) {
        var cardbacks = [];
        var count = 0;
        for (let n = 0; n <= show; n++) {
            count += cardbackwidth / 5;
            cardbacks.push(new createjs.Bitmap(loader.getResult("cardback")));
            cardbacks[n].scale = (bgwidth * 5/72) / cardbackwidth;
            cardbacks[n].x = bgwidth * 5 / 36;
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

function DealCardAnimate(){
    var CardsonTableArray = 
    [P0container, P1container, P2container, P3container];

    for (let i = 0; i <= CardsonTableArray.length - 1; i++){
        var cardsdestination = [];
        
        //Push each card's coordinate into cardsdestination
        for (let j = 0; j <= CardsonTableArray[i].children.length - 1; j++){
            cardsdestination.push([
                CardsonTableArray[i].children[j].x,
                CardsonTableArray[i].children[j].y
            ]);
        }

        //Move each card's coordinate to the first card
        for (let j = 0; j <= CardsonTableArray[i].children.length - 1; j++){

            CardsonTableArray[i].children[j].x =
            CardsonTableArray[i].children[0].x;

            CardsonTableArray[i].children[j].y = 
            CardsonTableArray[i].children[0].y
        }

        var delay = 0;

        //Finally move the cards to final destination
        for (let j = 0; j <= CardsonTableArray[i].children.length - 1; j++){

            delay += 50;

            createjs.Tween.get(CardsonTableArray[i].children[j])
            .to({
                x: cardsdestination[j][0], 
                y: cardsdestination[j][1]
            }, 500 + delay, createjs.Ease.getPowInOut(2));
        }
    }
}

//Define the Cards on Table Areas
function P0CardsonTable(CardsonTable) {

    //Disable card visibility for animation purpose
    P0CardsonTablecontainer.alpha = 0;

    var cardface = new createjs.Bitmap(loader.getResult("2♠"));
    var cardfacewidth = cardface.getBounds().width;

    var P0hits = [];
    var align = ((bgwidth - cardfacewidth) / 2) - ((CardsonTable.length - 1) * bgwidth / 54);
    var count = 0;

    for (let i = 0; i <= CardsonTable.length - 1; i++){

        count += cardfacewidth * 45 / 167;
        P0hits.push(new createjs.Bitmap(loader.getResult(CardsonTable[i])));
        P0hits[i].scale = 0.55;
        P0hits[i].x = align + count;
        P0hits[i].y = bgheight * 4/9;
        P0CardsonTablecontainer.addChild(P0hits[i]);
    }
    P0PlayCardAnimation();
}

function P0PlayCardAnimation(){
    createjs.Tween.get(P0CardsonTablecontainer)
    .to({alpha: 0.5, y: bgheight / 10})
    .to({alpha: 1, x: 0, y: 0}, 400, createjs.Ease.getPowInOut(3));
}

function P1CardsonTable(CardsonTable) {

    P1CardsonTablecontainer.alpha = 0;

    var cardface = new createjs.Bitmap(loader.getResult("2♠"));
    var cardfacewidth = cardface.getBounds().width;

    var P1hits = [];
    //Divide by 2.25 but not 2 to leave more room for Player 0 to pick cards
    var align = (bgheight + cardfacewidth) / 2.25 + ((CardsonTable.length - 1) * bgheight / 28.8);
    var count = 0;
    for (let i = 0; i <= CardsonTable.length - 1; i++){

        count -= cardfacewidth * 45 / 167;
        P1hits.push(new createjs.Bitmap(loader.getResult(CardsonTable[i])));
        P1hits[i].scale = 0.55;
        P1hits[i].x = bgwidth * 17 / 24;
        P1hits[i].y = align + count;
        P1hits[i].rotation = 270;
        P1CardsonTablecontainer.addChild(P1hits[i]);

    }
    P1PlayCardAnimation();
}

function P1PlayCardAnimation(){
    createjs.Tween.get(P1CardsonTablecontainer)
    .to({alpha: 0.5, x: bgheight / 24})
    .to({alpha: 1, x: 0, y: 0}, 400, createjs.Ease.getPowInOut(3));
}

function P2CardsonTable(CardsonTable) {

    P2CardsonTablecontainer.alpha = 0;

    var cardface = new createjs.Bitmap(loader.getResult("2♠"));
    var cardfacewidth = cardface.getBounds().width;

    var P2hits = [];
    var align = ((bgwidth - cardfacewidth) / 2) - ((CardsonTable.length - 1) * bgwidth / 54);
    var count = 0;

    for (let i = 0; i <= CardsonTable.length - 1; i++){
        count += cardfacewidth * 45 / 167;
        P2hits.push(new createjs.Bitmap(loader.getResult(CardsonTable[i])));
        P2hits[i].scale = 0.55;
        P2hits[i].x = align + count;
        P2hits[i].y = bgheight / 4.235
        P2CardsonTablecontainer.addChild(P2hits[i]);

    }
    P2PlayCardAnimation();
}

function P2PlayCardAnimation(){
    createjs.Tween.get(P2CardsonTablecontainer)
    .to({alpha: 0.5, y: bgheight / 24 * -1})
    .to({alpha: 1, x: 0, y: 0}, 400, createjs.Ease.getPowInOut(3));
}

function P3CardsonTable(CardsonTable) {

    P3CardsonTablecontainer.alpha = 0;

    var cardface = new createjs.Bitmap(loader.getResult("2♠"));
    var cardfacewidth = cardface.getBounds().width;

    var P3hits = [];
    // divide by 2.5 but not 2 to leave more room for Player 0 pick cards
    var align = (bgheight - cardfacewidth) / 2.5 - ((CardsonTable.length - 1) * bgheight / 28.8);
    var count = 0;

    //var align = 245 - (CardsonTable.length*20);
    for (let i = 0; i <= CardsonTable.length - 1; i++){
        count += cardfacewidth * 45 / 167;
        P3hits.push(new createjs.Bitmap(loader.getResult(CardsonTable[i])));
        P3hits[i].scale = 0.55;
        P3hits[i].x = bgwidth * 5 / 18;
        P3hits[i].y = align + count;
        P3hits[i].rotation = 90;
        P3CardsonTablecontainer.addChild(P3hits[i]);
    }
    P3PlayCardAnimation();
}

function P3PlayCardAnimation(){
    createjs.Tween.get(P3CardsonTablecontainer)
    .to({alpha: 0.5, x: bgheight / 24 * -1})
    .to({alpha: 1, x: 0, y: 0}, 400, createjs.Ease.getPowInOut(3));
}

function TextPass(PlayerinTurn) {
    //var passtext = new createjs.Text("PASS", "50px Copperplate", "#FFFFFF");
    var passtext = new createjs.Bitmap(loader.getResult("passtext"));

    if (PlayerinTurn == 0) {
        P0CardsonTablecontainer.removeAllChildren();
        P0CardsonTablecontainer.alpha = 0;
    
        passtext.x = (bgwidth - passtext.getBounds().width) / 2;;
        passtext.y = bgheight * 0.56;
        P0CardsonTablecontainer.addChild(passtext);
        P0PlayCardAnimation();

    }

    if (PlayerinTurn == 1) {
        P1CardsonTablecontainer.removeAllChildren();
        P1CardsonTablecontainer.alpha = 0;

        passtext.x = bgwidth * 840 / 1080;
        passtext.y = (bgheight + passtext.getBounds().width) / 2.25;
        passtext.rotation = 270;
        P1CardsonTablecontainer.addChild(passtext);
        P1PlayCardAnimation();
    }

    if (PlayerinTurn == 2) {
        P2CardsonTablecontainer.removeAllChildren();
        P2CardsonTablecontainer.alpha = 0;

        passtext.x = (bgwidth - passtext.getBounds().width) / 2;;
        passtext.y = bgheight * 160 / 720;
        P2CardsonTablecontainer.addChild(passtext);
        P2PlayCardAnimation();
    }

    if (PlayerinTurn == 3) {
        P3CardsonTablecontainer.removeAllChildren();
        P3CardsonTablecontainer.alpha = 0;

        passtext.x = bgwidth * 240 / 1080;
        passtext.y = bgheight / 3 ;
        passtext.rotation = 90;
        P3CardsonTablecontainer.addChild(passtext);
        P3PlayCardAnimation();
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


//Display Player Name
function CreateP0Name(){
    var P0name = new createjs.Bitmap(loader.getResult("P0name"));
    P0name.x = bgwidth *  96 / 1080;
    P0name.y = bgheight * 608 / 720;
    P0name.scale = 0.80;
    P0name.name = "P0name";
    P0NameContainer.addChild(P0name);
}

function CreateP1Name(){
    var P1name = new createjs.Bitmap(loader.getResult("P1name"));
    P1name.x = bgwidth * 900 / 1080;
    P1name.y = bgheight * 30 / 720;
    P1name.scale = 0.80;
    P1name.name = "P1name";
    P1NameContainer.addChild(P1name);
}

function CreateP2Name(){
    var P2name = new createjs.Bitmap(loader.getResult("P2name"));
    P2name.x = bgwidth * 220 / 1080;
    P2name.y = bgheight * 54 / 720;
    P2name.scale = 0.80;
    P2name.name = "P2name";
    P2NameContainer.addChild(P2name);
}

function CreateP3Name(){
    var P3name = new createjs.Bitmap(loader.getResult("P3name"));
    P3name.x = bgwidth * 10 / 1080;
    P3name.y = bgheight * 520 / 720;
    P3name.scale = 0.80;
    P3name.name = "P3name";
    P3NameContainer.addChild(P3name);
}

function CreatePlayerName(){
CreateP0Name();
CreateP1Name();
CreateP2Name();
CreateP3Name();
}

function ClearPlayerName() {
    P0NameContainer.removeAllChildren();
    P1NameContainer.removeAllChildren();
    P2NameContainer.removeAllChildren();
    P3NameContainer.removeAllChildren();
}

function HighlightPlayerName(PlayerinTurn) {
    
    if (PlayerinTurn == 0) {
        P0NameContainer.removeChild(P0NameContainer.getChildByName("P0name"));
        var P0name = new createjs.Bitmap(loader.getResult("P0namehighlighted"));
        P0name.x = bgwidth *  96 / 1080;
        P0name.y = bgheight * 608 / 720;
        P0name.name = "P0namehighlighted";
        P0NameContainer.addChild(P0name);
    }

    if (PlayerinTurn == 1) {
        P1NameContainer.removeChild(P1NameContainer.getChildByName("P1name"));
        var P1name = new createjs.Bitmap(loader.getResult("P1namehighlighted"));
        P1name.x = bgwidth * 890 / 1080;
        P1name.y = bgheight * 30 / 720;
        P1name.name = "P1namehighlighted";
        P1NameContainer.addChild(P1name);
    }

    if (PlayerinTurn == 2) {
        P2NameContainer.removeChild(P2NameContainer.getChildByName("P2name"));
        var P2name = new createjs.Bitmap(loader.getResult("P2namehighlighted"));
        P2name.x = bgwidth * 220 / 1080;
        P2name.y = bgheight * 54 / 720;
        P2name.name = "P2namehighlighted";
        P2NameContainer.addChild(P2name);
    }
    
    if (PlayerinTurn == 3) {
        P3NameContainer.removeChild(P3NameContainer.getChildByName("P3name"));
        var P3name = new createjs.Bitmap(loader.getResult("P3namehighlighted"));
        P3name.x = bgwidth * 10 / 1080;
        P3name.y = bgheight * 520 / 720;
        P3name.name = "P3namehighlighted";
        P3NameContainer.addChild(P3name);
    }  
};

function ClearHighlight(PlayerinTurn) {
    if (PlayerinTurn == 0) {
        P0NameContainer.removeChild(P0NameContainer.getChildByName("P0namehighlighted"));
        CreateP0Name();
    }

    if (PlayerinTurn == 1) {
        P1NameContainer.removeChild(P1NameContainer.getChildByName("P1namehighlighted"));
        CreateP1Name();
    }

    if (PlayerinTurn == 2) {
        P2NameContainer.removeChild(P2NameContainer.getChildByName("P2namehighlighted"));
        CreateP2Name();
    }
    
    if (PlayerinTurn == 3) {
        P3NameContainer.removeChild(P3NameContainer.getChildByName("P3namehighlighted"));
        CreateP3Name();
    } 
}

//3. Create The Hit Button
var ButtonHit = new createjs.Container();
function CreateHitButton(){

    var hitbox = new createjs.Bitmap(loader.getResult("hitbuttondeactivated"));
    hitbox.x = bgwidth * 880 / 1080;
    hitbox.y = bgheight * 525 / 720;
    hitbox.name = "hitbuttondeactivated";
    ButtonHit.addChild(hitbox);
    stage.addChildAt(ButtonHit, 1); 
}


//4. Create The Pass Button
var ButtonPass = new createjs.Container();
function CreatePassButton() {

    var passbox = new createjs.Bitmap(loader.getResult("passbuttondeactivated"));
    passbox.x = bgwidth * 880 / 1080;
    passbox.y = bgheight * 615 / 720;
    passbox.name = "passbuttondeactivated";
    ButtonPass.addChild(passbox);
    stage.addChildAt(ButtonPass, 1); 

}

//Button Activations
HitButtonActivated = false;
PassButtonActivated = false;

function ActivateHitButton() {

    var hitbox = new createjs.Bitmap(loader.getResult("hitbutton"));
    hitbox.x = bgwidth * 880 / 1080;
    hitbox.y = bgheight * 525 / 720;
    hitbox.name = "hitbutton";
    ButtonHit.removeChild(ButtonHit.getChildByName("hitbuttondeactivated"));
    ButtonHit.addChild(hitbox);
    stage.addChildAt(ButtonHit, 1);

    HitButtonActivated = true;
    //console.log("Hit Button: Activated");
}

function ActivatePassButton() {
    //Can only Pass when not in command
    if (Players[0].command == false) {

        var passbox = new createjs.Bitmap(loader.getResult("passbutton"));
        passbox.x = bgwidth * 880 / 1080;
        passbox.y = bgheight * 615 / 720;
        passbox.name = "passbutton";
        ButtonPass.removeChild(ButtonHit.getChildByName("passbuttondeactivated"));
        ButtonPass.addChild(passbox);
        stage.addChildAt(ButtonPass, 1); 
    
        PassButtonActivated = true;
        //console.log("Pass Button: Activated");

    }
}

function DeactivateHitButton() {

    ButtonHit.removeAllEventListeners();
    HitButtonActivated = false;
    //console.log("Hit Button: Deactivated");

    //Delay a little bit for animation
    setTimeout(() => {
        ButtonHit.removeChild(ButtonHit.getChildByName("hitbutton"));
        CreateHitButton()}, 250);
}

function DeactivatePassButton() {

    ButtonPass.removeAllEventListeners(); 
    PassButtonActivated = false;
    //console.log("Pass Button: Deactivated");

    setTimeout(() => {
        ButtonPass.removeChild(ButtonPass.getChildByName("passbutton"));
        CreatePassButton()}, 250);
}

function ClickHitAnimate() {

    ButtonHit.removeChild(ButtonHit.getChildByName("hitbutton"));

    var hitbox = new createjs.Bitmap(loader.getResult("hitbuttonclicked"));
    hitbox.x = bgwidth * 880 / 1080;
    hitbox.y = bgheight * 525 / 720;
    hitbox.name = "hitbuttonclicked";
    ButtonHit.addChild(hitbox);

    setTimeout(() => {
        ButtonHit.removeChild(ButtonHit.getChildByName("hitbuttonclicked"));
        //Reuse ActivateHitButton, but set HitButtonActivated to false
        ActivateHitButton();
        HitButtonActivated = false;
        //console.log("Hit Button: Deactivated");
        }, 50);
}

function ClickPassAnimate() {

    ButtonPass.removeChild(ButtonPass.getChildByName("passbutton"));

    var passbox = new createjs.Bitmap(loader.getResult("passbuttonclicked"));
    passbox.x = bgwidth * 880 / 1080;
    passbox.y = bgheight * 615 / 720;
    passbox.name = "passbuttonclicked";
    ButtonPass.addChild(passbox);

    setTimeout(() => {
        ButtonPass.removeChild(ButtonPass.getChildByName("passbuttonclicked"));
        ActivatePassButton();
        PassButtonActivated = false;
        //console.log("Pass Button: Deactivated");
        }, 50);
}

//5. Create the Start Button
var ButtonStart = new createjs.Container();

function CreatStartButton(ScreenContainer){
    var startbox = new createjs.Bitmap(loader.getResult("startbutton"));
    startbox.x = 
    (ScreenContainer.getBounds().width - startbox.getBounds().width) / 1.25;
    startbox.y = 
    (ScreenContainer.getBounds().height - startbox.getBounds().height) / 1.4;
    startbox.name = "startbutton";
    ButtonStart.addChild(startbox);
}

function ClickStartAnimate(ScreenContainer) {

    ButtonStart.removeChild(ButtonStart.getChildByName("startbutton")) 

    var startbox = new createjs.Bitmap(loader.getResult("startbuttonclicked"));
    startbox.x = 
    (ScreenContainer.getBounds().width - startbox.getBounds().width) / 1.25;
    startbox.y = 
    (ScreenContainer.getBounds().height - startbox.getBounds().height) / 1.4;
    startbox.name = "startbuttonclicked";
    ButtonStart.addChild(startbox);

    setTimeout(() => {
        ButtonStart.removeChild(ButtonStart.getChildByName("startbuttonclicked"));
        CreatStartButton(ScreenContainer)}, 100);
}

//6. Game Flow: Start Game
function ClickStart(ScreenContainer) {
    ButtonStart.addEventListener("click", function() { 

        //Graphics
        //Deactiviate Start Button untill end game 
        ButtonStart.removeAllEventListeners();
        ClickStartAnimate(ScreenContainer);

        if (WinnerScreenContainer.children.length !== 0) {
            InitTableDisplay();
            QuitScreenAnimate(WinnerScreenContainer);
            setTimeout(() => {
                ButtonStart.removeAllChildren();
                RemoveWinnerScreen()}, 1000);
        } 
    
    
        if (StartScreenContainer.children.length !== 0) {
            QuitScreenAnimate(StartScreenContainer);
    
            setTimeout(() => {
                ButtonStart.removeAllChildren();
                RemoveStartScreen()}, 1000);
        }
    
        CreateHitButton();
        CreatePassButton();
        CreatePlayerName();
        //
    
        StartGame();
        
        AddPlayer();
    
        DealCard();
    
        PositionArray = [Players[0], Players[1], Players[2], Players[3]];
    
        FindDiamond3();
    
        console.log("Position Array: ", PositionArray)
    
        PlayerinTurn = PositionArray[0].id;
        PositionArray[0].turn = true;
        Round = 0;
        
        //Graphics: Display Cards and Acitvate Button
        
        //May have to set alpha of Player Containers to zero for animation
        DisplayHandCount(
            Players[1].hand.length,
            Players[2].hand.length,
            Players[3].hand.length);
        DisplayP0Hand(Players[0].hand);
        DealCardAnimate();
    
        HighlightPlayerName(PlayerinTurn);
        P0SelectedCards();
    
        if (Players[PlayerinTurn].id == 0) {
            HitActivateListener ();
            ActivatePassButton();
            ButtonPass.addEventListener("click", function(event) {
                if (PlayerinTurn == 0) {
                    ClickPassAnimate();
                    Pass(PlayerinTurn);
                }
            });
        }
        //
    
        Players.forEach(element => {console.log(element);});
    
        //AI Update Analysis
        Players[PlayerinTurn].ai.UpdateCardsonTable(
            Round, Players[PlayerinTurn].command, CardsonTable, CardsonTableRanking);
        
        //AI Start running if not Player 0
        if (Players[PlayerinTurn].id !== 0) {
            setTimeout(() => { AIPlay(PlayerinTurn, Analyze(PlayerinTurn))}, 2000);
        } else {
        //Analyze for Player 0 if not AI turn
        Analyze(PlayerinTurn);
        }
    
    })
}

ClickStart(StartScreenContainer);

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
    console.log("Hand Counts:", handcounts);

    Players[PlayerinTurn].analytics.AnalyzeHand(
        Players[PlayerinTurn].hand, 
        handcounts[0], handcounts[1], handcounts[2]);

    var cardsselected = Players[PlayerinTurn].ai.PickCards(
        handcounts[0], handcounts[1], handcounts[2]);

    console.log("Player in Turn: ", Players[PlayerinTurn].ai);
    console.log("AI Pick: ", cardsselected);

    return cardsselected;

}

//7. Game Flow: Playing Cards ot Pass
function PlayCard(i) {

    if (Players[i].turn === true) {

        CardsSelected = [];

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
            for (let j = CardsSelected.length -1; j >= 0; j--) {
                for (let l = Players[i].hand.length - 1; l >= 0; l--) {

                    if(CardsSelected[j].cardranking == Players[i].hand[l].cardranking){
                        Players[i].hand.splice(l, 1);    
                    }
                }
            }
            
            //Change Command position
            Players[PlayerinCommand].command = false;
            PlayerinCommand = i;
            Players[i].command = true
         
            
            //If Selected Card matches the rules
            CardsonTable = CardsonTable.concat(CardsSelected);
            CardsonTableRanking = rule.CardsontheTableRanking(CardsSelected);
            console.log("CardsonTableRanking: ", CardsonTableRanking);

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
                for (let j = CardsSelected.length -1; j >= 0; j--) {
                    for (let l = Players[i].hand.length - 1; l >= 0; l--) {

                        if(CardsSelected[j].cardranking == Players[i].hand[l].cardranking){
                            Players[i].hand.splice(l, 1);    
                        }
                    }
                }
                
                //Change Command position
                Players[PlayerinCommand].command = false;
                PlayerinCommand = i;
                Players[i].command = true
        
                
                //If Selected Card matches the rules
                CardsonTable = CardsonTable.concat(CardsSelected);
                CardsonTableRanking = rule.CardsontheTableRanking(CardsSelected);
                console.log("CardsonTableRanking: ", CardsonTableRanking);

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
        return alert("BUGGED")
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
        Players[PlayerinTurn].command = true;
              
        //If Selected Card matches the rules
        CardsonTable = CardsonTable.concat(CardsSelected);
        CardsonTableRanking = rule.CardsontheTableRanking(CardsSelected);
        console.log("CardsonTableRanking: ", CardsonTableRanking);

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

        console.log("Cards on Table: ", CardsonTable);

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

function ActivateHitConditions(P0selectedcards, CardsonTable) {

    var pickcardcheck = [];
    //Create a new array of cards for comparison   
    for (let j = P0selectedcards.length -1; j >= 0; j--){

        var pickcard = [...Players[0].hand].splice(P0selectedcards[j],1);
        pickcardcheck = pickcardcheck.concat(pickcard);
    }

    pickcardcheck.sort((a, b) => a.cardranking - b.cardranking);

    //Deactivate Hit if no card picked
    if ((pickcardcheck.length == 0) && (HitButtonActivated == true)) {
        DeactivateHitButton();
        return;  
    }

    //Control Hit Button for first Round
    if ((pickcardcheck.length !== 0) && (Round == 0)) {

        if ((rule.ValidFirstCommand(pickcardcheck) == true) &&
        ((HitButtonActivated == false))) {
                ActivateHitButton();
                ButtonHit.addEventListener("click", function(event) {
                    if (PlayerinTurn == 0) {
                        ClickHitAnimate();
                        PlayCard(PlayerinTurn);
                    }
                });
                return;  
        }

        if ((rule.ValidFirstCommand(pickcardcheck) == false) &&
        ((HitButtonActivated == true))) {
                DeactivateHitButton();
                return;  
        }
    } 

    //Control Hit Button after first Round
    if (Round > 0){

        // If Play in Command or hit is valid
        if (((Players[0].command == true) &&
        (rule.ValidCommand(pickcardcheck) == true)) ||
        ((Players[0].command == false) &&
        (rule.ValidHit(pickcardcheck, CardsonTable) == true))) {
                
            if(HitButtonActivated == false) {
                ActivateHitButton();
                ButtonHit.addEventListener("click", function(event) {
                    if (PlayerinTurn == 0) {
                        ClickHitAnimate();
                        PlayCard(PlayerinTurn);
                    }
                });
                return;
            }
        }

        // If Play in Command or hit is valid
        if (((Players[0].command == true) &&
        (rule.ValidCommand(pickcardcheck) == false)) ||
        ((Players[0].command == false) &&
        (rule.ValidHit(pickcardcheck, CardsonTable) == false))) {
            
            if(HitButtonActivated == true) {
                DeactivateHitButton();
                return;
            }
        }
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
            ClearTableDisplay();
            AddWinnerScreen();
            WinnerText(PlayerinTurn);
            CreatStartButton(WinnerScreenContainer);
            WinnerScreenContainer.addChild(ButtonStart);
            ShowScreenAnimate(WinnerScreenContainer); 
        }, 1250)

        setTimeout(() => {
            P0container.removeAllChildren();
            P1container.removeAllChildren();
            P2container.removeAllChildren();
            P3container.removeAllChildren();
            ButtonHit.removeAllChildren();
            ButtonPass.removeAllChildren(); 
            ClearPlayerName();
            ClearCardsonTable(); 
            ClickStart(WinnerScreenContainer);
        }, 2500);
    }
}

function ClearTableDisplay(){
    var cleararray = [P0container, P1container, P2container, P3container,
        ButtonHit, ButtonPass, P0NameContainer, P1NameContainer,
        P2NameContainer, P3NameContainer, P0CardsonTablecontainer,
        P1CardsonTablecontainer,P2CardsonTablecontainer, P3CardsonTablecontainer];

    for (let i = 0; i <= cleararray.length - 1; i++) {
        if (cleararray[i].children.length !== 0){
            createjs.Tween.get(cleararray[i])
            .to({alpha: 0}, 1000, createjs.Ease.getPowInOut(3));
        }
    }
}

function InitTableDisplay(){
    var displayarray = [P0container, P1container, P2container, P3container,
        ButtonHit, ButtonPass, P0NameContainer, P1NameContainer,
        P2NameContainer, P3NameContainer, P0CardsonTablecontainer,
        P1CardsonTablecontainer,P2CardsonTablecontainer, P3CardsonTablecontainer];

    for (let i = 0; i <= displayarray.length - 1; i++) {
        if (displayarray[i].alpha == 0){
                displayarray[i].alpha = 1;
        }
    }
}

function EndTurn(i) {

    //Graphics: Deactivate Buttons and Highlight
    if (PlayerinTurn == 0) {
        DeactivateHitButton();
        DeactivatePassButton();
    }

    ClearHighlight(PlayerinTurn);
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
    HighlightPlayerName(PlayerinTurn);

    if (PlayerinTurn == 0) {
        //Run Hit Activation test once just in case cards selected prior to P0's turn
        ActivateHitConditions(P0selectedcards, CardsonTable);

        HitActivateListener();
        ActivatePassButton();
        ButtonPass.addEventListener("click", function(event) {
            if (PlayerinTurn == 0) {
                ClickPassAnimate();
                Pass(PlayerinTurn);
            }
        });
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
