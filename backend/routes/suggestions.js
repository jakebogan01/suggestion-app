const express = require("express");
const {getSuggestions, getSuggestion, createSuggestion, deleteSuggestion, updateSuggestion} = require("../controllers/suggestionController");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
router.use(requireAuth);

router.get("/", getSuggestions); // GET all suggestions
router.get("/:slug", getSuggestion); // GET suggestion
router.post("/", createSuggestion); // POST suggestion
router.delete("/:id", deleteSuggestion); // DELETE suggestion
router.patch("/:id", updateSuggestion); // UPDATE suggestion

module.exports = router;