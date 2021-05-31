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
}
export default Question;