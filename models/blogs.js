const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        type : String,
         required : false
    },
    likes : {
        type : Number,
        default : 0,
    },
    categories : {
        type : Array,
        required : false
    },
    createdBy : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : [true,"pleace provide UserId"]
    },
    authorName : {
        type : String,
        required : [true,"pleace provide UserName"]
    },
    authorImage : {
        type : String,
        required : false
    }
},{timestamps : true})

module.exports = mongoose.model("BlogArticle",blogSchema)