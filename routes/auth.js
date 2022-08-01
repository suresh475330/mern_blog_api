const express = require("express")
const multer = require("multer")
const router = express.Router()
const some = require(".././")

const {register,login,getUser} = require("../controllers/auth")

// middleware
const verifyToken = require("../middeware/verifyToken")


const storage = multer.diskStorage({

    destination : (req,file,cb) => {
        cb(null, "../server/public/profileImg")
    },
    filename : (req,file,cb) => {
        cb(null,Date.now() + "-" + file.originalname)
    }
})

const upload = multer({storage : storage})


router.post("/register",upload.single("file"),register)
router.post("/login",login)
router.get("/user",verifyToken,getUser)


module.exports = router
