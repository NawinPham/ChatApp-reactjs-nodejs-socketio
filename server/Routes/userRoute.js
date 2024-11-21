const express = require("express");
const {
  registerUser,
  loginUser,
  findUser,
  getUser,
  getGoogleUrl,
  getGoogleCallback,
} = require("../Controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUser);

//The google auth url
router.get("/auth/google", getGoogleUrl);
router.get("/auth/google/callback", getGoogleCallback);

module.exports = router;
