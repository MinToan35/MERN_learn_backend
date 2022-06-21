const express = require("express");
const router = express.Router();
const verifyToken = require("../midleware/auth");
const Post = require("../models/Post");

//@route GET api/posts
//@desc Get posts
//@access Privates
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.json({ success: true, posts });
  } catch (error) {
    res.json({ success: true, message: "Happy learning!", post: newPost });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  //simple validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  try {
    const newPost = new Post({
      title,
      description,
      url: url.startsWith("https://") ? url : `https://${url}`,
      status: status || "TO LEARN",
      user: req.userId,
    });
    await newPost.save();
    res.json({ success: true, message: "Happy learning!", post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route PUT api/posts
//@desc Update posts
//@access Privates
router.put("/:id", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;
  //simple validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  try {
    let updatePost = {
      title,
      description: description || "",
      url: (url.startsWith("https://") ? url : `https://${url} `) || "",
      status: status || "TO LEARN",
    };
    const postUpdateCondition = { _id: req.params.id, user: req.userId };
    updatePost = await Post.findOneAndUpdate(postUpdateCondition, updatePost, {
      new: true,
    });

    //user not authorised to update post or post not found
    if (!updatePost)
      return res.status(401).json({
        success: false,
        message: "post not found or user not authorised",
      });
    res.json({ success: true, message: "excelent progress", post: updatePost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//@route DELETE api/posts
//@desc DELETE posts
//@access Privates
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletePost = await Post.findOneAndDelete(postDeleteCondition);
    //user not authorised to delete post or post not found
    if (!deletePost)
      return res.status(401).json({
        success: false,
        message: "post not found or user not authorised",
      });
    res.json({ success: true, message: "excelent progress", post: deletePost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
module.exports = router;
