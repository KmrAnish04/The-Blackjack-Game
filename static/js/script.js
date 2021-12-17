
let gameResult = {
    'player': {'scoreSpan': '#player-result-span', 'div':'#player-div', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-result-span', 'div':'#dealer-div', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10' , 'A', 'K', 'Q', 'J'],
    'cardsScores': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'A': [1,11], 'K': 10, 'Q': 10, 'J': 10},
    'wins': 0,
    'loses': 0,
    'draw': 0,
    'isStand': false,
    'turnsOver': false,
};

const YOU = gameResult['player'];
const DEALER = gameResult['dealer'];

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');

document.querySelector('#hit').addEventListener('click', BlackjackHit);
document.querySelector('#stand').addEventListener('click', BlackjackStand);
document.querySelector('#deal').addEventListener('click', BlackjackDeal);

function BlackjackHit() {
    // showCards(DEALER);
    if (gameResult['isStand'] === false) {
        let cardpicked = pickRandomCards();
        showCards(YOU, cardpicked); 
        updateCardsScore(cardpicked, YOU);
        updateScoreFrontend(YOU);        
    }  
}

function BlackjackDeal() {
    // showResults(decideWinner());
    if (gameResult['turnsOver'] === true) {
        
        let playerImgs = document.querySelector('#player-div').querySelectorAll('img');
        let dealerImgs = document.querySelector('#dealer-div').querySelectorAll('img');
        
        for (let i = 0; i < playerImgs.length; i++) {
            playerImgs[i].remove();        
        }
        for (let i = 0; i < dealerImgs.length; i++) {
            dealerImgs[i].remove();        
        }
    
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector(YOU['scoreSpan']).textContent = 0;
        document.querySelector(YOU['scoreSpan']).style.color = 'white';
        document.querySelector(DEALER['scoreSpan']).textContent = 0;
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';
    
        document.querySelector('#game-result').textContent = "Let's play";
        document.querySelector('#game-result').style.color = 'black';
    
        gameResult['isStand'] = false;
        gameResult['turnsOver'] = false;

    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function BlackjackStand() {
    if (gameResult['turnsOver'] === false) {
        
        gameResult['isStand'] = true;
        while (DEALER['score'] < 16 && gameResult['isStand'] === true) {
            
            let dealerCard = pickRandomCards();
            showCards(DEALER, dealerCard);
            updateCardsScore(dealerCard, DEALER);
            updateScoreFrontend(DEALER);
            await sleep(1000);
        }
        
        gameResult['turnsOver'] = true;
        let winner = decideWinner();
        showResults(winner);        
    }

}


function showCards(activePlayer, cardToBeShown) {
    if (activePlayer['score'] <= 21) {
        let cardImg = document.createElement('img');
        cardImg.src = `static/images/${cardToBeShown}.png`;
        cardImg.setAttribute('style', 'width: 90px; height: 120px; margin:5px')
        document.querySelector(activePlayer['div']).appendChild(cardImg);
        hitSound.play();
    }
}


function pickRandomCards() {
    let card = gameResult['cards'][Math.floor(Math.random() * 13)];
    console.log('chosen random = ', card);
    return card;
}

function updateCardsScore(card, activePlayer) {
    if (card === 'A') {
        if (activePlayer['score'] + gameResult['cardsScores'][card][1] <= 21) {
            activePlayer['score'] += gameResult['cardsScores'][card][1];
        }
        else{
            activePlayer['score'] += gameResult['cardsScores'][card][0];
        }
    }
    else{ 
        activePlayer['score'] += gameResult['cardsScores'][card];
        console.log(card, activePlayer['score']);
    }
}

function updateScoreFrontend(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'Bust';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
    else{
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }

}

function decideWinner() {
    let winner;
    if (YOU['score'] <= 21) {
        if ( (YOU['score'] > DEALER['score']) || (DEALER['score'] > 21)) {
            gameResult['wins']++;
            winner = YOU;
            // console.log('You win!');
        }
        else if(YOU['score'] < DEALER['score']){
            gameResult['loses']++
            winner = DEALER;
            console.log('Dealer win!')
        }
        else if(YOU['score'] === DEALER['score']){
            gameResult['draw']++;
            winner = 'Draw';
            console.log('Game Drew!');
        }
    }
    else if(YOU['score'] > 21 && DEALER['score'] <= 21){
        gameResult['loses']++;
        winner = DEALER;
        console.log('Dealer Wins!');
    }
    else if(YOU['score'] > 21 && DEALER['score'] > 21){
        gameResult['draw']++;
        winner = 'Draw';
        console.log('Game Draw!');
    }

    console.log('winner is ', winner);
    console.log(gameResult);
    return winner;
}

function showResults(winner) {
    let message, messageColor;

    if (gameResult['turnsOver'] === true) {
        
        if (winner === YOU) {
            document.querySelector('#wins').textContent = gameResult['wins'];
            message = 'You Won! 🥳';
            messageColor = 'green';
            winSound.play();
        }
        else if (winner === DEALER) {
            document.querySelector('#loses').textContent = gameResult['loses'];
            message = 'You Lost! 😥';
            messageColor = 'red';
            lossSound.play();
        }
        else{
            document.querySelector('#draws').textContent = gameResult['draw'];
            message = 'Game Drew! 🙅‍♂️';
            messageColor = '#ebab34';
        }
    
        document.querySelector('#game-result').textContent = message;
        document.querySelector('#game-result').style.color = messageColor;
    }

}