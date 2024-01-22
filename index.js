const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const SSLCommerzPayment = require('sslcommerz-lts')
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// database connect
const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'raihan'
});

app.get('/', (req, res) => {
    res.send('Test backend');
});

app.get('/db', (req, res) => {
    dbConnection.query("SELECT * FROM tmi", (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(result)
            console.log(result)
        }
    })
});


// admin check
// app.get('/db/:email', async (req, res) => {

//     dbConnection.query("SELECT * FROM tmi", (err, result) => {
//         if (err) {
//             console.log(err)
//         }
//         else {
//             res.send(result)
//         }
//     })

//     const email = req.params.email;
//     const query = { email };
//     const user = await userCollection.findOne(query);
//     res.send({ isAdmin: user?.role === 'admin' });
// });


app.post('/sign', (req, res) => {
    const sql = "INSERT into tmi (`Name`,`Address`,`Email`, `Phone`,`Password`) VALUES(?)";
    const values = [
        req.body.name,
        req.body.address,
        req.body.email,
        req.body.phone,
        req.body.password
    ]

    dbConnection.query(sql, [values], (err, data) => {
        if (err) return res.json("Error")
        return res.json(data);
    })
})

// app.post('/user', (req, res) => {
//     console.log('api called')
//     console.log(req.body);
// })

app.listen(port, () => {
    console.log(`Backend running on ${port}`);
})