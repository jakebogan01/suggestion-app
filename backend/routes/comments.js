const express = require( "express" );
const {
    getComments,
    createComment
} = require( "../controllers/commentController" );
const router = express.Router();

router.get( "/", getComments ); // GET all comments
router.post( "/", createComment ); // POST comment

module.exports = router;