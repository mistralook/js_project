app.post('/postResults', (req, res) => {
    const j=req.json();
    const userName=j["name"];
    const score=j["score"];
    await db.none(`INSERT INTO leaderboard (name, score) VALUES (${userName}, ${score}) ON CONFLICT (name) DO UPDATE  score = leaderboard.score + EXCLUDED.score;`)
    res.sendFile(__dirname + '/leaderboard.html')
})