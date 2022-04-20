const http = require('http');
const headers = require('./service/headers');
const mongoose = require('mongoose');
const { successHandle, errorHandle } = require('./service/handle')

const Posts = require('./models/post');

mongoose.connect('mongodb://localhost:27017/posts')
  .then(() => {
    console.log("資料庫連線成功");
  })
  .catch(err => {
    console.log(err);
  })

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  if (req.url == '/posts' && req.method == 'GET') {
    const allPosts = await Posts.find();
    successHandle(res, allPosts);
  } else if (req.url == '/posts' && req.method == 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        if (data.content) {
          const newPost = await Posts.create(data)
          successHandle(res, newPost);
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res, error);
      }
    })
  } else if (req.method == 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      "status": "false",
      "message": "無此網路路由"
    }));
    res.end();
  }
};


const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);