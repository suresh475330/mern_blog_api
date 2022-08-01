const express = require("express");
const router = express.Router();
const multer = require("multer")

const {getAllblogPosts,addBlogPost,
    getSinglePost,updateSingleBlogPost,
removeSingleBlogPost,likeblogPosts} = require("../controllers/blogPosts")

const verifyToken = require("../middeware/verifyToken")


const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null, "../server/public/postImg")
    },
    filename : (req,file,cb) => {
        cb(null,Date.now() + "-" + file.originalname)
    }
})

const upload = multer({storage : storage})

router.get("/",getAllblogPosts)
router.post("/",verifyToken,upload.single("file"),addBlogPost)
router.get("/:id",getSinglePost)
router.patch("/:id",verifyToken,upload.single("file"),updateSingleBlogPost)
router.delete("/:id",verifyToken,removeSingleBlogPost)
router.patch("/likePost/:id",verifyToken,likeblogPosts)

module.exports = router

