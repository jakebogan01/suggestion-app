const express = require( "express" );
const { getSuggestions, getSuggestion, createSuggestion, deleteSuggestion, updateSuggestion } = require( "../controllers/suggestionController" );
const router = express.Router();

router.get( "/", getSuggestions ); // GET all suggestions
router.get( "/:slug", getSuggestion); // GET suggestion
router.post( "/", createSuggestion ); // POST suggestion
router.delete( "/:id", deleteSuggestion); // DELETE suggestion
router.patch( "/:id", updateSuggestion); // UPDATE suggestion

module.exports = router;