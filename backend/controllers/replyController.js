const Reply = require( "../models/replyModel" );

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

module.exports = {
     getReplies,
     createReply
};