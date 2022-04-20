const headers = require('./headers');

const successHandle = (res, data) => {
  res.writeHead(200, headers);
  res.write(JSON.stringify({
    "status": "success",
    "data": data
  }));
  res.end();
};

const errorHandle = (res, err) => {
  res.writeHead(400, headers);
  let message = '';
  if(err) {
    message = err.message;
  } else {
    message = "欄位不正確，或沒有此 ID";
  }
  res.write(JSON.stringify({
    "status": "false",
    message
  }));
  res.end();
};

module.exports = { successHandle, errorHandle }

