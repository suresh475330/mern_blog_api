
const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {

  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(400).json({ msg: "Authentication invalid / check authentication header" })
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
    // console.log(payload)
    req.user = { userId: payload.userId, name: payload.name }
    
    next()
  } catch (error) {
    res.status(401).json({ msg: "Authication  invalid from verifyToken" ,error : error.message})
  }
}

module.exports = verifyToken