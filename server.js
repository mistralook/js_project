const port = process.env.PORT || 80;
const pgp = require('pg-promise')()
const db = pgp(process.env.connStr)

const bodyParser = require("body-parser");
const express = require('express');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const leaderboardSize = 15;

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`listening on ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/start.html');
});

app.get('/questions.json', async (req, res) => {
    const questions = await getQuestions();
    res.json(questions);
})

app.get('/game', (req, res) => {
    const userName = req.query.name;
    res.render("game", { userName: userName });
});

app.get('/leaderboard', async (req, res, next) => {
    const userName = decodeURI(req.query.user);
    const leaderboard = await getLeaderboard(userName);
    const inTop = leaderboard.length === leaderboardSize;
    res.render("leaderboard", { data: leaderboard, n: leaderboard.length, inTop: inTop, userName: userName });
})

app.post('/postResults', async (req, res) => {
    const data = await req.body;

    res.send(req.body);
    const sc = data.score;
    const plName = decodeURI(data.name);
    const query = `INSERT INTO leaderboard (name, score) VALUES ('${plName}', ${sc}) ON CONFLICT (name) DO UPDATE SET score = 
        case when leaderboard.score > EXCLUDED.score then leaderboard.score else EXCLUDED.score end;`;
    await db.none(query);
});


async function getLeaderboard(userName) {
    const leaderboard = []

    await db.any(getQueryLeader(userName)).then(function (data) {
        for (const record of data) {
            leaderboard.push({
                place: record["row_number"],
                name: record["name"],
                score: record["score"]
            })
        }
    }).catch((error) => { console.log(error) });
    return leaderboard;
}

function getQueryLeader(userName) {
    return "(select row_number() over(order by score desc), *\n" +
        "           from  ( select * from  leaderboard) filtered_sales\n" +
        `LIMIT ${leaderboardSize})\n` +
        "UNION DISTINCT\n" +
        "SELECT * FROM (select row_number() over(order by score desc), *\n" +
        "           from  ( select * from  leaderboard) filtered_sales\n" +
        ") as foo\n" +
        `WHERE name ='${userName}'\n` +
        "ORDER BY row_number"
}

const questionsQuery = "SELECT * FROM(\n" +
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

async function getQuestions() {
    const questions = []
    await db.any(questionsQuery).then(function (data) {
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
    }).catch((error) => { console.log(error) });
    return questions;
}