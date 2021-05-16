import Question from './Question.js';


class QuestionGenerator {
    async generateQuestions() {
        const resultQuestions = [];
        let response = await fetch('/questions.json');
        let data = await response.json();
        console.log(data);
        for (let jq of data) {
            const curq = new Question(jq["phrase"], jq["vars"], jq["cor_ind"], jq["price"]);
            resultQuestions.push(curq);
        } 
        return resultQuestions;
    }
}
export default QuestionGenerator;