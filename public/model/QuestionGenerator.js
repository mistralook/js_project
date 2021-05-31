import Question from './Question.js';

function shuffle(arr){
    let j, temp;
    for(let i = arr.length - 1; i > 0; i--){
        j = Math.floor(Math.random()*(i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

class QuestionGenerator {
    async generateQuestions() {
        const resultQuestions = [];
        let response = await fetch('/questions.json');
        let data = await response.json();
        console.log(data);
        for (let jq of data) {
            const rightAnswer = jq["vars"][jq["cor_ind"]]
            const vars = shuffle(jq["vars"])
            const rightIndex = vars.indexOf(rightAnswer)
            const curq = new Question(jq["phrase"], vars, rightIndex, jq["price"]);
            resultQuestions.push(curq);
        }
        return resultQuestions;
    }
}
export default QuestionGenerator;