const Suits = {
    0: "♦",
    1: "♣",
    2: "♥",
    3: "♠" 
  };

const Ranks = {
    0: "3",
    1: "4",
    2: "5",
    3: "6",
    4: "7",
    5: "8",
    6: "9",
    7: "10",
    8: "J",
    9: "Q",
    10: "K",
    11: "A",
    12: "2"
  };
 
  class Card {
      constructor(name, suit, value, cardranking) {
          this.name = name + suit;
          this.suit = suit;
          this.value = value;
          this.cardranking = cardranking
      }
  }


  //Class Deck
export default class Deck {
  constructor() {
    this.cards = getDeck();
  }

  get cardsleft() {
    return this.cards.length;
  }

  draw() {
    return this.cards.shift();
  }

  shuffle(){
    for (let i = this.cardsleft - 1; i > 0; i--){
        const newIndex = Math.floor(Math.random() * (i + 1));
        const oldValue = this.cards[newIndex];
        this.cards[newIndex] = this.cards[i];
        this.cards[i] = oldValue
    }
  }
}

export function getDeck() {

  var cards = [];
  var cardranking = 0;

  for(var x = 0; x < 13; x++){

    for(var i = 0; i < 4; i++){
      
      cardranking++;
      cards.push(new Card(Ranks[x], Suits[i], x, cardranking))

    }
  }

  return cards
}



//Test
//var Deck1 = new Deck();

//Deck1.shuffle()

//console.log(Deck1.cards)