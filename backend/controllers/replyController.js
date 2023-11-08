const Reply = require( "../models/replyModel" );
const Comment = require( "../models/commentModel" );
const mongoose = require( "mongoose" );
const Suggestion = require("../models/suggestionModel");

// GET all replies
const getReplies = async ( req, res ) => {
     const replies = await Reply.find();

     try {
          res.status( 200 ).json( replies );
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

// POST reply
const createReply = async ( req, res ) => {
     try {
          const reply = new Reply( req.body );
          await reply.save();

          const comment = await Comment.findById({ _id: reply.comment });
          comment.replies.push( reply );
          await comment.save();

          res.status( 200 ).json({ reply });
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

module.exports = {
     getReplies,
     createReply
};