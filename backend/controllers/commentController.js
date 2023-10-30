const Comment = require( "../models/commentModel" );
const Suggestion = require( "../models/suggestionModel" );
const mongoose = require( "mongoose" );

// GET all comments
const getComments = async ( req, res ) => {
     const comments = await Comment.find().populate({ path: "replies", select: "body" }).sort({ createdAt: -1 });

     try {
          res.status( 200 ).json( comments );
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

// POST comment
const createComment = async ( req, res ) => {
     try {
          const comment = new Comment( req.body );
          await comment.save();

          const suggestion = await Suggestion.findById({ _id: comment.suggestion })
          suggestion.comments.push( comment );
          await suggestion.save();

          res.status( 200 ).json({ comment });
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

module.exports = {
     getComments,
     createComment
};