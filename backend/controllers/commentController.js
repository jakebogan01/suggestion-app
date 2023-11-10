const Comment = require( "../models/commentModel" );

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

module.exports = {
     getComments,
     createComment
};