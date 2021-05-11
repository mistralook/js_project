import Game from './Game.js';
import Timer from './Timer.js';

const roundDuration = 5000;
const game = new Game('PlayerName');

function onTimerIsFinished() {
    game.isAlive = false;
    Promise.resolve('Timer is finished');
    console.log("timer is finished")
}

function onGivenAnswer(timerId, q, playerAnswer) {
    game.checkAnswer(q, playerAnswer);
    clearInterval(timerId);
    if (game.isAlive) {
        // Показываем кнопу зеленым, сет таймаут, нект итератион
        console.log("button is pressed, answer is right")
    }
    else {
        // Показываем красную, зеленым правильную, таймаут, вы проиграли (колво очков), рестарт
        console.log("button is pressed, answer isnt correct")
    }
    
}

function createPromise(q) {
    const promise = new Promise((resolve, _) => {
        let timerId = setTimeout(() => { onTimerIsFinished() }, roundDuration);
        // Хочется один
        const timer = new Timer(roundDuration);
        timer.start();

        const questionArea = document.getElementById("question");
        const answers = document.getElementsByClassName("answer");
        const score = document.getElementById("score");
        questionArea.textContent = q.questionPhrase;
    
        document.getElementById("questionNumber").textContent = `Вопрос номер  ${game.stage}!`
        for (let i = 0; i < answers.length; i++) {
            answers[i].textContent = q.variants[i];
            answers[i].addEventListener('click', event => {
                onGivenAnswer(timerId, q, q.variants[i]);
                resolve("Button is clicked/ Resolve")
            });
        };
    });
    return promise;
}

function onFinishedGame() {
    console.log("questions vse")
    Array.from(document.getElementsByClassName("answer")).forEach(el => {
        let elClone = el.cloneNode(true);
        el.parentNode.replaceChild(elClone, el);
    })
}

async function start() {
    for (const q of game.start()) {
        if (!game.isAlive) break;
        const promise = createPromise(q);
        console.log("after promise")
        let result = await promise;
        console.log("after await")
        if (!game.isAlive) {
            console.log("breaking/ Finish the game")
            break;
        }

    };
    
    onFinishedGame();
}


start();