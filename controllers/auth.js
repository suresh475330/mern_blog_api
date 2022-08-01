const User = require("../models/user");
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")


const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    const salt = await bcryptjs.genSalt(10)
    const hassedPassword = await bcryptjs.hash(password, salt)

    const user = await User.create({
      name,
      email,
      password: hassedPassword,
      profilePic : req.file === undefined  ? "avatar.jpg" : req.file.filename 
    })

    const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_LIFETIME
    })

    res.status(200).json({ user:{ name : user.name, _id : user._id , profilePic : user.profilePic}, token })

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({ msg: "User already exits" })
    }
    res.status(400).json({ msg: error.message, error : error})
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide valied field" })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({ msg: "Can't find the user" })
  }

  const isPasswordCorrect = await bcryptjs.compare(password, user.password)

  if (!isPasswordCorrect) {
    return res.status(400).json({ msg: "Incorrect password / Invalid Credentials" })
  }

  const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_LIFETIME
  })

  try {
    res.status(200).json({ user:{ name : user.name, _id : user._id , profilePic : user.profilePic}, token })
  } catch (error) {
    res.status(400).json({ msg: error.message, error })
  }
}

const getUser = async (req,res) => {
  const { userId, name } = req.user
  try {
    const user = await User.findById({ _id : userId })
    res.status(200).json({ user })
  } catch (error) {
    res.status(400).json({ msg: error.message, error })
  }
}


module.exports = {
  register, login, getUser
}
