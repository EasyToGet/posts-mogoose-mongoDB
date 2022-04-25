const http = require('http');
const headers = require('./service/headers');
const mongoose = require('mongoose');
const { successHandle, errorHandle } = require('./service/handle');
const dotenv = require('dotenv');
const Posts = require('./models/post');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB)
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
    successHandle(res, '取得成功', allPosts);
  } else if (req.url == '/posts' && req.method == 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        if (data.content !== '') {
          const newPost = await Posts.create(data)
          successHandle(res, '新增成功', newPost);
        } else {
          errorHandle(res, '欄位沒有正確，或沒有此 ID');
        }
      } catch (error) {
        errorHandle(res, '欄位沒有正確，或沒有此 ID');
      }
    })
  } else if (req.url == '/posts' && req.method == 'DELETE') {
    await Posts.deleteMany({});
    const deleteAll = await Posts.find();
    successHandle(res, '刪除成功', deleteAll);
  } else if (req.url.startsWith('/posts/') && req.method == 'DELETE') {
    try {
      const id = await req.url.split('/').pop();
      const deleteSingle = await Posts.findByIdAndDelete(id);
      if (deleteSingle) {
        successHandle(res, '刪除成功', deleteSingle);
      } else {
        errorHandle(res, '欄位沒有正確，或沒有此 ID');
      }
    } catch (error) {
      errorHandle(res, '欄位沒有正確，或沒有此 ID');
    }
  } else if (req.url.startsWith('/posts/') && req.method == 'PATCH') {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        const data = JSON.parse(body);
        const patchData = await Posts.findByIdAndUpdate(id, data, { new: true });
        if (data.content !== '' && patchData) {
          successHandle(res, '更新成功', patchData);
        } else {
          errorHandle(res, '欄位沒有正確，或沒有此 ID');
        }
      } catch (error) {
        errorHandle(res, '欄位沒有正確，或沒有此 ID');
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
server.listen(process.env.PORT);