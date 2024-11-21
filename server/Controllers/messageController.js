const messageModel = require("../Models/messageModel");

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const message = new messageModel({
      chatId,
      senderId,
      text,
    });

    const response = await message.save();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getMessage = async (req, res) => {
  const { chatId } = req.params;

  try {
    const message = await messageModel.find({ chatId });

    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { createMessage ,getMessage};
