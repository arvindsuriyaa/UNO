let body = document.body
let head = document.getElementsByTagName('head')[0];
let styleSheet = document.createElement('style');
let playerScore, computerScore;
let playerContainer = document.getElementById("playerContainer")
let computerContainer = document.getElementById("computerContainer")
let retrieveCard = document.getElementById("retrieveCard")
let cardPile = document.getElementById('cardPile')
styleSheet.innerHTML += `#playerContainer{
                            display: flex;
                            flex-flow:column;
                            justify-content: center;
                            align-items: center;
                            font-size: 40px;
                            text-align:center;
                            background-color:black;
                            color:white;
                        }
                        #computerContainer{
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            font-size: 50px;
                            background-color:white;
                        }`
computerContainer.innerHTML = "Welcome To UNO Game";
playerContainer.innerHTML = `<div>Click the startgame button to begin the game</div>
            <div style='font-size:25px'>Enter Name:<input type='text' id='name' style='height:30px;font-weight: bold;'></div>`;
let userName;
document.head.appendChild(styleSheet);
document.getElementById("reset").disabled = true;
document.getElementById("uno").disabled = true;
function startGame() {
    userName = document.getElementById('name').value;
    if (userName === "") {
        alert("Enter Name before Proceeding to play game")
    } else {
        gameLayout()
    }
}
let secCount;
function countDown() {
    let countDownDate = new Date(new Date().getTime() + 5 * 60000).getTime();
    secCount = setInterval(function () {
        let now = new Date().getTime();
        let distance = countDownDate - now;
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("timer").innerHTML = "0" + minutes + "m " + seconds + "s ";
        if (distance < 0) {
            debugger
            scoreCard()
            clearInterval(secCount);
            if (parseInt(computerScore) > parseInt(playerScore)) {
                computerWinFunction()
            } else if (parseInt(computerScore) < parseInt(playerScore)) {
                playerWinFunction()
            } else if (parseInt(computerScore) === parseInt(playerScore)) {
                // playerWinFunction()
                computerContainer.innerHTML = `Its a TIE<br/>Score: ${computerScore} points`
                playerContainer.innerHTML = `Its a TIE<br>Score: ${playerScore} points`;
            }
        }
    }, 1000);
}
computerScore = 0;
playerScore = 0;
let computerCards, playerCards;
function gameLayout() {
    // debugger
    document.getElementById("reset").disabled = false;
    document.getElementById("uno").disabled = false;
    styleSheet.innerHTML += `#playerContainer{display: block}
    #computerContainer{display:block}`
    countDown();
    computerContainer.innerHTML = `<span id="computerTitle" style="display:flex">Computer</span><span style="background-color: white;height: 21px;display: inline-block;">Time:<span id="timer"></span></span>
                                                                <div style="width: 80%;margin:auto">
                                                                <div id="computerCards"></div>                                                            
                                                            </div>`
    playerContainer.innerHTML = `<div id="playerCards"></div>    
                                                            <div id="playerTitle" style="display:flex">Player: ${userName}</div>`
    retrieveCard.setAttribute("style", "pointer-events: all")
    document.getElementById("startGame").disabled = true;
    document.getElementById("computerTitle").setAttribute("style", "display:flex")
    document.getElementById("playerTitle").setAttribute("style", "display:flex")
    computerCards = document.getElementById("computerCards");
    playerCards = document.getElementById("playerCards")
    makeCards();
}
let deck = [];
function makeCards() {
    let deckRound = 1;
    function makeDeck(type, color, id) {
        deck[deck.length] = {
            type: type,
            color: color,
            id: id
        };
    }
    let number = 1;
    let color = "";
    for (let i = 0; i < 4; i++) {
        if (i === 0) {
            color = "blue";
        }
        else if (i === 1) {
            color = "green";
        }
        else if (i === 2) {
            color = "red";
        }
        else {
            color = "yellow";
        }
        for (let x = 0; x < 10; x++) {
            let y = 0;
            if (x < 1) {
                makeDeck(x, color, color + number + "card" + String([x]));
                number += 1;
            }
            else {
                while (y < 2) {
                    makeDeck(x, color, color + number + "card" + String([x]));
                    number += 1;
                    y += 1;
                }
                while (x === 9 && y < 3) {
                    makeDeck("Draw Two", color, "drawTwo" + color + number);
                    makeDeck("Draw Two", color, "drawTwo" + color + (number += 1));
                    makeDeck("Skip", color, "skip" + color + (number += 1));
                    makeDeck("Skip", color, "skip" + color + (number += 1));
                    makeDeck("Reverse", color, "reverseCard" + color + (number += 1));
                    makeDeck("Reverse", color, "reverseCard" + color + (number += 1));
                    number += 1;
                    y += 1;
                }
                while (i === 3 && x === 9 && y < 7) {
                    makeDeck("Wild", "Wild", "wild" + number);
                    number += 1;
                    y += 1;
                }
                while (i === 3 && x === 9 && y < 11) {
                    makeDeck("Wild Draw Four", "Wild", "wildDrawFour" + number);
                    number += 1;
                    y += 1;
                }
            }
        }
    }
    console.log(deck)
    shuffleDeck(deck, deckRound);
}
function shuffleDeck(deck, deckRound) {
    let i = deck.length;
    while (i) {
        console.log("i value", i)
        let x = Math.floor(Math.random() * i--);
        let y = deck[i];
        deck[i] = deck[x];
        deck[x] = y;
    }
    if (deckRound === 1) {
        dealCards(deck, deckRound);
    }
}
let computerHand = [];
let playerHand = [];
let discardPile = [];
function dealCards() {
    for (let i = 0; i < 14; i += 2) {
        computerHand.push(deck[i]);
        playerHand.push(deck[i + 1]);
    }
    while (deck[14].color === "Wild") {
        let x = deck[14];
        deck.splice(14, 1);
        deck.push(x);
    }
    discardPile.push(deck[14]);
    deck.splice(0, 15);
    showCards(computerHand.length, "computerCards", computerHand);
    showCards(playerHand.length, "playerCards", playerHand);
    showCards(1, "cardPile", discardPile);
}
let colorCheck = false;
let bgColor;
function showCards(numberOfCards, id, cards) {
    // debugger;
    styleSheet.innerHTML = `#playerCards{pointer-events: all;cursor: default;}`
    if (id === "playerCards") {
        styleSheet.innerHTML = `#playerCards{pointer-events: all;cursor: default;}
                            #playerTitle{background-color: white;color:black;}
                            #computerTitle{background-color:black;color:white;}`
    } else if (id === "computerCards") {
        styleSheet.innerHTML += `#playerCards{pointer-events: all;cursor: default;}
                                #playerTitle{background-color: black;color:white;}
                                #computerTitle{background-color:white;color:black;}`
    }
    if (id === "computerCards") {
        computerCards.innerHTML = "";
    } else if (id === "playerCards") {
        playerCards.innerHTML = "";
    }
    console.log(cards)
    for (let i = 0; i < numberOfCards; i++) {
        if (cards[i].type === "Wild" || cards[i].type === "Wild Draw Four" || cards[i].type === "Draw Two" || cards[i].type === "Skip" || cards[i].type === "Reverse") {
            console.log(cards[i].type)

            let cardDiv = document.createElement("div");
            document.getElementById(id).appendChild(cardDiv);
            cardDiv.setAttribute("class", "card " + cards[i].color);
            if (id === "computerCards") {
                cardDiv.setAttribute("id", `${cards[i].id}`);
                if (numberOfCards > 7) {
                    cardDiv.setAttribute("style", "z-index: " + (i + 1) + "; margin-right:" + -3.26 + "%");
                }
                continue
            } else {
                if (numberOfCards > 7) {
                    cardDiv.setAttribute("style", "z-index: " + (i + 1) + "; margin-right:" + -3.26 + "%");
                }
                cardDiv.setAttribute(`onclick`, `animateCard(${JSON.stringify(cards[i])},discardPile)`)
                if (!colorCheck) {
                    if (cards[i]["color"] !== "Wild") {
                        bgColor = cards[i]["color"]
                    } else {
                        bgColor = "url(bonusCard.jpg)";
                    }
                }
                if (cards[i].type === "Wild") {
                    cardDiv.innerHTML = `<div id="${cards[i].id}" class="bonusCard wildCard" style="background:${bgColor};background-position: center;
                    background-position-x: 47px;background-position-y: 74px;">
                                        <div class="upperLeft"></div>
                                    </div>`
                    document.getElementById(cards[i].id).innerHTML += `${cards[i].type}<div class="bottomRight"></div>`;
                } else if (cards[i].type === "Wild Draw Four") {
                    cardDiv.innerHTML = `<div id="${cards[i].id}" class="bonusCard wildCard" style="background:${bgColor};font-size: 19px;background-position: center;
                    background-position-x: 47px;background-position-y: 74px;">
                                        <div class="upperLeft"></div>
                                    </div>`
                    document.getElementById(cards[i].id).innerHTML += `${cards[i].type}<div class="bottomRight"></div>`;
                } else if (cards[i].type === "Draw Two") {
                    cardDiv.innerHTML = `<div id="${cards[i].id}" class="bonusCard" style="background-color:${cards[i].color};margin:0px 10px;">
                                        <div class="upperLeft"></div>
                                    </div>`
                    document.getElementById(cards[i].id).innerHTML += `<div style="font-size: 55px;">+2</div><div>Draw Two</div><div class="bottomRight"></div>`;
                } else {
                    if (cards[i].type === "Skip") {
                        cardDiv.innerHTML = `<div id="${cards[i].id}" class="bonusCard" style="background-color:${cards[i].color};margin:0px 10px;">
                                                <div class="upperLeft"></div>
                                            </div>`
                        document.getElementById(cards[i].id).innerHTML += `<div style="font-size:80px">⇥</div><div>Skip</div><div class="bottomRight"></div>`;
                    } else if (cards[i].type === "Reverse") {
                        cardDiv.innerHTML = `<div id="${cards[i].id}" class="bonusCard" style="background-color:${cards[i].color};margin:0px 10px;">
                                                <div class="upperLeft"></div>
                                            </div>`
                        document.getElementById(cards[i].id).innerHTML += `<div style="font-size:80px">↑↓</div><div>Reverse</div><div class="bottomRight"></div>`;
                    }
                }
            }
        } else {
            let cardDiv = document.createElement("div");
            document.getElementById(id).appendChild(cardDiv);
            cardDiv.setAttribute("class", "card " + cards[i].color);
            if (id === "computerCards") {
                cardDiv.setAttribute("id", `${cards[i].id}`);
                if (numberOfCards > 7) {
                    cardDiv.setAttribute("style", "z-index: " + (i + 1) + "; margin-right:" + -3.26 + "%");
                }
                continue;
            } else {
                cardDiv.setAttribute(`onclick`, `animateCard(${JSON.stringify(cards[i])},discardPile)`)
                cardDiv.innerHTML = `
                    <div id="${cards[i].id}" class="cards" style="background-color:${cards[i].color};margin:0px 10px">
                        <div class="upperLeft">
                            <span class="${cards[i].id} upperSection"></span>
                        </div>
                        <div class="center">
                            <span class="${cards[i].id} centerSection"></span>
                        </div>
                        <div class="bottomRight">
                            <span class="${cards[i].id} bottomSection"></span>
                        </div>
                    </div>`
                if (numberOfCards > 7) {
                    cardDiv.setAttribute("style", "z-index: " + (i + 1) + "; margin-right:" + -3.26 + "%");
                }
                let cardID = document.getElementsByClassName(cards[i].id)
                for (let j = 0; j < 3; j++) {
                    cardID[j].innerHTML = cards[i].type;
                }
            }
        }
    }
}

let computerPlay = false;
function animateCard(cardDetails, discardPile) {
    // debugger
    let checkCard = false;
    if (cardDetails["type"] === discardPile[0]["type"] || cardDetails["color"] === discardPile[0]["color"]) {
        checkCard = true;
    } else if (cardDetails["type"] === "Wild" || cardDetails["type"] === "Wild Draw Four") {
        checkCard = true;
    }
    if (checkCard) {
        styleSheet.innerHTML += `#playerTitle{
                                    background-color: white;
                                    color:black;
                                }
                                #computerTitle{
                                    background-color:black;
                                    color:white;
                                }`
        for (let i = 0; i < playerHand.length; i++) {
            if (playerHand[i]["id"] === cardDetails["id"]) {
                cardPosition = i;
            }
        }
        let chosenCard = playerCards.childNodes[cardPosition].getBoundingClientRect();
        let pileCard = cardPile.firstChild.getBoundingClientRect();
        setTimeout(function () {
            styleSheet.innerHTML += `#playerCards #${cardDetails["id"]}{
                                    position:relative;
                                    bottom: ${chosenCard.bottom - pileCard.bottom}px;
                                    left : ${pileCard.left - chosenCard.left}px;
                                    transition: bottom 0.8s;
                                }`
            setTimeout(function () {
                checkMatch(cardDetails, discardPile)
            }, 800)
        }, 1)
    }
}
let penalty;
let playerScoreArray = []

function checkMatch(cardDetails, discardPile) {
    // debugger
    console.log("Players Turn")
    console.log(cardDetails)
    console.log(discardPile[0])
    let cardPosition;
    playerScore = 0;
    if (parseInt(cardDetails["type"]) === parseInt(discardPile[0]["type"]) || cardDetails["type"] === discardPile[0]["type"] || cardDetails["color"] === discardPile[0]["color"] || cardDetails["type"] === "Wild" || cardDetails["type"] === "Wild Draw Four") {
        discardPile.splice(0, 1)
        discardPile.push(cardDetails)
        console.log(discardPile)
        for (let i = 0; i < playerHand.length; i++) {
            if (playerHand[i]["id"] === cardDetails["id"]) {
                // playerScoreArray.push(cardDetails["type"])
                playerHand.splice(i, 1)
                console.log(playerHand)
                cardPosition = i;
            }
        }
        playerScoreArray = []
        for (let j = 0; j < playerHand.length; j++) {
            playerScoreArray.push(playerHand[j]["type"])
        }
        console.log("player score", playerScoreArray)

        document.getElementById('playerTitle').innerHTML = `Player: ${userName}`
        playerCards.innerHTML = ""
        showCards(playerHand.length, "playerCards", playerHand);
        cardPile.innerHTML = "";
        showCards(1, "cardPile", discardPile);
        if (cardDetails["type"] === "Wild" || cardDetails["type"] === "Wild Draw Four") {
            // styleSheet.innerHTML += `#discardPile{pointer-events: all}`
            retrieveCard.setAttribute("style", "pointer-events: none")
            let wildCard = document.createElement("div")
            wildCard.setAttribute("id", "colorBox")
            wildCard.innerHTML += `<div id="red" onclick='colorChange("red","${cardDetails["type"]}")' style="cursor:pointer"></div>
                                    <div id="blue" onclick='colorChange("blue","${cardDetails["type"]}")' style="cursor:pointer"></div>
                                    <div id="yellow" onclick='colorChange("yellow","${cardDetails["type"]}")' style="cursor:pointer"></div>
                                    <div id="green" onclick='colorChange("green","${cardDetails["type"]}")' style="cursor:pointer"></div>`
            cardPile.appendChild(wildCard)
            cardPile.childNodes[1].setAttribute("style", "pointer-events:none")
            document.getElementById("colorBox").setAttribute("style", "pointer-events: all")
            if (playerHand.length === 0) {
                playerWinFunction()
                return;
            }
            if (playerHand.length === 1) {
                unoFunction()
                return;
            }
            return
        } else if (cardDetails.type === "Draw Two") {
            for (let i = 0; i < 2; i++) {
                computerHand.push(deck[i])
                deck.splice(i, 1)
                computerCards.innerHTML = "";
                showCards(computerHand.length, "computerCards", computerHand);
            }
        }
        computerPlay = true;
    }
    if (discardPile[0]["type"] === "Skip" || discardPile[0]["type"] === "Reverse") {
        retrieveCard.setAttribute("style", "pointer-events: all")
        if (playerHand.length === 0) {
            playerWinFunction()
            return;
        } else if (playerHand.length === 1) {
            unoFunction()
            return;
        }
        return
    } else {
        if (playerHand.length === 1) {
            unoFunction()
            return;
        }
        if (playerHand.length > 0) {
            if (computerPlay) {
                setTimeout(function () { computerTurn(discardPile) }, 1000)
                computerPlay = false;
            }
        }
    }
    if (playerHand.length === 0) {
        playerWinFunction()
        return;
    }
}
function unoFunction() {
    penalty = setTimeout(function () {
        playerHand.push(deck[0])
        deck.splice(0, 1)
        showCards(playerHand.length, "playerCards", playerHand);
        alert("Penalty for Not saying UNO : Added one Card to player Side")
        if (discardPile[0]["type"] === "Wild" || discardPile[0]["type"] === "Wild Draw Four") {
            return
        } else {
            while (cardPile.childNodes.length > 1) {
                cardPile.removeChild(cardPile.lastChild);
            }
            setTimeout(function () { computerTurn(discardPile) }, 2000)
        }
    }, 2000);
}
function playerWinFunction() {
    scoreCard()
    styleSheet.innerHTML += `#playerContainer{display: flex;flex-flow: column;justify-content: center;
                                align-items: center;font-size: 40px;text-align: center;background-color: black;
                                color: white;
                            }               
                            #computerContainer{display: flex;justify-content: center;align-items: center;
                                font-size: 50px;background-color: white;
                            }`
    computerContainer.innerHTML = `Computer loses<br/>Score: ${computerScore} points`
    playerContainer.innerHTML = `${userName} won the Match<br>Score: ${playerScore} points`;
    // document.getElementById("draw").setAttribute("style", "display:none")
    retrieveCard.setAttribute("style", "pointer-events: none")
    clearTimeout(secCount);
}
function uno() {
    // debugger
    clearTimeout(penalty);
    alert("Player says UNO!")
    if (discardPile[0]["type"] === "Wild" || discardPile[0]["type"] === "Wild Draw Four") {
        // cardPile.removeChild(cardPile.childNodes[2])
        return
    } else if (discardPile[0]["type"] === "Skip" || discardPile[0]["type"] === "Reverse") {
        return;
    } else {
        while (cardPile.childNodes.length > 1) {
            cardPile.removeChild(cardPile.lastChild);
        }
        setTimeout(function () { computerTurn(discardPile) }, 2000)
    }
}
function reset() {
    // debugger
    console.log(userName)
    clearTimeout(secCount);
    cardPile.innerHTML = "";
    computerContainer.innerHTML = "";
    playerContainer.innerHTML = "";
    deck = [];
    computerScore = 0;
    computerScoreArray = []
    playerScoreArray = []
    playerScore = 0;
    computerHand = [];
    playerHand = [];
    discardPile = [];
    gameLayout()
}
function colorChange(cardColor, type) {
    retrieveCard.setAttribute("style", "pointer-events: all")
    styleSheet.innerHTML += `#discardPile{pointer-events: all}`
    bgColor = cardColor
    colorCheck = true;
    cardPile.innerHTML = "";
    showCards(1, "cardPile", discardPile);
    discardPile[0]["color"] = cardColor;
    console.log(discardPile)
    colorCheck = false;
    if (type === "Wild Draw Four") {
        for (let i = 0; i < 4; i++) {
            computerHand.push(deck[i])
            deck.splice(i, 1)
        }
        console.log(computerHand)
        console.log(deck)
        computerCards.innerHTML = "";
        showCards(computerHand.length, "computerCards", computerHand);
    }
    if (type === "Wild") {
        setTimeout(function () { computerTurn(discardPile) }, 1000)
    }
}
function drawCard() {
    retrieveCard.setAttribute("style", "pointer-events: none")
    let passCard = document.createElement("div")
    passCard.innerHTML = `<button id="pass" onclick="passChance()">Pass</button>`
    cardPile.appendChild(passCard)
    playerCards.innerHTML = "";
    playerHand.push(deck[0])
    deck.splice(0, 1)
    showCards(playerHand.length, "playerCards", playerHand);
    playerScoreArray = []
    for (let j = 0; j < playerHand.length; j++) {
        playerScoreArray.push(playerHand[j]["type"])
    }
    let drawTest = true
    for (let i = 0; i < playerHand.length; i++) {
        if (playerHand[i]["type"] === discardPile[0]["type"]) {
            document.getElementById("pass").setAttribute("style", "display:block")
            return
        } else if (playerHand[i]["color"] === discardPile[0]["color"]) {
            document.getElementById("pass").setAttribute("style", "display:block")
            return
        } else if (playerHand[i]["type"] === "Wild Draw Four" || playerHand[i]["type"] === "Wild") {
            document.getElementById("pass").setAttribute("style", "display:block")
            return;
        }
        drawTest = false
    }
    if (!drawTest) {
        passChance()
    }
}
function passChance() {
    // debugger
    while (cardPile.childNodes.length > 1) {
        cardPile.removeChild(cardPile.lastChild);
    }
    setTimeout(function () { computerTurn(discardPile) }, 1000)
}
// computer play
let computerScoreArray = []
function computerTurn(discardPile) {
    console.log("computers turn")
    // debugger
    console.log("Computer score", computerScore)
    console.log(computerScore)
    // debugger
    styleSheet.innerHTML += `#playerTitle{
        background-color: white;
        color:black;
    }
    #computerTitle{
        background-color:black;
        color:white;
    }`
    retrieveCard.setAttribute("style", "pointer-events: all")
    console.log(discardPile)
    // debugger
    computerScore = 0;
    let cardCheck = true;
    document.getElementById("computerTitle").innerHTML = `Computer`
    computerScoreArray = []
    for (let i = 0; i < computerHand.length; i++) {
        if ((computerHand[i]["type"] === discardPile[0]["type"]) && (computerHand[i]["color"] == discardPile[0]["color"])) {
            console.log('computer Score', computerScoreArray)
            computerCheckMatch(i)
            // computerScoreArray.push(computerHand[i]["type"])
            if (computerHand.length === 0) {
                computerWinFunction()
                return
            }
            for (let j = 0; j < computerHand.length; j++) {
                computerScoreArray.push(computerHand[j]["type"])
            }
            debugger
            alert("same card added")
            if (discardPile[0]["type"] === "Draw Two") {
                alert("two cards are added to playerSide")
                addPlayerCards()
            } else if (discardPile[0]["type"] === "Skip" || discardPile[0]["type"] === "Reverse") {
                setTimeout(function () { skipAction() }, 500)
            }
            if (computerHand.length === 0) {
                computerWinFunction()
                return;
            }
            if (computerHand.length === 1) {
                alert("Computer Says UNO!!!")
            }
            return;
        } else if (computerHand[i]["type"] === discardPile[0]["type"]) {
            console.log('computer Score', computerScoreArray)
            // document.getElementById("computerTitle").innerHTML = `Computer`
            computerCheckMatch(i)
            // computerScoreArray.push(computerHand[i]["type"])
            if (computerHand.length === 0) {
                computerWinFunction()
                return
            }
            for (let j = 0; j < computerHand.length; j++) {
                computerScoreArray.push(computerHand[j]["type"])
            }
            if ((discardPile[0]["type"] === "Wild") || (discardPile[0]["type"] === "Wild Draw Four")) {
                wildCardFunction()
            } else if (discardPile[0]["type"] === "Skip" || discardPile[0]["type"] === "Reverse") {
                setTimeout(function () { skipAction() }, 500)
            } else if (discardPile[0]["type"] === "Draw Two") {
                alert("two cards are added to playerSide")
                addPlayerCards()
            }
            if (computerHand.length === 0) {
                computerWinFunction()
                return
            }
            if (computerHand.length === 1) {
                alert("computer Says UNO!!!")
            }
            return;
        } else if (computerHand[i]["color"] == discardPile[0]["color"]) {
            console.log('computer Score', computerScoreArray)
            computerCheckMatch(i)
            // computerScoreArray.push(computerHand[i]["type"])
            if (computerHand.length === 0) {
                computerWinFunction()
                return
            }
            for (let j = 0; j < computerHand.length; j++) {
                computerScoreArray.push(computerHand[j]["type"])
            }
            if (discardPile[0]["type"] === "Draw Two") {
                alert("two cards are added to playerSide")
                addPlayerCards()
            } else if (discardPile[0]["type"] === "Skip" || discardPile[0]["type"] === "Reverse") {
                setTimeout(function () { skipAction() }, 500)
            }
            if (computerHand.length === 0) {
                computerWinFunction()
                return;
            }
            if (computerHand.length === 1) {
                alert("Computer Says UNO!!!")
            }
            return;
        }
        cardCheck = false;
    }
    if (!cardCheck) {
        // alert("no Match Found")
        let cardMatch = true;
        for (let i = 0; i < computerHand.length; i++) {
            if ((computerHand[i]["type"] === "Wild") || (computerHand[i]["type"] === "Wild Draw Four")) {
                console.log('computer Score', computerScoreArray)
                // document.getElementById("computerTitle").innerHTML = `Computer`
                computerCheckMatch(i)
                // computerScoreArray.push(computerHand[i]["type"])
                for (let j = 0; j < computerHand.length; j++) {
                    computerScoreArray.push(computerHand[j]["type"])
                }
                if (discardPile[0]["type"] === "Wild" || discardPile[0]["type"] === "Wild Draw Four") {
                    wildCardFunction()
                    if (computerHand.length === 0) {
                        computerWinFunction()
                        return;
                    }
                    if (computerHand.length === 1) {
                        alert("Computer Says UNO!!!")
                    }
                    return;
                }
            }
            cardMatch = false
        }
        if (!cardMatch) {
            for (let j = 0; j < computerHand.length; j++) {
                computerScoreArray.push(computerHand[j]["type"])
            }
            computerCards.innerHTML = "";
            computerHand.push(deck[0])
            deck.splice(0, 1)
            showCards(computerHand.length, "computerCards", computerHand);
            if (computerHand[computerHand.length - 1]["type"] === discardPile[0]["type"] || computerHand[computerHand.length - 1]["color"] === discardPile[0]["color"]) {
                alert("discardPile Match found on draw!")
                setTimeout(function () { computerTurn(discardPile) }, 1000)
            }
        }
    }
    if (computerHand.length === 0) {
        computerWinFunction()
        return;
    }
}
function skipAction() {
    for (let j = 0; j < computerHand.length; j++) {
        if ((computerHand[j]["type"] === discardPile[0]["type"]) || (computerHand[j]["color"] === discardPile[0]["color"])) {
            setTimeout(function () { computerTurn(discardPile) }, 1000)
            return;
        }
    }
    computerHand.push(deck[0])
    deck.splice(0, 1)
    // alert("Card Added!")
    computerCards.innerHTML = ""
    showCards(computerHand.length, "computerCards", computerHand)
}
function scoreCard() {
    // debugger
    for (let i = 0; i < playerScoreArray.length; i++) {
        if (playerScoreArray[i] === "Wild") {
            playerScoreArray[i] = 50
        } else if (playerScoreArray[i] === "Wild Draw Four") {
            playerScoreArray[i] = 50
        } else if (playerScoreArray[i] === "Draw Two") {
            playerScoreArray[i] = 20
        } else if (playerScoreArray[i] === "Skip") {
            playerScoreArray[i] = 20
        } else if (playerScoreArray[i] === "Reverse") {
            playerScoreArray[i] = 20
        }
        computerScore += parseInt(playerScoreArray[i])
    }
    for (let i = 0; i < computerScoreArray.length; i++) {
        if (computerScoreArray[i] === "Wild") {
            computerScoreArray[i] = 50
        } else if (computerScoreArray[i] === "Wild Draw Four") {
            computerScoreArray[i] = 50
        } else if (computerScoreArray[i] === "Draw Two") {
            computerScoreArray[i] = 20
        } else if (computerScoreArray[i] === "Skip") {
            computerScoreArray[i] = 20
        } else if (computerScoreArray[i] === "Reverse") {
            computerScoreArray[i] = 20
        }
        playerScore += parseInt(computerScoreArray[i])
    }

}
function computerCheckMatch(i) {
    discardPile.splice(0, 1)
    discardPile.push(computerHand[i])
    console.log(discardPile)
    computerHand.splice(i, 1)
    console.log(computerHand)
    computerCards.innerHTML = ""
    showCards(computerHand.length, "computerCards", computerHand);
    cardPile.innerHTML = "";
    showCards(1, "cardPile", discardPile);
}
function computerWinFunction() {
    alert("Computer Won the match")
    scoreCard()
    styleSheet.innerHTML += `#playerContainer {
                                display: flex;
                                flex-flow: column;
                                justify-content: center;
                                align-items: center;
                                font-size: 40px;
                                text-align: center;
                                background-color: black;
                                color: white;
                            }
                            #computerContainer {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                font-size: 50px;
                                background-color: white;
                            }
    `
    computerContainer.innerHTML = `Computer won the Match<br/>Score: ${computerScore} points`
    playerContainer.innerHTML = `${userName} lost the Match<br>Score: ${playerScore} points`;
    clearTimeout(secCount);
}
function wildCardFunction() {
    let colorPalette = ["red", "blue", "green", "yellow"]
    discardPile[0]["color"] = colorPalette[Math.round(Math.random() * 3)]
    cardPile.innerHTML = "";
    showCards(1, "cardPile", discardPile);
    if (discardPile[0]["type"] === "Wild Draw Four") {
        for (let i = 0; i < 4; i++) {
            playerHand.push(deck[i])
            deck.splice(i, 1)
        }
        console.log(playerHand)
        console.log(deck)
        playerCards.innerHTML = "";
        showCards(playerHand.length, "playerCards", playerHand);
        setTimeout(function () { computerTurn(discardPile) }, 1000)
    }
}
function addPlayerCards() {
    for (let i = 0; i < 2; i++) {
        playerHand.push(deck[i])
        deck.splice(i, 1)
        playerCards.innerHTML = "";
        showCards(playerHand.length, "playerCards", playerHand);
    }
}