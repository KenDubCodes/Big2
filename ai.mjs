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

            for (let i = 0; i <= fives.length - 1; i++) {
                if (fives[i][2] > this.cardsontableranking){
                    this.commandrate = this.analytics.analyzedhand[3][0][i][3];
                    return this.analytics.analyzedhand[3][0][i][0];
                }
            }
        }

        return [];
    }

    //Play highest valid ranking combination when follow
    Strike() {

        if ((this.cardsontable.length == 1) &&
        (this.analytics.analyzedhand[0][0].length !== 0)) {

            let singles = this.analytics.analyzedhand[0][0];

            for (let i = singles.length - 1; i >= 0; i--) {
                if (singles[i][2] > this.cardsontableranking){
                    this.commandrate = this.analytics.analyzedhand[0][0][i][3];
                    return this.analytics.analyzedhand[0][0][i][0];
                }
            }
        }

        if ((this.cardsontable.length == 2) &&
        (this.analytics.analyzedhand[1][0].length !== 0)) {

            let pairs = this.analytics.analyzedhand[1][0];

            for (let i = pairs.length - 1; i >= 0; i--) {
                if (pairs[i][2] > this.cardsontableranking){
                    this.commandrate = this.analytics.analyzedhand[1][0][i][3];
                    return this.analytics.analyzedhand[1][0][i][0];
                }
            }
        }

        if ((this.cardsontable.length == 3) &&
        (this.analytics.analyzedhand[2][0].length !== 0)) {

            let threes = this.analytics.analyzedhand[2][0];

            for (let i = threes.length - 1; i >= 0; i--) {
                if (threes[i][2] > this.cardsontableranking){
                    this.commandrate = this.analytics.analyzedhand[2][0][i][3];
                    return this.analytics.analyzedhand[2][0][i][0];
                }
            }
        }

        if ((this.cardsontable.length == 5) &&
        (this.analytics.analyzedhand[3][0].length !== 0)) {
            
            let fives = this.analytics.analyzedhand[3][0];

            for (let i = fives.length - 1; i >= 0; i--) {
                if (fives[i][2] > this.cardsontableranking){
                    this.commandrate = this.analytics.analyzedhand[3][0][i][3];
                    return this.analytics.analyzedhand[3][0][i][0];
                }
            }
        }

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
    PickCards(HandCount1, HandCount2, HandCount3) {

        var netsinglestraggling = 
        this.analytics.stragglingsingles - this.analytics.commandingsingles;

        var netpairstraggling = 
        this.analytics.stragglingpairs - this.analytics.commandingpairs;

        //Cut Loss
        if (Math.min(HandCount1, HandCount2, HandCount3) <= 2) {
            if (this.command == true) {
                console.log("Cut Loss | StopLoss")
                cardsselected = this.StopLoss();
                this.cardselected = cardsselected;
                return this.cardselected;
            } 

            if (this.command == false) {
                console.log("Cut Loss | Urgent")
                cardsselected = this.Urgent();
                this.cardselected = cardsselected;
                return this.cardselected;
            }  

        }

        //Killer Mode
        if ((netsinglestraggling <= 0) &&
        (netpairstraggling <= 0)) {

            if (this.command == true) {
                console.log("Killer | Broom")
                cardsselected = this.Broom();
                this.cardselected = cardsselected;
                return this.cardselected;
            } 

            if (this.command == false) {
                console.log("Killer | Strike")
                cardsselected = this.Strike();
                this.cardselected = cardsselected;
                return this.cardselected;
            }  

        } 

        //Heat Mode
        if (Math.min(HandCount1, HandCount2, HandCount3) < 7) {

            var cardsselected = [];

            if (this.command == true) {
                console.log("Heat | Broom")
                cardsselected = this.Broom();
                this.cardselected = cardsselected;
                return this.cardselected;
            } 

            if (this.command == false) {
                console.log("Heat | Follow")
                cardsselected = this.Follow();

                //Reserve bigger cards at only when too many stragglers
                if ((cardsselected.length == 1) ||
                (cardsselected.length == 2)) {

                    if ((this.commandrate >= 0.9) &&
                    (netsinglestraggling >= 2) &&
                    (netpairstraggling >= 2)) {
                        
                        console.log("Heat | Reserved");
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
                console.log("Mode: Normal | Broom")
                cardsselected = this.Broom();
                this.cardselected = cardsselected;
                return this.cardselected;
            } 

            if (this.command == false) {
                console.log("Mode: Normal | Follow")
                cardsselected = this.Follow();
                
                //Reserve bigger cards at early stage
                if ((cardsselected.length == 1) ||
                (cardsselected.length == 2)) {

                    if (this.commandrate >= 0.9) {
                        console.log("Normal | Reserved")
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




