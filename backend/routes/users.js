const express = require("express");
const { login, register } = require("../controllers/userController");
const router = express.Router();

router.post("/login", login); // LOGIN

router.post("/register", register); // REGISTER

module.exports = router;
