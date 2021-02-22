import Deck from './deck.mjs';
import Rules from './rules.mjs';

export default class Analytics {

    constructor(id) {
        this.id = id;
        this.deck = new Deck();
        this.remainingdeck = this.deck.cards
        this.rules = new Rules ();  
        this.cardsbyvalue = [];
        this.cardsbysuit = [];
        this.singlecombintions = [];
        this.paircombinations = [];
        this.threecombinations = [];
        this.straightcombinations = [];
        this.flushcombinations = [];
        this.fullhousecombinations = [];
        this.fourofkindcombinations = [];
        this.royalflushcombinations = [];
        this.fivecombinations = [];
        this.rawhand = [];
        this.hand = [];
        this.analyzedhand = [];
        this.handcardsbyvalue = [];
        this.handcardsbysuit = [];
        this.handsinglecombintions = [];
        this.handpaircombinations = [];
        this.handthreecombinations = [];
        this.handstraightcombinations = [];
        this.handflushcombinations = [];
        this.handfullhousecombinations = [];
        this.handfourofkindcombinations = [];
        this.handroyalflushcombinations = [];
        this.handfivecombinations = [];
        this.stragglingsingles = null;
        this.commandingsingles = null;
        this.stragglingpairs = null;
        this.commandingpairs = null;
    }  
    
    //1. Update Remaining Cards in Deck

    //Remove Cards on Hand on the first round and Cards on Table to get new Cardsleft
    UpdateCardsLeft(CardsonTable){
        for (let i = 0; i < CardsonTable.length; i++) {
            for (let j = this.remainingdeck.length -1; j >= 0; j--){
        
                if (this.remainingdeck[j].cardranking == CardsonTable[i].cardranking){
                    this.remainingdeck.splice(j, 1)
                                
                } 
            }
        } 
        return this.remainingdeck
    }

    //2. Compute Remaining Possible Card Combinations

    CardsByValue(Cards) {
        var result = [];
        var lastcard = Cards.length - 1;

        for (let i = 0; i <= 12 ; i++) {

            var samevalue = [];

            for (let j = 0; j <= lastcard; j++) {

                if (Cards[j].value == i){
                    samevalue.push(Cards[j]);
                }
                
            }
            result.push(samevalue)

        }
        samevalue.sort((a, b) => a.cardranking - b.cardranking);
        return result
    }

    CardsBySuit(Cards) {
        var result = [];
        var lastcard = Cards.length - 1;

        var suits = ["♦", '♣', '♥', '♠'];

        for (let i = 0; i <= 3 ; i++) {

            var suit = suits[i];
            var samesuit = []

            for (let j = 0; j <= lastcard; j++) {

                if (Cards[j].suit === suit){
                    samesuit.push(Cards[j]);
                }
                
            }

            result.push(samesuit)
        }
        samesuit.sort((a, b) => a.cardranking - b.cardranking);
        return result
    }

    //nCr utility function
    product_Range(a,b) {
        var prd = a,i = a;
        
        while (i++< b) {
            prd*=i;
        }
        return prd;
        }
    
    nCr(n, r) {
        if (r > n){
            return 0
        }

        if ((n>= 0) && (r == 0)){
            return 1
        }

        if (n==r) {return 1;} 
        else {
            r=(r < n-r) ? n-r : r;
            return this.product_Range(r+1, n)/this.product_Range(1,n-r);
        }
    }

    SingleCombinations(Cards) {
        var result = [];

        for (let i = 0; i <= Cards.length - 1; i++){

            result.push([[Cards[i]], 1, Cards[i].cardranking]);
        }

        return result
    }

    PairCombinations(Cards, CardsbyValue) {
        var result = [];
        for (let i = Cards.length - 1; i > 0; i--) {

            //Check if pair exists from the largest card
            if (Cards[i].value == Cards[i - 1].value) {

                let ivalue = Cards[i].value;

                //No need to - 1 for n to find remaining cards because the first card is position 0
                let n = CardsbyValue[ivalue].indexOf(Cards[i]);

                //Find the number of possible smaller card of the same value
                let variations = this.nCr(n, 1)

                result.push([[Cards[i - 1], Cards[i]], 
                    variations, Cards[i].cardranking]);
            }
        }
        //Sort to bring the array back to ascending order
        result.sort((a, b) => a[2] - b[2]);
        return result
    }

    ThreeCombinations(Cards, CardsbyValue) {
        var result = [];
        var lastcard = Cards.length - 1

        for (let i = lastcard; i >= 0; i--) {

            var three = [];
            var ivalue = Cards[i].value;

            // If 3 Cards of the Same Value exists
            if (CardsbyValue[ivalue].length >= 3){

                three.push(
                    CardsbyValue[ivalue][0],
                    CardsbyValue[ivalue][1],
                    CardsbyValue[ivalue][2],                        
                );
                result.push([three, 1, three[2].cardranking]);
            }

            //Clean up intermediate array
            three = [];

            // If 4 Cards of the Same Value exists
            if (CardsbyValue[ivalue].length == 4){

                three.push(
                    CardsbyValue[ivalue][1],
                    CardsbyValue[ivalue][2],
                    CardsbyValue[ivalue][3],                        
                );

                //Prefill 3C2 = 3 variationsinto position 1)
                result.push([three, 3, three[2].cardranking]);
            }         
        }

        //Remove duplicate fullhouse combintation
        result.sort((a, b) => a[2] - b[2]);

        for (let i = result.length - 1; i > 0 ; i--){
            if (result[i][0][2].cardranking == 
                result[i - 1][0][2].cardranking){
                    result.splice(i, 1)
            }
        }  
        return result

    }
    
    StraightCombinations(Cards, CardsbyValue) {
        var result = [];

        if (Cards.length >= 5) {

            //Check if CardsbyValue includes consecutive cards with Largest Card
            var lastcard = Cards.length - 1;
            for (let i = lastcard; i >= 4; i--) {

                let straight = [];
                let ivalue = Cards[i].value;

                if ( (ivalue - 4 >= 0) &&
                (CardsbyValue[ivalue - 4].length !== 0) &&
                (CardsbyValue[ivalue - 3].length !== 0) &&
                (CardsbyValue[ivalue - 2].length !== 0) &&
                (CardsbyValue[ivalue - 1].length !== 0)) {
                    straight.push(
                        CardsbyValue[ivalue - 4][0],
                        CardsbyValue[ivalue - 3][0],
                        CardsbyValue[ivalue - 2][0],
                        CardsbyValue[ivalue - 1][0],
                        Cards[i]
                    )

                    var variations = CardsbyValue[ivalue - 4].length *
                    CardsbyValue[ivalue - 3].length *
                    CardsbyValue[ivalue - 2].length *
                    CardsbyValue[ivalue - 1].length

                    result.push([straight, variations,Cards[i].cardranking])
                    result.sort((a, b) => a[2] - b[2]);
                }
            }

            //Remove Straight Ends with 2
            if (result.length > 0) {
                for (let i = result.length - 1; i >= 0 ; i--) {
                    if (result[i][0][4].value == 12) {
                
                            result.splice(i, 1);
                    }
                }
                result.sort((a, b) => a[2] - b[2]);
            }


            //Add Back the special case of "3,4,5,2,A"
            for (let i = 0; i <= lastcard; i++) {

                let straight = [];
                let ivalue = Cards[i].value;

                if ((ivalue == 11) &&
                (CardsbyValue[0].length !== 0) &&
                (CardsbyValue[1].length !== 0) &&
                (CardsbyValue[2].length !== 0) &&
                (CardsbyValue[12].length !== 0)) {
                    
                    straight.push(
                        CardsbyValue[0][0],
                        CardsbyValue[1][0],
                        CardsbyValue[2][0],
                        Cards[i],
                        CardsbyValue[12][0]
                    )

                    var variations = CardsbyValue[0].length *
                    CardsbyValue[1].length *
                    CardsbyValue[2].length *
                    CardsbyValue[12].length
                    
                    //Boost Card Ranking of this case by 8 to go above 10JQKA
                    result.push([straight, variations, Cards[i].cardranking + 8])
                    result.sort((a, b) => a[2] - b[2]);
                }
            }

            //Add Back the special case of "3,4,5,6,2"
            for (let i = 0; i <= lastcard; i++) {

                let straight = [];
                let ivalue = Cards[i].value;

                if ((ivalue == 12) &&
                (CardsbyValue[0].length !== 0) &&
                (CardsbyValue[1].length !== 0) &&
                (CardsbyValue[2].length !== 0) &&
                (CardsbyValue[3].length !== 0)) {
                    
                    straight.push(
                        CardsbyValue[0][0],
                        CardsbyValue[1][0],
                        CardsbyValue[2][0],
                        CardsbyValue[3][0],
                        Cards[i],
                    )

                    var variations = CardsbyValue[0].length *
                    CardsbyValue[1].length *
                    CardsbyValue[2].length *
                    CardsbyValue[3].length
                    
                    //Boost Card Ranking of this case by 4 to go above 10JQKA
                    result.push([straight, variations, Cards[i].cardranking]);
                    result.sort((a, b) => a[2] - b[2]);
                }
            }            
        }

        return result
    }

    FlushCombinations(Cards, CardsbySuit) {
        var result = [];

        if (Cards.length >= 5) {

            var suits = ["♦", '♣', '♥', '♠'];
            var lastcard = Cards.length - 1;

            for (let i = lastcard; i >= 4; i--) {

                var flush = [];
                var isuit = Cards[i].suit;
                var ivalue = Cards[i].value;
                var matchedsuit = CardsbySuit[suits.indexOf(isuit)];

                //Check if m5 or more cards are available from the same suit
                if ((ivalue >= 4) &&
                    (matchedsuit.length >= 5) &&
                    (matchedsuit[0].value != ivalue) &&
                    (matchedsuit[1].value != ivalue) &&
                    (matchedsuit[2].value != ivalue) &&
                    (matchedsuit[3].value != ivalue)
                    ) {
                    flush.push(
                        matchedsuit[0], matchedsuit[1],
                        matchedsuit[2], matchedsuit[3],
                        Cards[i]
                    );
                    
                    //Find all variation of the remaining 4 cards of same suit
                    var possibleremaining = 0;

                    for (let j = 0; j <= matchedsuit.length - 1; j++){
                        if (matchedsuit[j].cardranking < 
                            Cards[i].cardranking){
                                possibleremaining++
                        }
                    }

                    var variations = this.nCr(possibleremaining, 4)

                    result.push([flush, variations, Cards[i].cardranking + 100])
                    result.sort((a, b) => a[2] - b[2]);
                }
            }
        }
        return result
    }

    FullHouseCombinations(Cards, CardsbyValue, PairCombinations) {
        var result = [];

        if (Cards.length >= 5){

            var lastcard = Cards.length - 1;

            for (let i = lastcard; i >= 0; i--) {

                var fullhouse = [];
                var ivalue = Cards[i].value;

                // If 3 Cards of the Same Value exists
                if (CardsbyValue[ivalue].length >= 3){

                    fullhouse.push(
                        CardsbyValue[ivalue][0],
                        CardsbyValue[ivalue][1],
                        CardsbyValue[ivalue][2],                        
                    );

                    //Calculate Fullhouse Rank to avoid confusion with Pair
                    var fullhouseranking = CardsbyValue[ivalue][2].cardranking + 200

                    //Find pairs from the remaining CardsbyValue
                    PairLoop :
                    for (let j = 0; j <= 12; j++) {
                        if ((CardsbyValue[j].length >= 2)&&
                        CardsbyValue[j][0].value !== CardsbyValue[ivalue][0].value){

                            fullhouse.unshift(
                                CardsbyValue[j][0],
                                CardsbyValue[j][1]
                            );

                            var pairvariations = 0
                            for (let k = 0; k <= PairCombinations.length - 1; k++){
                                if (PairCombinations[k][0][1].value != ivalue) {
                                    pairvariations = pairvariations + PairCombinations[k][1];
                                }
                            }

                            result.push([fullhouse, pairvariations ,fullhouseranking]);
                            break PairLoop;
                        }
                    }
                }

                fullhouse = [];

               // If 4 Cards of the Same Value exists
                if (CardsbyValue[ivalue].length == 4){

                    fullhouse.push(
                        CardsbyValue[ivalue][1],
                        CardsbyValue[ivalue][2],
                        CardsbyValue[ivalue][3],                        
                    );

                    //Calculate Fullhouse Rank to avoid confusion with Pair
                    var fullhouseranking = CardsbyValue[ivalue][3].cardranking + 200

                    //Find pairs from the remaining CardsbyValue
                    for (let j = 0; j <= 12; j++) {
                        if ((CardsbyValue[j].length >= 2)&&
                        CardsbyValue[j][0].value !== CardsbyValue[ivalue][0].value){

                            fullhouse.unshift(
                                CardsbyValue[j][0],
                                CardsbyValue[j][1]
                            )

                            var pairvariations = 0
                            for (let k = 0; k <= PairCombinations.length - 1; k++){
                                if (PairCombinations[k][0][1].value != ivalue) {
                                    pairvariations = pairvariations + PairCombinations[k][1];
                                }
                            }

                            //total variation is 3 x pairvariations if have 4 cards
                            result.push([fullhouse, pairvariations * 3,fullhouseranking]);
                            break
                        }
                    }
                }
            }

            //Remove duplicate fullhouse combintation
            result.sort((a, b) => a[2] - b[2]);

            for (let i = result.length - 1; i > 0 ; i--){
                if (result[i][2] == result[i - 1][2]){
                        result.splice(i, 1)
                }
            }
        }
        return result
    }

    FourofKindCombinations(Cards, CardsbyValue) {
        var result = [];

        if (Cards.length >= 5) {

            var lastcard = Cards.length - 1;

            for (let i = lastcard; i >= 0; i--) {

                var fourofkind = [];
                var ivalue = Cards[i].value;

                if(CardsbyValue[ivalue].length == 4) {

                    fourofkind.push(
                        CardsbyValue[ivalue][0],
                        CardsbyValue[ivalue][1],
                        CardsbyValue[ivalue][2],
                        CardsbyValue[ivalue][3],                        
                    );

                    var fourofkindranking = CardsbyValue[ivalue][3].cardranking + 300

                    for (let j = 0; j <= 12; j++) {
                        if ((CardsbyValue[j].length >= 1) &&
                        (j !== ivalue)){

                            fourofkind.unshift(CardsbyValue[j][0])

                            var variations = Cards.length - 4

                            result.push([fourofkind, variations,fourofkindranking])
                            break
                        }
                    }
                }
            }
            //Remove duplicate fourofkind combintation
            result.sort((a, b) => a[2] - b[2]);

            for (let i = result.length - 1; i > 0 ; i--){
                if (result[i][2] == result[i - 1][2]){
                    result.splice(i, 1)
                }
            }
        }
        return result
    }

    RoyalFlushCombinations(Cards, CardsbySuit){
        var result = [];

        if (Cards.length >= 5) {
            
            var lastcard = Cards.length - 1;

            for (let i = lastcard; i >= 4; i--) {

                var iranking = Cards[i].cardranking;

                if (iranking >= 17) {

                    //Looping through cardsbysuit
                    for (let j = 0; j <= 3; j++) {
                        for (let k = CardsbySuit[j].length - 1; k >= 4; k--){

                            //No Straight ends with 2
                            if((iranking <= 48) &&
                                (CardsbySuit[j][k].cardranking == iranking) &&
                                (CardsbySuit[j][k - 1].cardranking == iranking - 4) &&
                                (CardsbySuit[j][k - 2].cardranking == iranking - 8) &&
                                (CardsbySuit[j][k - 3].cardranking == iranking - 12) &&
                                (CardsbySuit[j][k - 4].cardranking) == iranking -16){

                                result.push([[
                                CardsbySuit[j][k - 4], CardsbySuit[j][k - 3],
                                CardsbySuit[j][k - 2], CardsbySuit[j][k - 1],
                                CardsbySuit[j][k]], 1, iranking + 400])                                
                            }

                            //Account for special case 345A2
                            if((iranking > 48) &&
                            (CardsbySuit[j][k].cardranking == iranking) &&
                            (CardsbySuit[j][k - 1].cardranking == iranking - 4) &&
                            (CardsbySuit[j][0].cardranking == iranking - 48) &&
                            (CardsbySuit[j][1].cardranking == iranking - 44) &&
                            (CardsbySuit[j][2].cardranking) == iranking - 40){

                                result.push([[
                                CardsbySuit[j][0], CardsbySuit[j][1],
                                CardsbySuit[j][2], CardsbySuit[j][k - 1],
                                CardsbySuit[j][k]], 1, iranking + 400])                                
                            }
                        }
                    }
                }
            }
            result.sort((a, b) => a[2] - b[2]);
        }
        return result
    }

    FiveCombinations(StraightCombinations, FlushCombinations, FullHouseCombinations,
    FourofKindCombinations, RoyalFlushCombinations){
        var result = [];

        result = result.concat(StraightCombinations, FlushCombinations, 
            FullHouseCombinations, FourofKindCombinations, 
            RoyalFlushCombinations);
            
        return result;
    }

    UpdateRemainingCombinations() {

        this.cardsbyvalue = 
        this.CardsByValue(this.remainingdeck);

        this.cardsbysuit = 
        this.CardsBySuit(this.remainingdeck);

        this.singlecombintions = 
        this.SingleCombinations(this.remainingdeck);

        this.paircombinations = 
        this.PairCombinations(this.remainingdeck, this.cardsbyvalue);

        this.threecombinations = 
        this.ThreeCombinations(this.remainingdeck, this.cardsbyvalue);

        this.straightcombinations = 
        this.StraightCombinations(this.remainingdeck, this.cardsbyvalue);

        //console.log("all straightcombinations: ", this.straightcombinations);

        this.flushcombinations = 
        this.FlushCombinations(this.remainingdeck, this.cardsbysuit);

        this.fullhousecombinations = 
        this.FullHouseCombinations(this.remainingdeck, this.cardsbyvalue, 
        this.paircombinations);

        this.fourofkindcombinations = 
        this.FourofKindCombinations(this.remainingdeck, this.cardsbyvalue);

        this.royalflushcombinations = 
        this.RoyalFlushCombinations(this.remainingdeck, this.cardsbysuit);

        this.fivecombinations = 
        this.FiveCombinations(this.straightcombinations, 
            this.flushcombinations, this.fullhousecombinations, 
            this.fourofkindcombinations, this.royalflushcombinations)
    }

    UpdateHand(Cards){
        return Cards
    }

    UpdateHandCombinations() {

        this.handcardsbyvalue = 
        this.CardsByValue(this.hand);

        this.handcardsbysuit = 
        this.CardsBySuit(this.hand);

        this.handsinglecombintions = 
        this.SingleCombinations(this.hand);

        this.handpaircombinations = 
        this.PairCombinations(this.hand, this.handcardsbyvalue);

        this.handthreecombinations = 
        this.ThreeCombinations(this.hand, this.handcardsbyvalue);

        this.handstraightcombinations = 
        this.StraightCombinations(this.hand, this.handcardsbyvalue);

        //console.log("handstraightcombinations: ", this.handstraightcombinations);

        this.handflushcombinations = 
        this.FlushCombinations(this.hand, this.handcardsbysuit);

        this.handfullhousecombinations = 
        this.FullHouseCombinations(this.hand, this.handcardsbyvalue, 
        this.handpaircombinations);

        this.handfourofkindcombinations = 
        this.FourofKindCombinations(this.hand, this.handcardsbyvalue);

        this.handroyalflushcombinations = 
        this.RoyalFlushCombinations(this.hand, this.handcardsbysuit);

        this.handfivecombinations = 
        this.FiveCombinations(this.handstraightcombinations, 
            this.handflushcombinations, this.handfullhousecombinations, 
            this.handfourofkindcombinations, this.handroyalflushcombinations)
    }

    //3.Compute the Command Rate of each Possible Combinations

    //% of earning command with this Single
    SingleCommandRate(CardsSelected){

        var singlecompare = this.singlecombintions.concat([CardsSelected]);

        //Merge the selected combination into all combinations and compare
        function Comparator(a, b) {
            if (a[2] < b[2]) return -1;
            if (a[2] > b[2]) return 1;
            return 0;
        }
        
        singlecompare = singlecompare.sort(Comparator);

        //Find all higher Single possible
        let higher = singlecompare.length - 1 - singlecompare.indexOf(CardsSelected);
        
        let commandrate = 1 - (higher / (singlecompare.length - 1));

        return commandrate
        
    }

    PairCommandRate(CardsSelected, HandCount1, HandCount2, HandCount3) {
        
        var commandrate = null;

        //Account for the case where all players has 1 card left first
        if ((HandCount1 == 1) && (HandCount2 == 1) && (HandCount3 == 1)){
            return commandrate = 1
        }

        //Only compare is variation therefore variation of Selected = 1
        CardsSelected[1] = 1;
        var paircompare = this.paircombinations.concat([CardsSelected]);

        //Sort by the largest card of the pair
        function Comparator(a, b) {
            if (a[2] < b[2]) return -1;
            if (a[2] > b[2]) return 1;
            return 0;
        }
        
        paircompare = paircompare.sort(Comparator);
        
        //minus one for denominator to adjust for indexing
        let higher = paircompare.indexOf(CardsSelected);

        //Includes the Probability of NOT spliting the pair according to length
        const PairBellProbability = [0, 0, 1/2, 4/5, 1];
        
        var sumprobability = 0;

        //Find all ranked combinations * variation of each ranked combination
        let fullpaircompare = 0;

        for (let j = 0; j <= this.paircombinations.length - 1; j++) {
            fullpaircompare = fullpaircompare + (this.paircombinations[j][1])
        }
        
        //Add up each higher pair cases probability of pair being split
        for (let i = higher + 1; i <= paircompare.length - 1; i++){

            let ivalue = paircompare[i][0][1].value;

            sumprobability = sumprobability + 
            (PairBellProbability[this.cardsbyvalue[ivalue].length]*
                paircompare[i][1] / fullpaircompare);    

        }
        commandrate = 1 - sumprobability
        return commandrate
  
    }

    ThreeCommandRate(CardsSelected, HandCount1, HandCount2, HandCount3) {

        var commandrate = 0;

        //Account for the case where all players has >3 cards left
        if ((HandCount1 < 3) && (HandCount2 < 3) && (HandCount3 < 3)){
            return commandrate = 1
        }

        //Concat in the format of [[Cards], Variation, Ranking]
        CardsSelected[1] = 1;
        var threecompare = this.threecombinations.concat([CardsSelected]);
        
        function Comparator(a, b) {
            if (a[2] < b[2]) return -1;
            if (a[2] > b[2]) return 1;
            return 0;
        }
        
        threecompare = threecompare.sort(Comparator)

        //minus one for denominator to adjust for indexing
        let higher = threecompare.indexOf(
            CardsSelected);
            
        //Includes the Probability of NOT spliting the three according to length
        const ThreeBellProbability = [0, 0, 0, 1/5, 1/3];

        var sumprobability = 0;

        //Find all ranked combinations * variation of each ranked combination
        let fullthreecompare = 0;

        for (let j = 0; j <= this.threecombinations.length - 1; j++) {
            fullthreecompare = fullthreecompare + (this.threecombinations[j][1])
        }

        //Add up each higher case with higher Three variation * P(NO SPLIT)
        for (let i = higher + 1; i <= threecompare.length - 1; i++){

            //Value of the largest card in Three
            let ivalue = threecompare[i][0][2].value;

            sumprobability = sumprobability + 
            (ThreeBellProbability[this.cardsbyvalue[ivalue].length]*
                threecompare[i][1] / fullthreecompare);    
        }

        commandrate = 1 - sumprobability
        return commandrate
    }

    FiveCommandRate(CardsSelected, HandCount1, HandCount2, HandCount3) {

        var commandrate = 0;

        //Account for the case where all players has >5 cards left
        if ((HandCount1 < 5) && (HandCount2 < 5) && (HandCount3 < 5)){
            return commandrate = 1
        }

        //Concat in the format of [[Cards], Variation, Ranking]
        CardsSelected[1] = 1;
        var fivecompare = this.fivecombinations.concat([CardsSelected]);

        function Comparator(a, b) {
            if (a[2] < b[2]) return -1;
            if (a[2] > b[2]) return 1;
            return 0;
        }
        
        fivecompare = fivecompare.sort(Comparator)

        //minus one for denominator to adjust for indexing
        let higher = fivecompare.indexOf(
            CardsSelected);
            
        //Includes the Probability of NOT spliting the five cards
        const FiveBellProbability = 1/52;

        var sumprobability = 0;

        //Find all ranked combinations * variation of each ranked combination
        let fullfivecompare = 0;

        for (let j = 0; j <= this.fivecombinations.length - 1; j++) {
            fullfivecompare = fullfivecompare + (this.fivecombinations[j][1])
        }

        //Add up each higher case with higher Five variation * P(NO SPLIT)
        for (let i = higher + 1; i <= fivecompare.length - 1; i++){

            sumprobability = sumprobability + 
            (FiveBellProbability * fivecompare[i][1] / fullfivecompare);    

        }

        commandrate = 1 - sumprobability
        return commandrate
    }


    //4. Build a function that splits hands into combinations and pick the best 
    ArrangeHand(Cards, HandCount1, HandCount2, HandCount3){
        var singles = [];
        var pairs = [];
        var threes = [];
        var fives = [];

        //Intermediate Arrays
        var one = [];
        var two = [];
        var three = [];
        var four = [];

        var highestsingle = [];
        highestsingle.push(Cards[Cards.length - 1]);

        //console.log("Before Slicing ", Cards)

        //Part 1: General Splicing
        while(Cards.length > 0) {

            var ivalue = Cards[0].value; 

            //If card can't form ThreeofKind/Fullhouse/FourofKind with its value
            if (this.handcardsbyvalue[ivalue].length <= 2) {
                
                //Look for the biggest fives the smallest card can form
                if (this.handfivecombinations.length != 0){

                    var highestfive = this.handfivecombinations.length - 1; 

                    SpliceLoop:
                    for (let j = highestfive; j >= 0; j--) {
                        for (let k = 0; k <= 4; k++){

                            //Skip through empty loops after trimming Cards
                            if (j <= this.handfivecombinations.length - 1){
                                if(this.handfivecombinations[j][0][k].value == ivalue) {
        
                                    fives.push(this.handfivecombinations[j]);
            
                                    for (let l = 0; l <= 4 ; l++){
                                        for (let i = Cards.length - 1; i >= 0; i--){
                                            if(Cards[i].cardranking == 
                                                this.handfivecombinations[j][0][l].cardranking){
                                                    
                                                    Cards.splice(i, 1)
                
                                            }
                                        }
                                    }
                                    //Update Hand Combinations 
                                    this.hand = this.UpdateHand(Cards);
                                    this.UpdateHandCombinations();
                                    continue SpliceLoop;
                                }
                            }
                        }
                    }
                } 

                //Splice to two if has pair and no fives formed 
                if (this.handcardsbyvalue[ivalue].length == 2){

                    two.push([[Cards[0], Cards[1]], 1, Cards[1].cardranking]);
                    Cards.splice(0, 2)

                    this.hand = this.UpdateHand(Cards);
                    this.UpdateHandCombinations();
                }

                //Splice to one if single and no fives
                if (this.handcardsbyvalue[ivalue].length == 1){

                    one.push([[Cards[0]], 1, Cards[0].cardranking]);
                    Cards.splice(0, 1);

                    this.hand = this.UpdateHand(Cards);
                    this.UpdateHandCombinations();
                }            
            }

            if (this.handcardsbyvalue[ivalue].length == 3) {
                //Cardranking based on assumption that Fullhouse valid
                three.push([[Cards[0], Cards[1], Cards[2]], 1, Cards[2].cardranking + 200]);
                Cards.splice(0, 3)
                
                this.hand = this.UpdateHand(Cards);
                this.UpdateHandCombinations();            

            }

            if (this.handcardsbyvalue[ivalue].length == 4) {
                //Cardranking based on assumption that FourofKind valid
                four.push([[Cards[0], Cards[1], Cards[2], Cards[3]],
                    1, Cards[3].cardranking + 300]);
                Cards.splice(0, 4)

                this.hand = this.UpdateHand(Cards);
                this.UpdateHandCombinations();            
            }
        }


        //console.log("After Slicing: ", Cards);


        //Part 2: Complete Four and Fullhouse

        //Form FourofKind

        //Split pair/three/four to form four of kind
        SplitforFour:
        if ((four.length > 0) && (one.length == 0)) {

            if(two.length > 0){
                one.push(
                    [[two[0][0][0]], 1, two[0][0][0].cardranking], 
                    [[two[0][0][1]], 1, two[0][0][1].cardranking]);
                two.splice(0, 1);
                break SplitforFour;
            }

            if((three.length > 0) && (four.length == 1)){
                one.push([[three[0][0][0]], 1, three[0][0][0].cardranking]);
                two.push(
                    [[three[0][0][1], three[0][0][2]], 1, three[0][0][2].cardranking])
                three.splice(0, 1);
                break SplitforFour;
            }

            if((three.length > 0) && (four.length == 2)){
                one.push(
                    [[three[0][0][0]], 1, three[0][0][0].cardranking],
                    [[three[0][0][1]], 1, three[0][0][1].cardranking],
                    [[three[0][0][2]], 1, three[0][0][2].cardranking]);
                three.splice(0, 1);
                break SplitforFour;
            }
            
            //If have no choice and to split fours
            if((four.length == 2) && (one.length == 0)){
                one.push([[four[0][0][0]], 1, four[0][0][0].cardranking])
                three.push(
                    [[four[0][0][1], four[0][0][2], four[0][0][3]],
                    1, four[0][0][3].cardranking + 200])
                
                four.splice(0, 1);
                break SplitforFour;
            }

        }

        if ((four.length > 0) && (one.length > 0) &&
        (one.length < four.length)) {

            for (let q = 0; q <= one.length - 1; q++){
                var lastfour = four.length - 1

                four[lastfour][0].unshift(one[q][0][0]);
                lastfour--;
            }
            one = [];
        }

        if ((four.length > 0) && (one.length > 0) &&
        (one.length >= four.length)) {

            for (let p = four.length - 1; p >= 0; p--){
                if(four[p][0].length != 5) {
                    four[p][0].unshift(one[0][0][0]);
                    one.splice(0,1)
                }
            }
        }

        //Move the FourofKind to fives
        for (let r = four.length - 1; r >= 0; r--) {

            if (four[r][0].length == 5) {

                fives.push(four[r]);
            }

            if (four[r][0].length == 4) {
                //Ranking adjustment when doing the 3 - 1 split
                three.push([[four[r][0][0], four[r][0][1], four[r][0][2]],
                1, four[r][0][2].cardranking + 200]);
                one.push([[four[r][0][3]], 1, four[r][0][3].cardranking])
            }
        }
        four = [];

        
        //Form Fullhouse
        if ((three.length > 0) && (two.length > 0) &&
        (two.length < three.length)) {

            for (let n = 0; n <= two.length - 1; n++){
                
                var lastthree = three.length - 1

                three[lastthree][0].unshift(two[n][0][0], two[n][0][1]);
                lastthree--;
            }
            two = [];
        }

        if ((three.length > 0) && (two.length > 0) &&
        (two.length >= three.length)) {

            for (let m = three.length - 1; m >= 0; m--){
                if(three[m][0].length != 5){
                    three[m][0].unshift(two[0][0][0], two[0][0][1]);
                    two.splice(0,1)
                }
            }
        }

        //Move the Fullhouse to fives
        for (let o = three.length - 1; o >= 0; o--) {

            if (three[o][0].length == 5) {

                fives.push(three[o]);
            }

            if (three[o][0].length == 3) {
                //Ranking adjustment for ThreeofKind
                three[o][2] -= 200;
                threes.push(three[o]);
            }
        }
        three = [];

        singles.sort((a, b) => a[2] - b[2]);
        pairs.sort((a, b) => a[2] - b[2]);
        threes.sort((a, b) => a[2] - b[2]);
        fives.sort((a, b) => a[2] - b[2]);

        //console.log("General Splicing: ", "ONE: ",one, "TWO: ", two, 
        //"THREE: ", three, "FOUR: ", four);
        
        //console.log("Singles: ", singles, "Pairs: ", pairs,
        //"ThreeofKinds: ", threes, "Completed Fives: ", fives);


        //Part 3: Straggling Compensation
        var singlecommandrates = [];
        for (let s = 0; s <= one.length - 1; s++) {
            singlecommandrates.push(this.SingleCommandRate(one[s]));
        }

        //Count number of small cards
        var stragglers = 0;
        for (let t = 0; t <= one.length; t++){
            if(singlecommandrates[t] < .75){
                stragglers++
            }
        }

        if (stragglers >= 2) {
        
            //Put back the Pair with highest single
            if(two.length > 0){
                for (let u = two.length - 1; u >= 0; u--) {
                    if(two[u][0][1].cardranking == highestsingle[0].cardranking) {

                        one.push([[two[u][0][0]], 1, two[u][0][0].cardranking],
                            [[two[u][0][1]], 1, two[u][0][1].cardranking]);

                        two.splice(u, 1);

                    }
                }
            }

            //Put back the Three with highest single
            if(threes.length > 0){
                for (let y = threes.length - 1; y >= 0; y--) {
                    if(threes[y][0][2].cardranking == highestsingle[0].cardranking) {

                        one.push([[threes[y][0][0]], 1, threes[y][0][0].cardranking],
                            [[threes[y][0][1]], 1, threes[y][0][1].cardranking],
                            [[threes[y][0][2]], 1, threes[y][0][2].cardranking]);

                        threes.splice(y, 1);

                    }
                }
            }

            //Put back the Five with highest single
            if(fives.length > 0){
                PutBackFiveLoop:
                for (let z = fives.length - 1; z >= 0; z--) {
                    for (let a = 4; a >= 0; a--) {

                        if(fives[z][0][a].cardranking == highestsingle[0].cardranking) {

                            one.push([[fives[z][0][0]], 1, fives[z][0][0].cardranking],
                                [[fives[z][0][1]], 1, fives[z][0][1].cardranking],
                                [[fives[z][0][2]], 1, fives[z][0][2].cardranking],
                                [[fives[z][0][3]], 1, fives[z][0][3].cardranking],
                                [[fives[z][0][4]], 1, fives[z][0][4].cardranking]);
    
                            fives.splice(z, 1);
                            break PutBackFiveLoop;
                        }

                    }
                }
            }          

            //From highest put cards to one for (stragglers - 1) cards
            //-2 below: -1 for the above rationale, -1 for array operation
            one.sort((a, b) => a[2] - b[2]);
            for (let v = stragglers - 2; v >= 0; v--) {

                singles.push(one[one.length - 1]);
                one.splice(one.length - 1, 1)
            }

            //Check if remaining ones contain five
            if (one.length > 5) {
                var rawone = [];
                for (let onecount = 0; onecount <= one.length - 1; onecount++) {
                    rawone.push(one[onecount][0][0]);
                }
    
                var onecardsbyvalue = this.CardsByValue(rawone);
                var onecardsbysuit = this.CardsBySuit(rawone);
        
                var onepaircombinations = 
                this.PairCombinations(rawone, onecardsbyvalue);
        
                var onestraightcombinations = 
                this.StraightCombinations(rawone, onecardsbyvalue);
        
                var oneflushcombinations = 
                this.FlushCombinations(rawone, onecardsbysuit);
        
                var onefullhousecombinations = 
                this.FullHouseCombinations(rawone, onecardsbyvalue, 
                onepaircombinations);
        
                var onefourofkindcombinations = 
                this.FourofKindCombinations(rawone, onecardsbyvalue);
        
                var oneroyalflushcombinations = 
                this.RoyalFlushCombinations(rawone, onecardsbysuit);
        
                var onefivecombinations = 
                this.FiveCombinations(onestraightcombinations, 
                    oneflushcombinations, onefullhousecombinations, 
                    onefourofkindcombinations, oneroyalflushcombinations)
                     
    
                //console.log("Raw one: ", rawone, "Possible Fives: ", onefivecombinations);
                if (onefivecombinations.length !== 0){
                    fives.push(onefivecombinations[0]);
                    for (let f = 0; f <= 4; f++){
                        for (let g = one.length - 1; g >= 0; g--){
    
                            if(one[g][0][0].cardranking == 
                                onefivecombinations[0][0][f].cardranking) {
                                    one.splice(g, 1)
                            }
                        }
                    }
                }

            }

            //Check if remaining ones contains pair or three
            if (one.length > 2) {
                PushThree:
                for (let w = one.length - 1; w >= 2; w--) {

                    if ((one[w][0][0].value == one[w - 1][0][0].value) &&
                        (one[w][0][0].value == one[w - 2][0][0].value)) {

                        three.push(
                            [[one[w - 2][0][0], one[w - 1][0][0], one[w][0][0]], 
                            1, one[w][0][0].cardranking]);

                        one.splice(w - 2, 3);
                        break PushThree;
                    }
                }
            }

            if (one.length > 1) {
                PushTwo:
                for (let x = one.length - 1; x >= 1; x--) {
                    if (one[x][0][0].value == one[x - 1][0][0].value) {
                            
                        two.push(
                            [[one[x - 1][0][0], one[x][0][0]], 1, one[x][0][0].cardranking]);

                        one.splice(x - 1, 2);
                        break PushTwo;
                    }
                }
            }

           
        }

        //Put all unsorted combinations to intermediate array
        singles = singles.concat(one);
        pairs = pairs.concat(two);
        threes = threes.concat(three);
        one = [];
        two = [];
        three = [];

        singles.sort((a, b) => a[2] - b[2]);
        pairs.sort((a, b) => a[2] - b[2]);
        threes.sort((a, b) => a[2] - b[2]);
        fives.sort((a, b) => a[2] - b[2]); 

        
        //console.log("Straggling Compensation:", 
        //"Highest Single:", highestsingle, "Stragglers: ", stragglers)

        //console.log("After Compensation: ", "ONE: ", one, "TWO: ", two, 
        //"THREE: ", three, "FOUR: ", four);
        
        //Add Command rate to each combination
        for (let b = 0; b <= singles.length - 1; b++) {
            singles[b] = singles[b].concat(
                this.SingleCommandRate(singles[b]));
        }

        for (let c = 0; c <= pairs.length - 1; c++) {
            pairs[c] = pairs[c].concat(
                this.PairCommandRate(pairs[c], HandCount1, HandCount2, HandCount3));
        }

        for (let d = 0; d <= threes.length - 1; d++) {
            threes[d] = threes[d].concat(
                this.ThreeCommandRate(threes[d], HandCount1, HandCount2, HandCount3));
        }

        for (let e = 0; e <= fives.length - 1; e++) {
            fives[e] = fives[e].concat(
                this.FiveCommandRate(fives[e], HandCount1, HandCount2, HandCount3));
        }

        //console.log("Singles: ", singles, "Pairs: ", pairs,
        //"ThreeofKinds: ", threes , "Fives: ", fives);

        var analyzed = [];
        analyzed.push([singles], [pairs], [threes], [fives]);
        return analyzed;
    }

    StragglingSingles() {
        var stragglingsingles = 0;
        for (let i = 0; i <= this.analyzedhand[0][0].length - 1; i++) {
            if (this.analyzedhand[0][0][i][3] < .9){
                stragglingsingles++
            }
        }
        this.stragglingsingles = stragglingsingles;
    }

    StragglingPairs() {
        var stragglingpairs = 0;
        for (let i = 0; i <= this.analyzedhand[1][0].length - 1; i++) {
            if (this.analyzedhand[1][0][i][3] < .9){
                stragglingpairs++
            }
        }
        this.stragglingpairs = stragglingpairs;
    }

    CommandingSingles() {
        var commandingsingles = 0;
        for (let i = 0; i <= this.analyzedhand[0][0].length - 1; i++) {
            if (this.analyzedhand[0][0][i][3] >= .9){
                commandingsingles++
            }
        }
        this.commandingsingles = commandingsingles;
    }

    CommandingPairs() {
        var commandingpairs = 0;
        for (let i = 0; i <= this.analyzedhand[1][0].length - 1; i++) {
            if (this.analyzedhand[1][0][i][3] >= .9){
                commandingpairs++
            }
        }
        this.commandingpairs = commandingpairs;
    }

    AnalyzeHand(Cards, HandCount1, HandCount2, HandCount3){
        //Analyse all combinations in hand
        this.rawhand = this.UpdateHand(Cards);
        this.hand = [...this.rawhand];
        //Analyse all hand combinations
        this.UpdateHandCombinations()
        this.analyzedhand = this.ArrangeHand(this.hand, HandCount1, HandCount2, HandCount3) 
        this.StragglingSingles();
        this.StragglingPairs();
        this.CommandingSingles();
        this.CommandingPairs();

    }

}


/* 
//For Analytics Testing
var deck = new Deck();
var rule = new Rules();
deck.shuffle();

var hand = [
    { name: '3♦', suit: '♦', value: 0, cardranking: 1 },
    { name: '4♥', suit: '♥', value: 1, cardranking: 7 },
    { name: '5♥', suit: '♥', value: 2, cardranking: 11 },
    { name: '6♥', suit: '♥', value: 3, cardranking: 15 },
    { name: '2♦', suit: '♦', value: 12, cardranking: 49 }
];

for (let i = 0;  i <= 12; i++) {

    hand.push(deck.draw());
}

hand.sort((a, b) => a.cardranking - b.cardranking) 

var HandCount1 = 13;
var HandCount2 = 13;
var HandCount3 = 8;


var CardsonTable = []

var CardsSelected = []

//Start Analytics after card is received
var analytics = new Analytics();

//For First Round
analytics.UpdateCardsLeft(hand);

//Update for new CardsonTable
analytics.UpdateCardsLeft(CardsonTable);

//Analyse all remaining combinations
analytics.UpdateRemainingCombinations();


analytics.AnalyzeHand(hand, HandCount1, HandCount2, HandCount3);


console.log("Analyzed Hand [Singles, Pairs, Threes, Fives]: ", JSON.stringify(analytics.analyzedhand)); 

console.log("Straggling Singles: ", analytics.stragglingsingles,
"Straggling Pairs: ", analytics.stragglingpairs,
"Commanding Singles: ", analytics.commandingsingles,
"Commanding Pairs: ", analytics.commandingpairs); 
  */

