import QuestionGenerator from './QuestionGenerator.js'

const Hints = {
    "FiftyFifty": 0,
    "FriendCall": 1,
    "AskTheAudience": 2
}

const GuaranteedScore = [0, 500, 1000, 1500, 2000]

class Game {
    constructor(playerName) {
        this.score = 0;
        this.stage = 1;
        this.currentQuestion;
        this.playerName = playerName;
        this.isAlive = true;
        this.availableHints = new Set([Hints.FriendCall, Hints.FiftyFifty, Hints.AskTheAudience]);
    };

    async initPool() {
        const gen = new QuestionGenerator();
        this.pool = await gen.generateQuestions();
    }
    computeScore() {
        if (!this.isAlive) {
            const guarantedScore = GuaranteedScore.filter(item => item <= this.score);
            this.score = guarantedScore[guarantedScore.length - 1];
        }
    }
    checkAnswer(currentQuestion, answer) {
        if (answer === currentQuestion.getCorrectAnswer()) {
            this.score += currentQuestion.price;
        } else {

            this.isAlive = false;
        }
    }

    * start() {
        for (const question of this.pool) {
            this.currentQuestion = question;
            yield question;
            this.stage++;
        }
    }

    activateHint(hintType) {
        const question = this.currentQuestion;
        if (!this.availableHints.has(hintType)) {
            return;
        } else
            this.availableHints.delete(hintType);
        if (hintType === Hints.FiftyFifty) {
            const incorrectAnsIndexes = [0, 1, 2, 3].filter(x => x !== question.correctAnswerIndex)
            let twoIncorIndexes = incorrectAnsIndexes
                .sort(function () {
                    return .5 - Math.random()
                })
                .slice(0, 2);
            let incorInd1 = twoIncorIndexes[0];
            let incorInd2 = twoIncorIndexes[1];
            return [incorInd1, incorInd2]
        } else if (hintType === Hints.FriendCall) {
            const correctAnswerIndex = question.correctAnswerIndex;
            const answers = question.variants.slice(0);
            for (let i = 0; i < 7; i++)
                answers.push(answers[correctAnswerIndex])
            const resWideIndex = Math.floor(Math.random() * (answers.length - 1));
            const ans = answers[resWideIndex];
            return question.variants.indexOf(ans);
        } else if (hintType === Hints.AskTheAudience) { }
    }
}

export default Game;