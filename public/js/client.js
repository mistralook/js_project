import Game from '../model/Game.js';
import Timer from '../model/Timer.js';


const roundDuration = 30000;
const userName = document.getElementById("userName").textContent;
const game = new Game(userName);


function onTimerIsFinished() {
    game.isAlive = false;
    console.log("timer is finished")
    removeHandlers("button");
    //sendResults();
    Promise.resolve('Timer is finished');
}
async function sendResults(){
    let gameRes = {
        name: game.playerName,
        score: game.score
      };
    ////////////
    ////////////
      let response = await fetch('/postResults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(gameRes)
      });
      
      let result = await response.json();
}

function onGivenAnswer(timerId, q, playerAnswer) {
    game.checkAnswer(q, playerAnswer);

    if (game.isAlive) {
        // Показываем кнопу зеленым, сет таймаут, нект итератион
        const timerScore = document.getElementById('timer').textContent;
        const score = document.getElementById("score");
        game.score += parseInt(timerScore);
        score.textContent = game.score;

    }
    else {
        removeHandlers("button");
        // Показываем красную, зеленым правильную, таймаут, вы проиграли (колво очков), рестарт
        console.log("button is pressed, answer isnt correct");
    }
    clearInterval(timerId);

}

function createPromise(q) {
    return new Promise((resolve, _) => {
        let timerId = setTimeout(() => {
            onTimerIsFinished()
        }, roundDuration);
        // Хочется один
        const timer = new Timer(roundDuration);
        timer.start();

        const questionArea = document.getElementById("question");
        const answers = document.getElementsByClassName("answer");
        questionArea.textContent = q.questionPhrase;

        document.getElementById("questionNumber").textContent = game.stage;
        for (let i = 0; i < answers.length; i++) {
            answers[i].textContent = q.variants[i];
            answers[i].addEventListener('click', event => {
                onGivenAnswer(timerId, q, q.variants[i]);
                // removeHandlers(); перенесено в конец раунда, после await promise
                timer.stop();
                resolve("Button is clicked/ Resolve");
            });
            answers[i].style = standartButtonStyle;
        }

    });
}
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
            console.log("breaking/ Finish the game")
            break;
        }
    }
    game.isAlive = false;
    console.log('GAME IS FINISHED')
    await sendResults();
    document.getElementById("end").style.visibility="visible";


}

const standartButtonStyle = document.getElementsByClassName("answer")[0].style;
start();
//sendResults();