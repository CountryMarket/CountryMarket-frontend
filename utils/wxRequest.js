const wxRequest = async function(method, path, data) {
  const { globalData } = getApp();
  const res = await wx.cloud.callContainer({
    "config": {
      "env": "prod-0guks42iab6ab66f"
    },
    "path": "/api/v1/" + path,
    "header": {
      "X-WX-SERVICE": "golang-487g",
      "content-type": "application/json",
      "Authorization": "Bearer " + globalData.token,
    },
    "method": method,
    "data": data
  });
  // 如果 token 出错或失效，清理当前的 token (此处 global token 会改变)
  if (isResTokenInvalid(res)) {
    globalData.token = undefined;
    wx.setStorageSync("token", undefined); // 两处 token 一起修改
  }
  return res;
}
const validateToken = async function() { // 检验 token 合法性，如果不合法则静默修改 global token 和 storage token
  const { globalData } = getApp();
  const res = await wx.cloud.callContainer({
    "config": {
      "env": "prod-0guks42iab6ab66f"
    },
    "path": "/api/v1/user/validate",
    "header": {
      "X-WX-SERVICE": "golang-487g",
      "content-type": "application/json",
      "Authorization": "Bearer " + globalData.token,
    },
    "method": "GET",
  });
  // 如果 token 出错或失效，清理当前的 token (此处 global token 会改变)
  if (isResTokenInvalid(res)) {
    globalData.token = undefined;
    wx.setStorageSync("token", undefined); // 两处 token 一起修改
  }
}
const isTokenEmpty = function(t) { // 检验给定的 token 是否为空
  return t == "" || t == undefined || !t;
}
const isResTokenInvalid = function(res) {
  return !res.data.success && (res.data.info == "invalid token" || res.data.info == "auth error");
}
const showTokenInvalidModal = function() { // 弹窗显示登录态失效提醒
  wx.showModal({
    title: "提示",
    content: "登录状态失效，请重新登录",
    showCancel: false,
    confirmText: "知道了"
  });
}
module.exports = {
  wxRequest,
  validateToken,
  isTokenEmpty,
  isResTokenInvalid,
  showTokenInvalidModal
}