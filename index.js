const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Test backend');
});

app.listen(port, () => {
    console.log(`Backend running on ${port}`);
})