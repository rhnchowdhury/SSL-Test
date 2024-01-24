const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const SSLCommerzPayment = require('sslcommerz-lts')
const port = process.env.PORT || 4000;
require('dotenv').config();

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


app.get('/user', (req, res) => {
    dbConnection.query("SELECT * FROM login", (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(result)
            console.log(result)
        }
    })
});

// SSL Implement

const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_PASSWD;
const is_live = false //true for live, false for sandbox


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
});

app.post('/login', (req, res) => {
    const sql = "INSERT into login (`Name`,`Email`,`Password`) VALUES(?)";
    const values = [
        req.body.name,
        // req.body.address,
        req.body.account,
        // req.body.phone,
        req.body.password,
    ]

    dbConnection.query(sql, [values], (err, data) => {
        if (err) return res.json("Error")
        return res.json(data);
    })
});


app.post('/donate', (req, res) => {
    const sql = "INSERT into donate (`Amount`,`Amount_Type`) VALUES(?)";
    const values = [
        req.body.amount,
        req.body.selects
    ]
    const amount1 = req.body.amount;
    // const test = req.body;
    // dbConnection.query(sql, [amount1], (err, data) => {
    dbConnection.query(sql, [values], (err, data) => {
        if (err) return res.json("Error")
        // return res.json(data);

    })

    const data = {
        total_amount: amount1,
        // total_amount: 100,
        currency: 'BDT',
        tran_id: 'REF123', // use unique tran_id for each api call
        success_url: "http://localhost:4000/payment/success/:tran_id",
        // success_url: `http://localhost:4000/payment/success/${tran_id}`,
        fail_url: 'http://localhost:3030/fail',
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    // const sslcz = new SSLCommerzPayment(process.env.SSL_STORE_ID, process.env.SSL_PASSWD, is_live)
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        // res.redirect(GatewayPageURL)
        res.send({ url: GatewayPageURL })
        console.log('Redirecting to: ', GatewayPageURL)
    });


    app.post('/payment/success/:tran_id', async (req, res) => {
        console.log(req.params.tran_id);

    })

})

// app.post('/user', (req, res) => {
//     console.log('api called')
//     console.log(req.body);
// })

app.listen(port, () => {
    console.log(`Backend running on ${port}`);
})