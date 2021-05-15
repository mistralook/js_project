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
        this.stage = 1;
        this.player = 'Igor Knayzev';
        this.isAlive = true;
        this.availableHints = new Set([Hints.FriendCall, Hints.FiftyFifty, Hints.AskTheAudience]);
    };

    checkAnswer(currentQuestion, answer) {
        if (answer === currentQuestion.getCorrectAnswer()) {
            this.score += currentQuestion.price;
        } else {
            console.log(`correct is ${currentQuestion.getCorrectAnswer()}`)
            console.log(`given is ${answer}`)
            this.isAlive = false;
        }

    }

    * start() {
        for (const question of this.pool) {
            yield question;
            this.stage++;
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
}
export default Game;