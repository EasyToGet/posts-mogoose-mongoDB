const headers = require('./headers');

const successHandle = (res, message, data) => {
  res.writeHead(200, headers);
  res.write(JSON.stringify({
    "status": "success",
    "message": message,
    "data": data
  }));
  res.end();
};

const errorHandle = (res, message) => {
  res.writeHead(400, headers);
  res.write(JSON.stringify({
    "status": "false",
    "message": message
  }));
  res.end();
};

module.exports = { successHandle, errorHandle }

