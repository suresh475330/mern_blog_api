const express = require("express")
const category = require("../models/category")
const router = express.Router()


router.post("/", async (req,res)=> {
  const newCat = new category(req.body);
  try {
    const saveCat = await newCat.save()
    res.status(200).json(saveCat)
  } catch (error) {
    res.status(400).json({msg : "some problem in catgory", error})
  }
})

router.get("/", async (req,res)=> {
  try {
    const cats = await category.find()
    res.status(200).json(cats)
  } catch (error) {
    res.status(400).json({msg : "some problem in catgory", error})
  }
})
router.delete("/:id", async (req,res)=> {
  const {id} = req.params
  try {
    const cats = await category.findByIdAndRemove(id)
    res.status(200).json("succesfully delete")
  } catch (error) {
    res.status(400).json({msg : "some problem in catgory", error})
  }
})

module.exports = router;