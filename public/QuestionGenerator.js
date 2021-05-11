import Question from './Question.js';

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
export default QuestionGenerator;