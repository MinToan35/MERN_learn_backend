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

module.exports = router;
