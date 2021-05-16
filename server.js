const port = 3000;
const pgp = require('pg-promise')(/* options */)
console.log(process.env.connStr)
const db = pgp(process.env.connStr)


const express = require('express');

const app = express();

// serve files from the public directory
app.use(express.static('public'));

// start the express web server listening on 8080
app.listen(port, () => {
    console.log('listening on 3000');
});

// serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/questions.json', async (req, res) => {
    const questions = []
    await db.any(`SELECT * FROM questions;`).then(function (data) {
        for (const record of data)
        {
            questions.push({
                phrase: record["phrase"],
                vars:
                    [record["var1"],
                    record["var2"],
                    record["var3"],
                    record["var4"]],
                cor_ind: record["correct_index"],
                price: record["price"]
            })
        }
        console.log(questions)
    }).catch((error) => { });
    res.json(questions);
})

app.post('/gameResult', (req, res) => {
    //....
    res.sendFile(__dirname + '/leaderboard.html')
})