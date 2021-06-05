const port = 3000;
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
    }).catch((error) => { });
    res.json(questions);
})


app.get('/game', (req, res) => {
    const userName = req.query.name;
    res.render("game",{userName : userName});
});
const queryCount = "SELECT COUNT(*) FROM leaderboard;";


function getQueryLeader(userName) {
    return  "(select row_number() over(order by score desc), *\n" +
        "           from  ( select * from  leaderboard) filtered_sales\n" +
        "LIMIT 15)\n" +
        "UNION DISTINCT\n" +
        "SELECT * FROM (select row_number() over(order by score desc), *\n" +
        "           from  ( select * from  leaderboard) filtered_sales\n" +
        ") as foo\n" +
        `WHERE name ='${userName}'\n` +
        "ORDER BY score DESC"
}



app.get('/leaderboard', async (req, res,next) => {
    const leaderboard = []
    const userName = req.query.user;
    const leaderboardCount = await db.any(queryCount).catch((error) => { });

    await db.any(getQueryLeader(userName)).then(function (data) {
        for (const record of data)
        {
            leaderboard.push({
                place:record["row_number"],
                name: record["name"],
                score: record["score"]
            })
        }
    }).catch((error) => { });
    const inTop = leaderboard.length === Math.min(leaderboardCount[0].count, 15);
    res.render("leaderboard",{data:leaderboard, n:leaderboard.length, inTop:inTop,userName:userName});
})

app.post('/postResults', async (req, res) => {
    const data=await req.body;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.setHeader("Referrer-Policy","strict-origin-when-cross-origin")
    res.send(req.body);
    const sc = data.score;
    const plName= data.name;
    const query=`INSERT INTO leaderboard (name, score) VALUES ('${plName}', ${sc}) ON CONFLICT (name) DO UPDATE SET score = 
        case when leaderboard.score > EXCLUDED.score then leaderboard.score else EXCLUDED.score end;`;
    await db.none(query);
});
