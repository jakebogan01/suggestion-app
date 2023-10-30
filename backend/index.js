const dotenv = require( "dotenv" );
const express = require( "express" );
const mongoose = require( "mongoose" );
const cors = require( "cors" );
const suggestionRoutes = require( "./routes/suggestions" );
const commentRoutes = require( "./routes/comments" );
const replyRoutes = require( "./routes/replies" );

const app = express();
app.use( cors({ origin: "*" }) );
app.use( express.json() );
dotenv.config();

// middleware
app.use(( req, res, next ) => {
    console.log( req.path, req.method );
    next();
});

// routes
app.use( "/api/suggestions", suggestionRoutes );
app.use( "/api/comments", commentRoutes );
app.use( "/api/replies", replyRoutes );

// connect to db
mongoose.connect( process.env.MONGO_URI )
    .then(() => {
        app.listen( process.env.PORT, () => console.log( `Connected to database & listening on port ${process.env.PORT}` ));
    })
    .catch(( error ) => console.log( error ));