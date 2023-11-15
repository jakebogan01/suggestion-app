const Reply = require( "../models/replyModel" );
const mongoose = require("mongoose");

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
     const { body, user, comment } = req.body;

     try {
          const reply = await Reply.create({
               body,
               user,
               comment,
          });
          res.status( 200 ).json( reply );
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

// DELETE reply
const deleteReply = async ( req, res ) => {
     const { id } = req.params;

     if ( !mongoose.Types.ObjectId.isValid( id ) ) {
          return res.status( 404 ).json({ error: "No such reply" });
     }

     const reply = await Reply.findOneAndDelete({ _id: id });

     if ( !reply ) {
          return res.status( 404 ).json({ error: "No such reply" });
     }

     try {
          res.status( 200 ).json({ message: "Reply deleted successfully" });
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

module.exports = {
     getReplies,
     createReply,
     deleteReply
};