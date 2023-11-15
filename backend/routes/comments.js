const express = require( "express" );
const { getComments, createComment, deleteComment } = require( "../controllers/commentController" );
const router = express.Router();

router.get( "/", getComments ); // GET all comments
router.post( "/", createComment ); // POST comment
router.delete( "/:id", deleteComment); // DELETE comment

module.exports = router;