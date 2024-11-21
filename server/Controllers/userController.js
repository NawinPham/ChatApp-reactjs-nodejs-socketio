const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const oauth2Client = require("../utils/oauth2Client");
const { google } = require("googleapis");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) return res.status(400).json("email exist");

    if (!name || !password || !email)
      return res.status(400).json("all required");

    if (!validator.isEmail(email))
      return res.status(400).json("email must be a valid email  ");

    if (password > 8)
      return res
        .status(400)
        .json("Password must be more than eight characters");

    // if (!validator.isStrongPassword(password))
    //   return res.status(400).json("password must be a valid password");

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json("Email is invalid");

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(400).json("invalid email or password");

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, username: user.name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userModel.find();

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getGoogleUrl = async (req, res) => {
  const scope = [
    " https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scope,
    include_granted_scopes: true,
  });

  res.redirect(authUrl);
};

const getGoogleCallback = async (req, res) => {
  const { code } = req.query;

  try {
    // Get the access token from the code
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Use the Google OAuth2 API to get user info
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const { data } = await oauth2.userinfo.get();
    console.log("User Info:", data);

    const { name, email, picture } = data;

    let user = await userModel.findOne({ email });
    if (!user) {
      user = new userModel({
        name: name,
        email: email,
        image: picture,
      });
      await user.save();
    }

    res.redirect(
      `http://localhost:5173/?user=${encodeURIComponent(
        JSON.stringify({
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
        })
      )}`
    );
  } catch (error) {
    console.error("Error during Google OAuth callback:", error);
    res.status(500).json({ message: error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  getUser,
  getGoogleUrl,
  getGoogleCallback,
};
