const port = process.env.PORT || 80;
const pgp = require('pg-promise')(/* options */)
const db = pgp(process.env.connStr)


const bodyParser = require("body-parser");
const express = require('express');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.listen(port, () => {
    console.log('listening on 3000');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/start.html');
});

const query = "SELECT * FROM(\n" +
    "(SELECT * FROM questions\n" +
    " WHERE price = 100\n" +
    " ORDER BY RANDOM()\n" +
    " LIMIT 5)\n" +
    " UNION\n" +
    " (SELECT * FROM questions\n" +
    " WHERE price = 200\n" +
    " ORDER BY RANDOM()\n" +
    " LIMIT 5)\n" +
    " UNION\n" +
    " (SELECT * FROM questions\n" +
    " WHERE price = 300\n" +
    " ORDER BY RANDOM()\n" +
    " LIMIT 5)\n" +
    ") as foo ORDER BY price;"

app.get('/questions.json', async (req, res) => {
    const questions = []
    await db.any(query).then(function (data) {
        for (const record of data) {
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
    }).catch((error) => { });
    res.json(questions);
})


app.get('/game', (req, res) => {
    const userName = req.query.name;
    res.render("game", { userName: userName });
});


const queryLeader = 'SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10;';
app.get('/gg', async (req, res, next) => {
    const leaderboard = []
    await db.any(queryLeader).then(function (data) {
        for (const record of data) {
            leaderboard.push({
                name: record["name"],
                score: record["score"]
            })
        }
    }).catch((error) => { });
    res.render("leaderboard", { data: leaderboard });
})//,function(req, res){
//res.sendFile(__dirname + '/views/leaderboard.ejs')});

app.post('/postResults', async (req, res) => {
    const data = await req.body;
    res.send(req.body);
    const sc = data.score;
    const plName = data.name;
    const query = `INSERT INTO leaderboard (name, score) VALUES ('${plName}', ${sc}) ON CONFLICT (name) DO UPDATE SET score = leaderboard.score + EXCLUDED.score;`;
    await db.none(query);
});
