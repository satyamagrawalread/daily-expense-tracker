const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Register a new user
const register = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const savedUser = await User.findOne({username});
    if(savedUser) {
      return res.status(409).send({message: "User Already Exists"});
    }
    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password });
    const userData = await user.save();
    const token = jwt.sign({ userId: userData._id }, process.env.SECRET_KEY, {
      // expiresIn: "1 hour",
    });
    return res.status(201).send({ token });
  } catch (error) {
    console.error(error);
    // next(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
};

// Login with an existing user
const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      // expiresIn: "1 hour",
    });
    res.status(201).send({ token });
  } catch (error) {
    // next(error);
    console.error(error);
    res.status(500).send({ message: "Internal server error" });

  }
};

module.exports = { register, login };
