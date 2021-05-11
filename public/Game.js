import Question from './Question.js';
import Player from './Player.js';
import QuestionGenerator from './QuestionGenerator.js'


const Hints = {
    "FiftyFifty": 0,
    "FriendCall": 1,
    "AskTheAudience": 2
}

class Game {
        constructor(playerName) {
        this.pool = QuestionGenerator.generateQuestions();
        this.score = 0;
        // this.player = new Player(playerName);
        this.player = 'Andrey';
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
export default Game;