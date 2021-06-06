import Game from '../model/Game.js';
import Timer from '../model/Timer.js';


const roundDuration = 30000;
const userName = document.getElementById("userName").textContent;
const game = new Game(userName);


const modalContainer = document.querySelector(".modal-container")
const gameFinishedEvent = new Event('gameFinished');


modalContainer.addEventListener("gameFinished", function () {
    modalContainer.style.display = "block"
    modalContainer.style.visibility = "visible"
    if (game.isAlive) {
        const elem = document.getElementById("resultText");
        elem.textContent = "Вы выиграли";
        elem.style.background = "green";
    } else document.getElementById("resultText").textContent = "LOSE";

})


function onTimerIsFinished() {
    game.isAlive = false;
    modalContainer.dispatchEvent(gameFinishedEvent);
    removeHandlers(".answer");
    Promise.resolve('Timer is finished');
}

async function sendResults() {
    let gameRes = {
        name: game.playerName,
        score: game.score
    };
    let response = await fetch('/postResults', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(gameRes)
    });
    await response.json();
}
async function onGameFinished() {
    game.isAlive = false;
    game.computeScore()
    await sendResults();
}

document.getElementById("end").onclick = async () => {
    await onGameFinished()
};

async function wait(time) {
    await new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

async function onGivenAnswer(timerId, q, playerAnswer) {
    game.checkAnswer(q, playerAnswer);
    const correctAnswer = q.getCorrectAnswer();
    if (game.isAlive) {

        const button = [...document.getElementsByClassName("answer")]
            .filter(butt => butt.textContent === correctAnswer)[0];
        button.style.background = "#237d11";
        button.style.pointerEvents = "none";
        const timerScore = document.getElementById('timer').textContent;
        const score = document.getElementById("score");
        game.score += parseInt(timerScore);
        score.textContent = game.score;


    }
    else {
        const button = [...document.getElementsByClassName("answer")]
            .filter(butt => butt.textContent === playerAnswer)[0];
        button.style.background = "#aa1a1a";
        button.style.pointerEvents = "none";
        const button1 = [...document.getElementsByClassName("answer")]
            .filter(butt => butt.textContent === correctAnswer)[0];
        button1.style.background = "#237d11";
        button1.style.pointerEvents = "none";
        removeHandlers(".hints")
    }
    await wait(2000);
    clearInterval(timerId);
}


function createPromise(q) {
    return new Promise((resolve, _) => {
        let timerId = setTimeout(onTimerIsFinished, roundDuration);
        const timer = new Timer(roundDuration);
        timer.start();

        const questionArea = document.getElementById("question");
        const answers = document.getElementsByClassName("answer");
        questionArea.textContent = q.questionPhrase;

        document.getElementById("questionNumber").textContent = game.stage;
        for (let i = 0; i < answers.length; i++) {
            answers[i].textContent = q.variants[i];
            answers[i].addEventListener('click', async event => {
                removeHandlers(".answer");
                await onGivenAnswer(timerId, q, q.variants[i])
                timer.stop();

                resolve("Button is clicked/ Resolve");
            });
            answers[i].style = standartButtonStyle;
        }
    });
}

const standartButtonStyle = document.getElementsByClassName("answer")[0].style;

function removeHandlers(selector) {
    Array.from(document.querySelectorAll(selector)).forEach(el => {
        let elClone = el.cloneNode(true);
        el.parentNode.replaceChild(elClone, el);
    })
}

async function start() {
    await game.initPool();
    const fiftyfifty = document.getElementById("fiftyfifty");
    fiftyfifty.addEventListener('click', event => {
        const remButtons = game.activateHint(0);
        document.getElementsByClassName("answer")[remButtons[0]].style.visibility = 'hidden';
        document.getElementsByClassName("answer")[remButtons[1]].style.visibility = 'hidden';
        fiftyfifty.style.display = "None"
    });


    document.getElementById("callFriend").addEventListener('click', event => {
        let friendsOpinionIndex = game.activateHint(1);
        document.getElementsByClassName("answer")[friendsOpinionIndex].style.backgroundColor = 'blue';
        document.getElementById("callFriend").style.display = "None"
    });
    for (const q of game.start()) {
        const promise = createPromise(q);
        let result = await promise;
        removeHandlers(".answer");
        if (!game.isAlive) {
            break;
        }
    }
    modalContainer.dispatchEvent(gameFinishedEvent);
    game.isAlive = false;
}

start();