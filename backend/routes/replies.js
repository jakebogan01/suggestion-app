const express = require( "express" );
const { getReplies, createReply, deleteReply } = require( "../controllers/replyController" );
const router = express.Router();

router.get( "/", getReplies ); // GET all replies
router.post( "/", createReply ); // POST reply
router.delete( "/:id", deleteReply); // DELETE reply

module.exports = router;