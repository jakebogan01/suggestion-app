const express = require('express');

const router = express.Router();

// GET all suggestions
router.get('/', (req, res) => {
    res.json({message: 'GET all suggestions'});
});

// GET suggestion
router.get('/:slug', (req, res) => {
    res.json({message: 'GET a single suggestion'});
});

// POST suggestion
router.post('/', (req, res) => {
    res.json({message: 'POST a new suggestion'});
});

// DELETE suggestion
router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a single suggestion'});
});

// UPDATE suggestion
router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a single suggestion'});
});

module.exports = router;