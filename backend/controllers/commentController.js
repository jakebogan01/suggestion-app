const Comment = require( "../models/commentModel" );
const mongoose = require("mongoose");
const Suggestion = require("../models/suggestionModel");

// GET all comments
const getComments = async ( req, res ) => {
     const comments = await Comment.find()
          .populate('user replies', ['email', 'createdAt', 'body'])
          .sort({ createdAt: -1 });

     try {
     res.status( 200 ).json( comments );
     } catch ( error ) {
     res.status( 400 ).json({ error });
     }
};

// POST comment
const createComment = async ( req, res ) => {
     const { body, user, suggestion } = req.body;

     try {
          const comment = await Comment.create({
               body,
               user,
               suggestion,
          });
          res.status( 200 ).json( comment );
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

// DELETE comment
const deleteComment = async ( req, res ) => {
     const { id } = req.params;

     if ( !mongoose.Types.ObjectId.isValid( id ) ) {
          return res.status( 404 ).json({ error: "No such comment" });
     }

     const comment = await Comment.findOneAndDelete({ _id: id });

     if ( !comment ) {
          return res.status( 404 ).json({ error: "No such comment" });
     }

     try {
          res.status( 200 ).json({ message: "Comment deleted successfully" });
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

module.exports = {
     getComments,
     createComment,
     deleteComment
};