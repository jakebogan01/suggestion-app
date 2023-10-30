const express = require( "express" );
const {
    getReplies,
    createReply
} = require( "../controllers/replyController" );
const router = express.Router();

router.get( "/", getReplies ); // GET all replies
router.post( "/", createReply ); // POST reply

module.exports = router;