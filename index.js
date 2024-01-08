const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Test backend');
});

app.post('/user', (req, res) => {
    console.log('api called')
    console.log(req.body);
})

app.listen(port, () => {
    console.log(`Backend running on ${port}`);
})