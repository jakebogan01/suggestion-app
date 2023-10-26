const express = require('express');
const app = express(); // create express app

// routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.listen(4000, () => console.log('Listening on port 4000')); // listen for requests