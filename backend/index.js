const dotenv = require("dotenv");
const express = require('express');
const mongoose = require('mongoose');
const suggestionRoutes = require('./routes/suggestions');

const app = express();
dotenv.config();

// middleware
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// routes
app.use('/api/suggestions', suggestionRoutes);

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`Connected to database & listening on port ${process.env.PORT}`));
    })
    .catch((error) => console.log(error));