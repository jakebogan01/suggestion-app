const dotenv = require("dotenv");
const express = require('express');
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

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));