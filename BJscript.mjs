import Deck from './deck.mjs'

//1. Mapping Card Values

const CARD_VALUE_MAP = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 10,
    "Q": 10,
    "K": 10,
    "A": 1,
}


//2. Define Divs

const computerCardSlot1 = document.querySelector(".computer-card-slot1")
const computerCardSlot2 = document.querySelector(".computer-card-slot2")
const computerCardSlot3 = document.querySelector(".computer-card-slot3")
const computerCardSlot4 = document.querySelector(".computer-card-slot4")
const computerCardSlot5 = document.querySelector(".computer-card-slot5")
const dealDeck = document.querySelector(".deal-deck")
const text = document.querySelector(".text")
const playerCardSlot1 = document.querySelector(".player-card-slot1")
const playerCardSlot2 = document.querySelector(".player-card-slot2")
const playerCardSlot3 = document.querySelector(".player-card-slot3")
const playerCardSlot4 = document.querySelector(".player-card-slot4")
const playerCardSlot5 = document.querySelector(".player-card-slot5")

const startbtn = document.createElement("button");
startbtn.innerText = "Start";
startbtn.style.fontFamily = "Copperplate";
startbtn.style.color = "red";
startbtn.style.height = "100%";
startbtn.style.width = "100%";

const hitbtn = document.createElement("button");
hitbtn.innerText = "Hit"
hitbtn.style.fontFamily = "Copperplate";
hitbtn.style.color = "black";
hitbtn.style.height = "100%";
hitbtn.style.width = "100%";

const standbtn = document.createElement("button");
standbtn.innerText = "Stand"
standbtn.style.fontFamily = "Copperplate";
standbtn.style.color = "black";
standbtn.style.height = "100%";
standbtn.style.width = "100%";

const StartButton = document.querySelector(".start-button")
const HitButton = document.querySelector(".hit-button")
const StandButton = document.querySelector(".stand-button")

StartButton.appendChild(startbtn)
HitButton.appendChild(hitbtn)
StandButton.appendChild(standbtn)


//3. Define Variables

var DrawDeck, hitcount, computerhitcount, playeraceflip, computeraceflip

var playerCard3, playerCard4, playerCard5
var playerCard = [playerCard3, playerCard4, playerCard5]
var playerCardSlot = [playerCardSlot3, playerCardSlot4, playerCardSlot5]

var computerCard3, computerCard4, computerCard5
var computerCard = [computerCard3, computerCard4, computerCard5]
var computerCardSlot = [computerCardSlot3, computerCardSlot4, computerCardSlot5]

var PlayerPoints = 0
var ComputerPoints = 0


//4. Define Button Clicking Events

StartButton.addEventListener("click", () => {

    startGame()

    flipCards()

})


    //Click Hit Button to draw another card
HitButton.addEventListener("click", () => {

    hit()
})


    //Click Stand Button to wait for result
StandButton.addEventListener("click", () => {
    
    hitbtn.disabled = true
    standbtn.disabled = true

    //Cover computerCardSlot1
    computerCardSlot1.classList.replace("cover", "card-slot")
    document.querySelector(".card").classList.replace("covercardred", "red")
    document.querySelector(".card").classList.replace("covercardblack", "black")


    DealerTurn()

    isRoundWinner(PlayerPoints, ComputerPoints)

    if (isRoundWinner(PlayerPoints, ComputerPoints) || ComputerPoints > 21) {
        text.innerText = " YOU WIN"

    } else if (isRoundWinner(ComputerPoints, PlayerPoints) && ComputerPoints <= 21) {
        text.innerText = " YOU LOSE"

    } else {
        text.innerText = "Draw"
    }
    
    console.log("Player = " + PlayerPoints, "Computer = " + ComputerPoints)

})


//5. Game Functions

    //Initialize Setting
function startGame() {
    const deck = new Deck()
    deck.shuffle()

    DrawDeck = deck
    hitbtn.disabled = false
    standbtn.disabled = false

    PlayerPoints = 0
    ComputerPoints = 0
    hitcount = 0
    computerhitcount = 0
    playeraceflip = 0
    computeraceflip = 0

    cleanBeforeRound()
}

    //Clear all slots
function cleanBeforeRound() {
    computerCardSlot1.innerHTML = ''
    computerCardSlot2.innerHTML = ''
    computerCardSlot3.innerHTML = ''
    computerCardSlot4.innerHTML = ''
    computerCardSlot5.innerHTML = ''
    playerCardSlot1.innerHTML = ''
    playerCardSlot2.innerHTML = ''
    playerCardSlot3.innerHTML = ''
    playerCardSlot4.innerHTML = ''
    playerCardSlot5.innerHTML = ''
    text.innerText = ''

    UpdateDeckCount()

}

    //Update Deck Count
function UpdateDeckCount() {
    dealDeck.innerText = DrawDeck.numberOfCards
}

    //Draw the first 2 Cards
function flipCards() {

    const computerCard1 = DrawDeck.pop()
    const computerCard2 = DrawDeck.pop()
    const playerCard1 = DrawDeck.pop()
    const playerCard2 = DrawDeck.pop()

    computerCardSlot1.appendChild(computerCard1.getHTML())
    computerCardSlot2.appendChild(computerCard2.getHTML())
    playerCardSlot1.appendChild(playerCard1.getHTML())
    playerCardSlot2.appendChild(playerCard2.getHTML())

    UpdateDeckCount()

    //Cover computerCardSlot1
    computerCardSlot1.classList.replace("card-slot", "cover")
    document.querySelector(".card").classList.replace("red", "covercardred")
    document.querySelector(".card").classList.replace("black", "covercardblack")

    let Points = CARD_VALUE_MAP[playerCard1.value] + CARD_VALUE_MAP[playerCard2.value]
    let Computer = CARD_VALUE_MAP[computerCard1.value] + CARD_VALUE_MAP[computerCard2.value]

    // Debug for drawing Ace in first 2 cards
    if(CARD_VALUE_MAP[playerCard1.value] == 1 || CARD_VALUE_MAP[playerCard2.value] ==1){
        if (Points < 12) {
            Points += 10
            playeraceflip++
        }
    }

    if(CARD_VALUE_MAP[playerCard1.value] == 1 && CARD_VALUE_MAP[playerCard2.value] ==1){

        Points -=10
        playeraceflip++

    }


    if (CARD_VALUE_MAP[computerCard1.value] == 1 || CARD_VALUE_MAP[computerCard2.value] == 1) {
        if (Computer < 12) {
            Computer += 10
            computeraceflip++
        }
    }

    if (CARD_VALUE_MAP[computerCard1.value] == 1 && CARD_VALUE_MAP[computerCard2.value] == 1) {
        
        Computer -=10
        computeraceflip++

    }

    //Update score for player and computer
    UpdatePlayerPoints(Points)
    UpdateComputerPoints(Computer)

    console.log("Player = " + PlayerPoints, "Computer = ?", "playeraceflip= " + playeraceflip)

    //Player Win if obtain Blackjack
    if(PlayerPoints === 21) {
        text.innerText = " YOU WIN"
        hitbtn.disabled = true
        standbtn.disabled = true
        console.log("Player = " + PlayerPoints, "Computer = " + ComputerPoints)
    }
}


    //Update Points after any action, also consider the ACE situation
function UpdatePlayerPoints(Points) {

    PlayerPoints += Points

    //If ace has been drawn once
    if (playeraceflip >= 1 && playeraceflip < 2) {
        
        // Change all Ace to 1 if ace is already drawn
        if(Points == 1) {

            PlayerPoints -= 10
            playeraceflip++

        // Change Ace to 1 if the total point > 21 after drawing
        } else if (PlayerPoints > 21) {

            PlayerPoints -= 10
            playeraceflip++  
        }

    // If ace is drawn first time
    } else if (Points == 1) {

        PlayerPoints += 10
        playeraceflip++

        //Change the ace to 1 if using ace as 11 will bust
        if (PlayerPoints > 21) {

            PlayerPoints -= 10
            playeraceflip++

        }
    }
}

    //Update Points after any action, also consider the ACE situation
function UpdateComputerPoints(Computer) {

    ComputerPoints += Computer

        //If ace has been drawn once
    if (computeraceflip >= 1 && computeraceflip < 2) {
        
        // Change all Ace to 1 if ace is already drawn
        if(Computer == 1) {

            ComputerPoints -= 10
            computeraceflip++

        // Change Ace to 1 if the total point > 21 after drawing
        } else if (ComputerPoints > 21) {

            ComputerPoints -= 10
            computeraceflip++  
        }

    // If ace is drawn first time
    } else if (Computer == 1) {

        ComputerPoints += 10
        computeraceflip++

        //Change the ace to 1 if using ace as 11 will bust
        if (ComputerPoints > 21) {

            ComputerPoints -= 10
            computeraceflip++

        }
    }
}

    //Draw Card
function hit() {
    
    if (hitcount <= 2) {

        playerCard[hitcount] = DrawDeck.pop()
        playerCardSlot[hitcount].appendChild(playerCard[hitcount].getHTML())
        UpdateDeckCount()

        //Add current card to Total Points before proceed
        let Points = CARD_VALUE_MAP[playerCard[hitcount].value]
        UpdatePlayerPoints(Points)
        console.log("Player = " + PlayerPoints, "Computer = ?", "playeraceflip = " + playeraceflip )

        CheckValue()
        hitcount++

    } else {
        alert("Can't Hit Anymore!")
    }
}

    //Result when Stand is Clicked
function isRoundWinner(PlayerPoints, ComputerPoints) {
    return PlayerPoints > ComputerPoints
}

    //Check if Busted
function CheckValue() {
    if (PlayerPoints > 21) {
        text.innerText = "BUSTED"
        hitbtn.disabled = true
        standbtn.disabled = true      
    }
}

    //Computer Rule of Stand if 17 or more
function DealerTurn() {
    for (ComputerPoints <= 17; ComputerPoints <= 17; ) {

        if (computerhitcount <= 2){
            
            computerCard[computerhitcount] = DrawDeck.pop()
            computerCardSlot[computerhitcount].appendChild(computerCard[computerhitcount].getHTML())
            UpdateDeckCount()
    
            //Add current card to Total Points before proceed
            let Computer = CARD_VALUE_MAP[computerCard[computerhitcount].value]
    
            
            UpdateComputerPoints(Computer)
            console.log("Player = " + PlayerPoints, "Computer = " + ComputerPoints)

            //Exit process if computer is busted
            if (ComputerPoints > 21) {
                break
            }
            computerhitcount++ 
        }

            // Exit process if 5 cards are drawn by still haven't reach 17
        if (hitcount > 2 && ComputerPoints <= 17) {
            break
        }

    }
}


