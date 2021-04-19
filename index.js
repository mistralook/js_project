class QuestionGenerator {
    static generateQuestions() {
        return [
            new Question("Q1", ["a1", "a2", "a3", "a4"], 0, 100),
            new Question("Q2", ["b1", "b2", "b3", "b4"], 0, 200),
            new Question("Q3", ["c1", "c2", "c3", "c4"], 0, 300),
            new Question("Q4", ["d1", "d2", "d3", "d4"], 0, 500)
        ];
    }
}

const Hints = {
    "FiftyFifty": 0,
    "FrinedCall": 1,
    "AskTheAudience": 2
}


class Game {
    constructor(player) {
        this.pool = QuestionGenerator.generateQuestions();
        this.score = 0;
        this.player = player;
        this.isAlive = true;
        this.currentQuestion = new Question();
    };

    checkAnswer(answer) {
        if (answer === this.currentQuestion.getCorrectAnswer()) {
            this.score += this.currentQuestion.price;
        } else {
            this.isAlive = false;
        }

    }

    * start() {
        for (const question of this.pool) {
            this.currentQuestion = question;
            yield question;

        }
    }

    activateHint(hintType) {
        switch (hintType) {
            case Hints.FiftyFifty:
                break;
            case Hints.FriendCall:
                break;
            case Hints.AskTheAudience:
                break;
        }
    }
}


function main() {
    const prompt = require('prompt-sync')();
    const name = prompt('What is your name?');
    const player = new Player(name);
    const game = new Game(player);
    const loop = game.start();
    while (true) {
        const question = loop.next();
        if (question.value === undefined) {
            break;
        }
        console.log(question.value.representation())
        const answer = prompt("ANSWER:");
        game.checkAnswer(answer)

        if (game.isAlive) {
            console.log('Correct!');
        } else {
            console.log(`Incorrect! Correct answer is ${question.value.getCorrectAnswer()}`);
            break;
        }
    }
}

function handler() {

}


class Player {
    constructor(name) {
        this.name = name
    }
}


class Question {
    constructor(questionPhrase, variants, correctAnswerIndex, price) {
        this.questionPhrase = questionPhrase;
        this.variants = variants;
        this.correctAnswerIndex = correctAnswerIndex;
        this.price = price;
    }

    getCorrectAnswer() {
        return this.variants[this.correctAnswerIndex];
    }


    representation() {
        return `1. ${this.questionPhrase}\nA: ${this.variants[0]}, B: ${this.variants[1]}, C: ${this.variants[2]}, D: ${this.variants[3]}\n`;
    }
}

class Timer {
    constructor() {

    }
}

main();


/*what is your name?
                Alex
                Hello, Alex. Let's start the game!
                1. Q1
                A: a1, B: a2, C: a3, D:a4
          a2
          Correct!
          2. Q2
          A: a1, B: a2, C: a3, D:a4
          a3
          Incorrect! Correct answer is a4.
                Restart the game? Yes/No
          Yes
          ....*/


















































