const express = require("express");
const {
  createChat,
  findUserChat,
  findChat,
} = require("../Controllers/chatController");

const router = express.Router();

router.post("/create", createChat);
router.get("/:userId", findUserChat);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
