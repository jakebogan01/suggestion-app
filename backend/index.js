const dotenv = require("dotenv");
const express = require('express');

const app = express(); // create express app
dotenv.config(); // initialize dotenv

// middleware
app.use((req, res, next) => {
    console.log(req.path, req.method); // log the request path and method
    next(); // call next to move on to the next middleware
});

// routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`)); // listen for requests