import Deck from './deck.mjs';
import Rules from './rules.mjs';
import Analytics from './analytics.mjs';


export default class AI {
    constructor(PlayerID, PlayerAnalytics) {
        this.id = PlayerID;
        this.rules = new Rules();
        this.analytics = PlayerAnalytics;
        this.round = null;
        this.cardsontable = null;
        this.cardsontableranking = null;
        this.command = false
        this.cardselected = [];
        this.commandrate = null;
        this.urgent = new Analytics(PlayerID);
    }

    UpdateCardsonTable(Round, Command ,CardsonTable, CardsonTableRanking) {
        this.round = Round;
        this.command = Command;
        this.cardsontable = CardsonTable;
        this.cardsontableranking = CardsonTableRanking;
    }


    //Part 1. Playing Style Components

    //Play lowest ranking combination 5 -> 3 -> 2 -> 1
    Broom() {

        if (this.round !== 0) {

            var handcombinationsum = 0;
            for (let i = this.analytics.analyzedhand.length - 1; i >= 0; i--){
                for (let j = this.analytics.analyzedhand[i].length - 1; j >= 0; j--)
                handcombinationsum += this.analytics.analyzedhand[i][j].length
            }
            //console.log("handcombinationsum", handcombinationsum);

            //If you can directly end the game
            for (let i = this.analytics.analyzedhand.length - 1; i >= 0; i--){
                if (this.analytics.analyzedhand[i][0].length !== 0){

                    var combinations = this.analytics.analyzedhand[i][0];

                    for (let k = combinations.length - 1; k >= 0; k--) {

                        //you can play the highest combination and then one more hand
                        if ((combinations[k][3] == 1) &&
                        (handcombinationsum <= 2)) {
                            //console.log("Broom | End Game Broom")
                            this.commandrate = combinations[k][3];
                            return combinations[k][0];
                        }
                    }
                }
            }

            for (let i = this.analytics.analyzedhand.length - 1; i >= 0; i--){
                if (this.analytics.analyzedhand[i][0].length !== 0){
                    
                    this.commandrate = this.analytics.analyzedhand[i][0][0][3];
                    return this.analytics.analyzedhand[i][0][0][0];
                }
            }
        }

        //Account for the '3♦' situation for the first player
        if(this.round == 0) {
            for (let i = this.analytics.analyzedhand.length - 1; i >= 0; i--){
                if (this.analytics.analyzedhand[i][0].length !== 0){

                    var combinations = this.analytics.analyzedhand[i][0];

                    for (let k = combinations.length - 1; k >= 0; k--) {
                        for (let j = 0; j <= combinations[k][0].length - 1; j++){

                            if (combinations[k][0][j].cardranking == 1){
                                this.commandrate = combinations[k][3];
                                return combinations[k][0];
                            }
                        }
                    }
                }
            }
        }
        return [];
    }

    //Play highest ranking combination 5 -> 3 -> 2 -> 1
    StopLoss() {

        for (let i = this.analytics.analyzedhand.length - 1; i >= 0; i--){
            if (this.analytics.analyzedhand[i][0].length !== 0){

                let last = this.analytics.analyzedhand[i][0].length - 1;
                this.commandrate = this.analytics.analyzedhand[i][0][last][3];
                return this.analytics.analyzedhand[i][0][last][0];
            }
        }
        return [];
    }

    //Play lowest valid ranking combination when follow
    Follow() {

        if ((this.cardsontable.length == 1) &&
        (this.analytics.analyzedhand[0][0].length !== 0)) {

            let singles = this.analytics.analyzedhand[0][0];

            for (let i = 0; i <= singles.length - 1; i++) {
                if (singles[i][2] > this.cardsontableranking){

                    //Account for the end game 2 singles scenario
                    //If can end game with the highest card then play higest card
                    if ((this.analytics.rawhand.length == 2) &&
                    (this.analytics.analyzedhand[0][0][i][3] == 1)){
                        //console.log("Follow | End Game");
                        this.commandrate = this.analytics.analyzedhand[0][0][i][3];
                        return this.analytics.analyzedhand[0][0][i][0];
                    }


                    //If you expect other player to play urgent()
                    if ((this.analytics.rawhand.length == 2) &&
                    //Meaning that it's the higher but not largest card
                    (i == 1) && (this.analytics.analyzedhand[0][0][i][3] !== 1)) {

                        //If smaller card playable play smaller card
                        if(singles[0][2] > this.cardsontableranking){
                            this.commandrate = this.analytics.analyzedhand[0][0][i][3];
                            return this.analytics.analyzedhand[0][0][i][0];
                        }
                        //If smaller card not playable then pass
                        //console.log("Follow | Hold for Urgent");
                        return [];
                    }

                    this.commandrate = this.analytics.analyzedhand[0][0][i][3];
                    return this.analytics.analyzedhand[0][0][i][0];
                }
            }
        }

        if ((this.cardsontable.length == 2) &&
        (this.analytics.analyzedhand[1][0].length !== 0)) {

            let pairs = this.analytics.analyzedhand[1][0];

            for (let i = 0; i <= pairs.length - 1; i++) {
                if (pairs[i][2] > this.cardsontableranking){
                    this.commandrate = this.analytics.analyzedhand[1][0][i][3];
                    return this.analytics.analyzedhand[1][0][i][0];
                }
            }
        }

        if ((this.cardsontable.length == 3) &&
        (this.analytics.analyzedhand[2][0].length !== 0)) {

            let threes = this.analytics.analyzedhand[2][0];

            for (let i = 0; i <= threes.length - 1; i++) {
                if (threes[i][2] > this.cardsontableranking){
                    this.commandrate = this.analytics.analyzedhand[2][0][i][3];
                    return this.analytics.analyzedhand[2][0][i][0];
                }
            }
        }

        if ((this.cardsontable.length == 5) &&
        (this.analytics.analyzedhand[3][0].length !== 0)) {
            
            let fives = this.analytics.analyzedhand[3][0];

            //console.log("AI cardsontableranking: ", this.cardsontableranking);

            for (let i = 0; i <= fives.length - 1; i++) {
                if (fives[i][2] > this.cardsontableranking){
                    this.commandrate = this.analytics.analyzedhand[3][0][i][3];
                    return this.analytics.analyzedhand[3][0][i][0];
                }
            }
        }

        return [];
    }

    //Play lowest valid COMMANDER combination when follow
    Strike() {

        if ((this.cardsontable.length == 1) &&
        (this.analytics.analyzedhand[0][0].length !== 0)) {

            let singles = this.analytics.analyzedhand[0][0];

            for (let i = 0 ; i <= singles.length - 1; i++) {
                if ((singles[i][2] > this.cardsontableranking) &&
                (singles[i][3] >= 0.9)){

                    //Account for the end game 2 singles scenario

                    //If can end game with the highest card then play higest card
                    if ((this.analytics.rawhand.length == 2) &&
                    (this.analytics.analyzedhand[0][0][i][3] == 1)){
                        //console.log("Strike | End Game");
                        this.commandrate = this.analytics.analyzedhand[0][0][i][3];
                        return this.analytics.analyzedhand[0][0][i][0];
                    }

                    //in which you expect other player to play urgent()
                    if ((this.analytics.rawhand.length == 2) &&
                    //Meaning that it's the higher but not largest card
                    (i == 1) && (this.analytics.analyzedhand[0][0][i][3] !== 1)) {

                        //If smaller card playable play smaller card
                        if(singles[0][2] > this.cardsontableranking){
                            this.commandrate = this.analytics.analyzedhand[0][0][0][3];
                            //console.log("Strike | Play Lower First");
                            return this.analytics.analyzedhand[0][0][0][0];
                        }
                        //If smaller card not playable then pass
                        //console.log("Strike | Hold for Urgent");
                        return [];
                    }

                    this.commandrate = this.analytics.analyzedhand[0][0][i][3];
                    return this.analytics.analyzedhand[0][0][i][0];
                }
            }
        }

        if ((this.cardsontable.length == 2) &&
        (this.analytics.analyzedhand[1][0].length !== 0)) {

            let pairs = this.analytics.analyzedhand[1][0];

            for (let i = 0 ; i <= pairs.length - 1; i++) {
                if ((pairs[i][2] > this.cardsontableranking) &&
                (pairs[i][3] >= 0.9)){
                    this.commandrate = this.analytics.analyzedhand[1][0][i][3];
                    return this.analytics.analyzedhand[1][0][i][0];
                }
            }
        }

        if ((this.cardsontable.length == 3) &&
        (this.analytics.analyzedhand[2][0].length !== 0)) {

            let threes = this.analytics.analyzedhand[2][0];

            for (let i = 0 ; i <= threes.length - 1; i++) {
                if ((threes[i][2] > this.cardsontableranking) &&
                (threes[i][3] >= 0.9)){
                    this.commandrate = this.analytics.analyzedhand[2][0][i][3];
                    return this.analytics.analyzedhand[2][0][i][0];
                }
            }
        }

        if ((this.cardsontable.length == 5) &&
        (this.analytics.analyzedhand[3][0].length !== 0)) {
            
            let fives = this.analytics.analyzedhand[3][0];

            for (let i = 0 ; i <= fives.length - 1; i++) {
                if ((fives[i][2] > this.cardsontableranking) &&
                (fives[i][3] >= 0.9)){
                    this.commandrate = this.analytics.analyzedhand[3][0][i][3];
                    return this.analytics.analyzedhand[3][0][i][0];
                }
            }
        }

        return [];
    }

    //Split Command Rate = 1 cards to gain command 
    Split() {
        
        var urgentrawhand = [];
        var urgentcombinations = [];

        //Split Pairs and Threes into Singles to execute Killer 
        if (this.cardsontable.length == 1) {

            var pairs = this.analytics.analyzedhand[1][0];
            var threes = this.analytics.analyzedhand[2][0];

            if(pairs.length !== 0){
                for (let i = pairs.length - 1; i >= 0; i--) {

                    //If absolute command combination is found
                    if(pairs[i][3] == 1) {

                        //Perform Strike() by pushing the lower card of Pair;
                        urgentrawhand.push(pairs[i][0][0]);
                        urgentcombinations = this.urgent.SingleCombinations(urgentrawhand);

                        //Check if can hit
                        if (urgentcombinations[0][2] > this.cardsontableranking){
                            this.commandrate = urgentcombinations[0][3];
                            //console.log("Follow / Strike | Split");
                            return urgentcombinations[0][0];
                        }

                    }
                }
            }

            //If no Pairs to split then check Threes
            if(threes.length !== 0){
                for (let i = threes.length - 1; i >= 0; i--) {

                    //If absolute command combination is found
                    if(threes[i][3] == 1) {

                        //Perform Strike() by pushing the lower card of Pair;
                        urgentrawhand.push(threes[i][0][0]);
                        urgentcombinations = this.urgent.SingleCombinations(urgentrawhand);

                        //Check if can hit
                        for (let j = 0 ; j <= urgentcombinations.length - 1; j++) {
                            if (urgentcombinations[j][2] > this.cardsontableranking){

                                this.commandrate = urgentcombinations[j][3];
                                //console.log("Follow / Strike | Split");
                                return urgentcombinations[j][0];
                            }
                        }
                    }
                }
            }            
        }

        //Split Threes into Pairs to execute Killer 
        if (this.cardsontable.length == 2) {

            var threes = this.analytics.analyzedhand[2][0];

            if(threes.length !== 0){
                for (let i = threes.length - 1; i >= 0; i--) {

                    //If absolute command combination is found
                    if(threes[i][3] == 1) {

                        //Perform Strike() by pushing the lower card of Pair;
                        urgentrawhand.push(threes[i][0][0], threes[i][0][1]);
                        var urgentcardsbyvalue = this.urgent.CardsByValue(urgentrawhand);
                        urgentcombinations = this.urgent.PairCombinations(urgentrawhand, urgentcardsbyvalue);

                        //Check if can hit
                        for (let j = 0 ; j <= urgentcombinations.length - 1; j++) {
                            if (urgentcombinations[j][2] > this.cardsontableranking){
                                this.commandrate = urgentcombinations[j][3];
                                //console.log("Follow / Strike | Split");
                                return urgentcombinations[j][0];
                            }
                        }

                    }
                }
            } 
        }
        //console.log("Split Check Returns no possbility")
        return [];
        
    }


    //Analyze highest possible follow hit according to CardsonTable length
    Urgent() {

        var urgentrawhand = [...this.analytics.rawhand];

        var urgentcardsbyvalue = 
        this.urgent.CardsByValue(urgentrawhand);

        var urgentcardsbysuit = 
        this.urgent.CardsBySuit(urgentrawhand);

        var urgentpaircombinations = 
        this.urgent.PairCombinations(urgentrawhand, urgentcardsbyvalue);

        var urgentcombinations = [];

        //Only consider highest combination matched with CardsonTable's length
        if (this.cardsontable.length == 1) {

            urgentcombinations = this.urgent.SingleCombinations(urgentrawhand);
            
            for (let i = urgentcombinations.length - 1; i >= 0; i --){
                if (urgentcombinations[i][2] > this.cardsontableranking) {
                    this.commandrate = urgentcombinations[i][3];
                    return urgentcombinations[i][0];
                }
            }
        }

        if (this.cardsontable.length == 2) {

            urgentcombinations = urgentpaircombinations;

            for (let i = urgentcombinations.length - 1; i >= 0; i --){
                if (urgentcombinations[i][2] > this.cardsontableranking) {
                    this.commandrate = urgentcombinations[i][3];
                    return urgentcombinations[i][0];
                }
            }
        }

        if (this.cardsontable.length == 3) {

            urgentcombinations = this.urgent.ThreeCombinations(
                urgentrawhand, urgentcardsbyvalue);

            for (let i = urgentcombinations.length - 1; i >= 0; i --){
                if (urgentcombinations[i][2] > this.cardsontableranking) {
                    this.commandrate = urgentcombinations[i][3];
                    return urgentcombinations[i][0];
                }
            }
        }

        if (this.cardsontable.length == 5) {

            var urgentstraightcombinations = this.urgent.StraightCombinations(
            urgentrawhand, urgentcardsbyvalue);

            var urgentflushcombinations = 
            this.urgent.FlushCombinations(urgentrawhand, urgentcardsbysuit);
    
            var urgentfullhousecombinations = 
            this.urgent.FullHouseCombinations(urgentrawhand, urgentcardsbyvalue, 
            urgentpaircombinations);
    
            var urgentfourofkindcombinations = 
            this.urgent.FourofKindCombinations(urgentrawhand, urgentcardsbyvalue);
    
            var urgentroyalflushcombinations = 
            this.urgent.RoyalFlushCombinations(urgentrawhand, urgentcardsbysuit);
    
            var urgentfivecombinations = 
            this.urgent.FiveCombinations(urgentstraightcombinations, 
                urgentflushcombinations, urgentfullhousecombinations, 
                urgentfourofkindcombinations, urgentroyalflushcombinations)

            for (let i = urgentfivecombinations.length - 1; i >= 0; i --){
                if (urgentfivecombinations[i][2] > this.cardsontableranking) {
                    this.commandrate = urgentfivecombinations[i][3];
                    return urgentfivecombinations[i][0];
                }
            }            
        }
        return [];
    }

    //Part 2. Playing Style

    //Define PickCards() with CutLoss, Killer, Heat, Normal Modes
    PickCards(HandCount1, HandCount2, HandCount3, NextPlayerHand) {

        var netsinglestraggling = 
        this.analytics.stragglingsingles - this.analytics.commandingsingles;

        var netpairstraggling = 
        this.analytics.stragglingpairs - this.analytics.commandingpairs;

        //Cut Loss Mode
        if (Math.min(HandCount1, HandCount2, HandCount3) == 1){
            if ((this.command == false) &&
            (NextPlayerHand !== 1)) {

                //Jump and play Urgent() certain probability
                var random = Math.random();
                if (random <= 0.5) {
                    //console.log("Cut Loss | Jump")
                    cardsselected = this.Urgent();
                    this.cardselected = cardsselected;
                    return this.cardselected;
                }
            }  

            //Cut Loss only when the next player has 1 card left
            if (NextPlayerHand == 1) {
                if (this.command == true) {
                    //console.log("Cut Loss | StopLoss")
                    cardsselected = this.StopLoss();
                    this.cardselected = cardsselected;
                    return this.cardselected;
                } 

                if (this.command == false) {
                    //console.log("Cut Loss | Urgent")
                    cardsselected = this.Urgent();
                    this.cardselected = cardsselected;
                    return this.cardselected;
                }  

            }            

        }

        //Killer Mode
        if ((netsinglestraggling <= 0) &&
        (netpairstraggling <= 0)) {

            if (this.command == true) {
                //console.log("Killer | Broom")
                cardsselected = this.Broom();
                this.cardselected = cardsselected;
                return this.cardselected;
            } 

            if (this.command == false) {
                //console.log("Killer | Strike")
                cardsselected = this.Strike();

                //Try Split if no valid result from Strike()
                if (cardsselected.length == 0){
                    cardsselected = this.Split();
                }
                this.cardselected = cardsselected;
                return this.cardselected;
                
            }  

        } 

        //Heat Mode
        if (Math.min(HandCount1, HandCount2, HandCount3) < 7) {

            var cardsselected = [];

            if (this.command == true) {
                //console.log("Heat | Broom")
                cardsselected = this.Broom();
                this.cardselected = cardsselected;
                return this.cardselected;
            } 

            if (this.command == false) {
                //console.log("Heat | Follow")
                cardsselected = this.Follow();

                //console.log("Command rate before adjustment: ", this.commandrate)

                if ((cardsselected.length == 1) ||
                (cardsselected.length == 2)) {

                    //Reserve biggest cards at only when too many stragglers
                    if ((this.commandrate == 1) && (cardsselected.length == 1)) {
                        if (netsinglestraggling >= 1){
                            //console.log("Heat | Reserved");
                            cardsselected = [];
                        } 
                    }

                    if ((this.commandrate == 1) && (cardsselected.length == 2)) {
                        if (netpairstraggling >= 1){
                            //console.log("Heat | Reserved");
                            cardsselected = [];
                        }   
                    }
                    
                    //console.log(
                    //    "Singles Length: ", this.analytics.analyzedhand[0][0].length,
                    //    "Pairs Length:", this.analytics.analyzedhand[1][0].length 
                    //)

                    //But then check if can end game immediately
                    if (this.analytics.rawhand.length <= 4) {
                    //When spliting commanding pair or three can end game
                        if ((this.analytics.analyzedhand[0][0].length - 
                            this.analytics.analyzedhand[1][0].length <= 1) || 
                        (this.analytics.analyzedhand[0][0].length - 
                            this.analytics.analyzedhand[2][0].length <= 2)) {
                        
                            //console.log("Split Check Activated");
                            cardsselected = this.Split();
                            
                            //End Process if successfully Split
                            if (cardsselected.length !== 0){
                                this.cardselected = cardsselected;
                                return this.cardselected;
                            }
                        }                        
                    }

                    //Add in a 40% chance of chickening out to play non highest cards
                    var random = Math.random();
                    if ((this.commandrate >= 0.9) && (this.commandrate !== 1) &&
                     (random >= 0.6)) {
                        //console.log("Heat | Chickened Out");
                        return [];
                    }
                }

                this.cardselected = cardsselected;
                return this.cardselected;
            }             

        }

        //Normal Mode
        if (Math.min(HandCount1, HandCount2, HandCount3) >= 7) {

            var cardsselected = [];

            if (this.command == true) {
                //console.log("Mode: Normal | Broom")
                cardsselected = this.Broom();
                this.cardselected = cardsselected;
                return this.cardselected;
            } 

            if (this.command == false) {
                //console.log("Mode: Normal | Follow")
                cardsselected = this.Follow();
                
                //Reserve bigger cards at early stage
                if ((cardsselected.length == 1) ||
                (cardsselected.length == 2)) {

                    if (this.commandrate >= 0.9) {
                        //console.log("Normal | Reserved")
                        return [];
                    }
                }

                this.cardselected = cardsselected;
                return this.cardselected;
            } 

        }

        return console.log("AI ERROR")
    }

}




