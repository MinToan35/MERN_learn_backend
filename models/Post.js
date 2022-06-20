const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  titles: {
    type: String,
    requires: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["TO LEARN", "LEARNING", "LEARNED"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});
module.exports = mongoose.model("posts", PostSchema);
