const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Register a new user
const register = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const savedUser = await User.findOne({username});
    if(savedUser) {
      return res.send({error: "User Already Exists"});
    }
    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password });
    await user.save();
    return res.status(201).send({ message: "Registration successful" });
  } catch (error) {
    next(error);
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
      expiresIn: "1 hour",
    });
    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
