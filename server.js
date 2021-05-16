const port = 3000;
const pgp = require('pg-promise')(/* options */)
console.log(process.env.connStr)
const db = pgp(process.env.connStr)

// db.one(`INSERT INTO tset_table (name) VALUES ('user');`).catch((error) => {});
// db.one('SELECT * FROM tset_table LIMIT 1;')
//     .then(function (data) {
//         console.log('RECIEVED DATA:', data)
//   })



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
    res.se
    res.sendFile(__dirname + '/index.html');
});

app.post('/gameResult', (req, res)=>{
    //....
    res.sendFile(__dirname+'/leaderboard.html')
})