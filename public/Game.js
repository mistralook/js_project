import Question from './Question.js';
import Player from './Player.js';
import QuestionGenerator from './QuestionGenerator.js'


const Hints = {
    "FiftyFifty": 0,
    "FriendCall": 1,
    "AskTheAudience": 2
}

const GuaranteedScore = [300,200,100]

class Game {
    constructor(playerName) {
        this.score = 0;
        // this.player = new Player(playerName);
        this.stage = 1;
        this.currentQuestion;
        this.playerName = playerName;
        this.isAlive = true;
        this.availableHints = new Set([Hints.FriendCall, Hints.FiftyFifty, Hints.AskTheAudience]);
    };

    async initPool(){
        const gen = new QuestionGenerator();     
        this.pool = await gen.generateQuestions();
    }

    checkAnswer(currentQuestion, answer) {
        if (answer === currentQuestion.getCorrectAnswer()) {
            this.score += currentQuestion.price;
        } else {
            console.log(`correct is ${currentQuestion.getCorrectAnswer()}`)
            console.log(`given is ${answer}`)
            this.isAlive = false;
            const score = GuaranteedScore.filter((element) => element <= this.score)
            this.score = score.length === 0 ? 0 : score[0];
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
        }
        else
            this.availableHints.delete(hintType);
        if (hintType === Hints.FiftyFifty) {
            const incorrectAnsIndexes = [0, 1, 2, 3].filter(x => x !== question.correctAnswerIndex)
            let twoIncorIndexes = incorrectAnsIndexes
                .sort(function () { return .5 - Math.random() }) // Shuffle array
                .slice(0, 2); // Get first 2 items
            let incorInd1 = twoIncorIndexes[0];
            let incorInd2 = twoIncorIndexes[1];
            return [incorInd1, incorInd2]
        }
        else if (hintType === Hints.FriendCall) {
            const correctAnswerIndex = question.correctAnswerIndex;
            const answers = question.variants.slice(0);//copy
            for (let i = 0; i < 7; i++)
                answers.push(answers[correctAnswerIndex])
            const resWideIndex = Math.floor(Math.random() * (answers.length - 1));
            const ans = answers[resWideIndex];
            return question.variants.indexOf(ans);
        }
        else if (hintType === Hints.AskTheAudience) {

        }

    }
}
export default Game;
