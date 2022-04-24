const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '貼文姓名未寫']
    },
    tags: {
      type: String,
      required: [true, '貼文標籤 tags 未填寫']
    },
    type: {
      type: String,
      enum: ['group', 'person'],
      required: [true, '貼文類型 type 未填寫']
    },
    image: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: 0
    },
    content: {
      type: String,
      required: [true, 'Content 未填寫']
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false
  }
);

const posts = mongoose.model('posts', postSchema);

module.exports = posts;