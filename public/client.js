import Game from './Game.js';

// const playerName = document.querySelector('input[class="player-name"]')




async function start() {
    const game = new Game('jsjsjsj');
    let onAnswerClick = function (event, timerId, answer) {
        game.checkAnswer(answer.textContent);
        clearInterval(timerId);
        if (game.isAlive) {
            // Показываем кнопу зеленым, сет таймаут, нект итератион
            console.log("button is pressed, answer is right")
        }
        else {
            // Показываем красную, зеленым правильную, таймаут, вы проиграли (колво очков), рестарт
            console.log("button is pressed, answer isnt correct")
        }
        resolve("Button is clicked/ Resolve")
    }
    let questionNumber = 1;
    for (let q of game.start()) {
        if (!game.isAlive)
            break;
        let promise = new Promise((resolve, reject) => {
            let timerId = setTimeout(() => {
                game.isAlive = false;
                resolve('Timer is finished');
                console.log("timer is finished")
            }, 5000);

            const questionArea = document.getElementById("question");
            const answers = document.getElementsByClassName("answer");
            const score = document.getElementById("score");

            questionArea.textContent = game.currentQuestion.questionPhrase;

            document.getElementById("questionNumber").textContent = `Вопрос номер  ${questionNumber++}!`
            for (let i = 0; i < answers.length; i++) {


                answers[i].textContent = game.currentQuestion.variants[i];
                answers[i].addEventListener('click', event => {
                    game.checkAnswer(answers[i].textContent);
                    clearInterval(timerId);
                    if (game.isAlive) {
                        // Показываем кнопу зеленым, сет таймаут, нект итератион
                        console.log("button is pressed, answer is right")
                    }
                    else {
                        // Показываем красную, зеленым правильную, таймаут, вы проиграли (колво очков), рестарт
                        console.log("button is pressed, answer isnt correct")
                    }
                    resolve("Button is clicked/ Resolve")
                });

            }


        });
        console.log("after promise")
        let result = await promise;
        console.log("after await")
        if (!game.isAlive) {
            console.log("breaking/ Finish the game")
            break;
        }

    };
    console.log("questions vse")
    Array.from(document.getElementsByClassName("answer")).forEach(el => {
        let elClone = el.cloneNode(true);
        el.parentNode.replaceChild(elClone, el);
    })
}


start();
