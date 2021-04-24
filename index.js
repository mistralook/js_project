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
    "FriendCall": 1,
    "AskTheAudience": 2
}


class Game {
    constructor(player) {
        this.pool = QuestionGenerator.generateQuestions();
        this.score = 0;
        this.player = player;
        this.isAlive = true;
        this.currentQuestion = new Question();
        this.availableHints = new Set([Hints.FriendCall, Hints.FiftyFifty, Hints.AskTheAudience]);
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
        const question = this.currentQuestion;
        if (!this.availableHints.has(hintType))
            return;
        else
            this.availableHints.delete(hintType);
        if (hintType === Hints.FiftyFifty) {
            const incorrectAnsIndexes = [0, 1, 2, 3].filter(x => x != question.correctAnswerIndex)
            let twoIncorIndexes = incorrectAnsIndexes
                .sort(function () { return .5 - Math.random() }) // Shuffle array
                .slice(0, 2); // Get first 2 items
            let incorInd1 = twoIncorIndexes[0];
            let incorInd2 = twoIncorIndexes[1];

            question.variants[incorInd1] = "";
            question.variants[incorInd2] = "";
        }
        else if (hintType === Hints.FriendCall) {
            const correctAnswerIndex = question.correctAnswerIndex;
            const answers = question.variants.slice(0);//copy
            for (let i = 0; i < 7; i++)
                answers.push(answers[correctAnswerIndex])
            return answers[Math.floor(Math.random() * answers.length)];
        }
        else if (hintType === Hints.AskTheAudience) {

        }

    }
    representation() {
        return this.currentQuestion.representation() + Array.from(this.availableHints).join(" ") + "\n" + `Current score: ${this.score}`;
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
        console.log(game.representation())
        let action = prompt("Input action:");
        if (action === 'FiftyFifty') {
            game.activateHint(Hints.FiftyFifty);
            console.log(game.currentQuestion.representation())
            action = prompt("Input action:");

        }
        else if (action === 'FriendCall') {
            let frChoice = game.activateHint(Hints.FriendCall);
            console.log(`Friend's choice is ${frChoice}`);
            console.log(game.currentQuestion.representation())
            action = prompt("Input action:");
        }
        game.checkAnswer(action)

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
