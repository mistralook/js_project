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
export default Question;