const mongoose = require("mongoose");
const blogPost = require("../models/blogs")
const User = require("../models/user");


const getAllblogPosts = async (req, res) => {
    const {category,createdBy,sort} = req.query

    try {
        let posts;
        if (category) {
            posts = await blogPost.find({
                categories: { $in: [category] }
            })
        }else if(createdBy) {
            posts = await blogPost.find({createdBy})
        }else if(sort){
            posts = await blogPost.find({},{"title" : 1,_id : 1,"createdAt" : 1,"image" : 1}).sort({"createdAt" : -1}).limit(4)
        } else {
            posts = await blogPost.find();
        }

       return res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ msg: "some problem in getAllBlogPosts", error : error.message })
    }
}

const addBlogPost = async (req, res) => {
  
    try {
    const user = await User.findById({ _id : req.user.userId })

    const obj = {
        title : req.body.title,
        description : req.body.description,
        createdBy : req.user.userId,
        authorName : req.user.name,
        categories : req.body.categories,
        authorImage : user.profilePic,
        image : req.file === undefined ? "blogExample.jpg" : req.file.filename 
    }

        const createNewPost = await blogPost.create(obj);

        res.status(200).json({ createNewPost })

    } catch (error) {
        res.status(404).json({msg : "some problem in addBlogpost", err : error.message })
    }
}


const getSinglePost = async (req, res) => {
    try {
        const { id } = req.params;

        const singlePost = await blogPost.findById(id);

        res.status(200).json(singlePost)

    } catch (error) {
        res.status(404).json({ msg: "some problem in getSinglePost", error: error })
    }
}


const updateSingleBlogPost = async (req, res) => {
    const { title, description, categories} = req.body;
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `post ${id} not found` });
    }

    try {
        const updateBlogPost = {
            title,
            description,
            categories, 
            image :  req.file && req.file.filename,
            _id: id
        };

        await blogPost.findByIdAndUpdate(id, updateBlogPost, { new: true });

        res.status(200).json(updateBlogPost)

    } catch (error) {
        res.status(400).json({ msg: "some problem in updateSinglePost", error: error.message })
    }
}


const removeSingleBlogPost = async (req, res) => {
    const {userId} = req.user
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `post ${id} not found` });
    }

    try {
        const post =  await blogPost.findByIdAndRemove({_id : id, createdBy  : userId})
       
        if(!post){
            throw new Error(`No post  in this ${id}`)
        }
        res.status(200).json({ msg: "Successfully deleted" })

    } catch (error) {
        res.status(400).json({ msg: "some problem in removeSinglePost", error: error })
    }
}

const likeblogPosts = async (req, res) => {
    const user = req.user.userId;
    const { id } = req.params;

    if (!user) {
        return res.staus(404).json({ msg: `user ${user} not found` });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `post ${id} not found` });
    }
    try {
        const post = await blogPost.findById(id)

        await blogPost.findByIdAndUpdate(
            id,
            { likes: post.likes + 1 },
            { new: true }
        )

        res.status(200).json({msg : "succesfully liked post"})

    } catch (error) {
        res.status(400).json({ msg: "some problem in likeingSinglePost", error : error.message })
    }
}

module.exports = {
    getAllblogPosts, addBlogPost, getSinglePost, updateSingleBlogPost,
    removeSingleBlogPost, likeblogPosts
}

// else {
//     posts = await blogPost.find();
// }