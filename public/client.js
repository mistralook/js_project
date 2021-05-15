import Game from './Game.js';
import Timer from './Timer.js';

const roundDuration = 5000;
const game = new Game('PlayerName');

function onTimerIsFinished() {
    game.isAlive = false;
    Promise.resolve('Timer is finished');
    console.log("timer is finished")
}
let checkanswercalledCount=0;
function onGivenAnswer(timerId, q, playerAnswer) {
    game.checkAnswer(q, playerAnswer);
    checkanswercalledCount+=1;
    
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
                removeHandlers();
                resolve("Button is clicked/ Resolve");                
            });
        };

    });
    return promise;
}

function removeHandlers() {
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
        // console.log("after promise")
        let result = await promise;
        // console.log("after await")
        if (!game.isAlive) {
            console.log("breaking/ Finish the game")
            break;
        }

    };
    
    removeHandlers();
}


start();