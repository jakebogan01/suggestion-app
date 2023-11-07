const Suggestion = require( "../models/suggestionModel" );
const mongoose = require( "mongoose" );

// GET all suggestions
const getSuggestions = async ( req, res ) => {
     const suggestions = await Suggestion.find().select( "title slug description tag user_id" ).sort({ createdAt: -1 });

     try {
          res.status( 200 ).json( suggestions );
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

// GET suggestion
const getSuggestion = async ( req, res ) => {
     const { slug } = req.params;
     const suggestion = await Suggestion.find( { slug: slug } )
             .populate({
                  path: "comments",
                  select: "body createdAt",
                  populate: {
                       path: "replies",
                       model: "Reply",
                       select: "body createdAt"
                  }
             });

     if ( !suggestion || suggestion.length === 0 ) {
          return res.status( 404 ).json({ error: "No such feedback" });
     }

     try {
          res.status( 200 ).json( suggestion );
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

// POST suggestion
const createSuggestion = async ( req, res ) => {
     const { title, slug, description, department, tag, user_id } = req.body;
     const existingSlug = await Suggestion.findOne({ slug });
     const userId = req.user._id;
     let emptyFields = [];

     if (existingSlug) {
          return res.status( 400 ).json({ error: 'Slug is already in use', emptyFields });
     }

     if (!title) {
           emptyFields.push( "title" );
     }
     if (!description) {
          emptyFields.push( "description" );
     }
     if (!department) {
          emptyFields.push( "department" );
     }
     if (!tag) {
          emptyFields.push( "tag" );
     }
     if ( emptyFields.length > 0 ) {
          return res.status( 400 ).json({ error: 'Please fill in all the fields', emptyFields });
     }

     try {
          const suggestion = await Suggestion.create({
               title,
               slug,
               description,
               department,
               tag,
               user_id: userId
          });
          res.status( 200 ).json( suggestion );
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

// DELETE suggestion
const deleteSuggestion = async ( req, res ) => {
     const { id } = req.params;

     if ( !mongoose.Types.ObjectId.isValid( id ) ) {
          return res.status( 404 ).json({ error: "No such feedback" });
     }

     const suggestion = await Suggestion.findOneAndDelete({ _id: id });

     if ( !suggestion ) {
          return res.status( 404 ).json({ error: "No such feedback" });
     }

     try {
          res.status( 200 ).json({ message: "Suggestion deleted successfully" });
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

// UPDATE suggestion
const updateSuggestion = async ( req, res ) => {
     const { id } = req.params;

     if ( !mongoose.Types.ObjectId.isValid( id ) ) {
          return res.status( 404 ).json({ error: "No such feedback" });
     }

     const suggestion = await Suggestion.findOneAndUpdate(
         { _id: id }, { ...req.body }
     );

     if ( !suggestion ) {
          return res.status( 404 ).json({ error: "No such feedback" });
     }

     try {
          res.status( 200 ).json({ message: "Suggestion updated successfully" });
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

module.exports = {
     getSuggestions,
     getSuggestion,
     createSuggestion,
     deleteSuggestion,
     updateSuggestion
};