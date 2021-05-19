const port = 3000;
const pgp = require('pg-promise')(/* options */)
console.log(process.env.connStr)
const db = pgp(process.env.connStr)


const bodyParser = require("body-parser");
const express = require('express');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve files from the public directory
app.use(express.static('public'));

// start the express web server listening on 8080
app.listen(port, () => {
    console.log('listening on 3000');
});

// serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/start.html');
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

app.get('/game', (req, res) => {
    const userName = req.query.name;
    console.log(req);
    res.render("game",{userName : userName});
});

app.post('/postResults', async (req, res) => {
    const data=await req.body;
    res.send(req.body);
    const sc = data.score;
    const plName= data.name;
    console.log(`recieved score is ${sc}, playerName is ${plName}`)
    const query=`INSERT INTO leaderboard (name, score) VALUES ('${plName}', ${sc}) ON CONFLICT (name) DO UPDATE SET score = leaderboard.score + EXCLUDED.score;`;
    console.log(query);
    await db.none(query);
});