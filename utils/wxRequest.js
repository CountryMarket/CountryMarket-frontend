const wxRequest = function(method, path, data) {
  return wx.cloud.callContainer({
    "config": {
      "env": "prod-0guks42iab6ab66f"
    },
    "path": "/api/v1/" + path,
    "header": {
      "X-WX-SERVICE": "golang-487g",
      "content-type": "application/json"
    },
    "method": method,
    "data": data
  });
}

module.exports = {
  wxRequest
}