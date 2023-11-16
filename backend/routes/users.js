const express = require("express");
const {login, register, getUsers, getUser, deleteUser, updateUser} = require("../controllers/userController");
const router = express.Router();

router.post("/login", login); // LOGIN
router.post("/register", register); // REGISTER
router.get("/", getUsers); // GET all users
router.get("/:id", getUser); // GET user
router.delete("/:id", deleteUser); // DELETE user
router.patch("/:id", updateUser); // UPDATE user

module.exports = router;
