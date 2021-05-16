import Game from './Game.js';
import Hints from './Game.js';
import Timer from './Timer.js';

const roundDuration = 30000;
const game = new Game('PlayerName');


function onTimerIsFinished() {
    game.isAlive = false;
    console.log("timer is finished")
    // removeHandlers();
    Promise.resolve('Timer is finished');
}
let checkanswercalledCount = 0;
function onGivenAnswer(timerId, q, playerAnswer) {
    game.checkAnswer(q, playerAnswer);
    checkanswercalledCount += 1;

    if (game.isAlive) {
        // Показываем кнопу зеленым, сет таймаут, нект итератион
        const timerScore = document.getElementById('timer').textContent;
        // console.log(`TIMERSCORE IS ${timerScore}`)
        console.log(`check answer called ${checkanswercalledCount} times`)
        const score = document.getElementById("score");
        game.score += parseInt(timerScore);
        score.textContent = game.score;
        console.log("button is pressed, answer is right");
    }
    else {
        // Показываем красную, зеленым правильную, таймаут, вы проиграли (колво очков), рестарт
        console.log("button is pressed, answer isnt correct");
    }
    clearInterval(timerId);

}

function createPromise(q) {
    const promise = new Promise((resolve, _) => {
        let timerId = setTimeout(() => { onTimerIsFinished() }, roundDuration);
        // Хочется один
        const timer = new Timer(roundDuration);
        timer.start();

        const questionArea = document.getElementById("question");
        const answers = document.getElementsByClassName("answer");
        questionArea.textContent = q.questionPhrase;

        document.getElementById("questionNumber").textContent = `Вопрос номер  ${game.stage}!`
        for (let i = 0; i < answers.length; i++) {
            answers[i].textContent = q.variants[i];
            answers[i].addEventListener('click', event => {
                onGivenAnswer(timerId, q, q.variants[i]);
                // removeHandlers(); перенесено в конец раунда, после await promise
                timer.stop();
                resolve("Button is clicked/ Resolve");
            });
            answers[i].style = standartButtonStyle;
        };
        
    });
    return promise;
}
function removeHandlers() {
    Array.from(document.getElementsByClassName("answer")).forEach(el => {
        let elClone = el.cloneNode(true);
        el.parentNode.replaceChild(elClone, el);
    })
}

async function start() {
    const fiftyfifty = document.getElementById("fiftyfifty");
    fiftyfifty.addEventListener('click', event => {
        const remButtons = game.activateHint(0);
        console.log(remButtons);
        document.getElementsByClassName("answer")[remButtons[0]].style.visibility = 'hidden';
        document.getElementsByClassName("answer")[remButtons[1]].style.visibility = 'hidden';
        document.getElementById("fiftyfifty").style.display = "None"
    });


    document.getElementById("callFriend").addEventListener('click', event => {
        let friendsOpinionIndex = game.activateHint(1);
        console.log(`frindIndex is ${friendsOpinionIndex}`);
        console.log(document.getElementsByClassName("answer")[friendsOpinionIndex].style.backgroundColor)
        document.getElementsByClassName("answer")[friendsOpinionIndex].style.backgroundColor = 'blue';
        document.getElementById("callFriend").style.display = "None"
    });
    for (const q of game.start()) {
        const promise = createPromise(q);
        let result = await promise;
        removeHandlers();
        if (!game.isAlive) {
            console.log("breaking/ Finish the game")
            break;
        }
    };
    game.isAlive = false;
    console.log('GAME IS FINISHED')
    // removeHandlers();
}

const standartButtonStyle = document.getElementsByClassName("answer")[0].style;
start();