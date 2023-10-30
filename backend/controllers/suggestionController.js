const Suggestion = require( "../models/suggestionModel" );
const mongoose = require( "mongoose" );

// GET all suggestions
const getSuggestions = async ( req, res ) => {
     const suggestions = await Suggestion.find({}).sort({ createdAt: -1 });

     try {
          res.status( 200 ).json( suggestions );
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

// GET suggestion
const getSuggestion = async ( req, res ) => {
     const { slug } = req.params;
     const suggestion = await Suggestion.find( { slug: slug } ).populate( "comments" );

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
     const { title, slug, description } = req.body;

     try {
          const suggestion = await Suggestion.create({
               title,
               slug,
               description
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