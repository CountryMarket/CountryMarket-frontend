import { wxLogin } from "./wxLogin"

const wxRequest = async function(method, path, data) {
  const { globalData } = getApp();
  const res = await wx.cloud.callContainer({
    "config": {
      "env": "yangqu-2gonq20w81d87cfb"
    },
    "path": "/api/v1/" + path,
    "header": {
      "X-WX-SERVICE": "yangqu",
      "content-type": "application/json",
      "Authorization": "Bearer " + globalData.token,
    },
    "method": method,
    "data": data
  });
  /*const res = await new Promise((resolve, reject) => {
    wx.request({
      "url": "https://golang-487g-1856129-1311448235.ap-shanghai.run.tcloudbase.com/api/v1/" + path,
      "method": method,
      "data": data,
      "header": {
        "X-WX-SERVICE": "golang-487g",
        "content-type": "application/json",
        "Authorization": "Bearer " + globalData.token,
      },
      success(res) {
        resolve(res)
      },
    })
  })*/
  // 如果 token 失效，清理当前的 token (此处 global token 会改变)
  if (isResTokenInvalid(res)) {
    globalData.token = undefined;
    wx.setStorageSync("token", undefined); // 两处 token 一起修改
  }
  return res;
}
const validateToken = async function() { // 检验 token 合法性，如果不合法则静默修改 global token 和 storage token
  /*const { globalData } = getApp();
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
  }*/
  wxRequest("GET", "user/validate")
}
const isTokenEmpty = function(t) { // 检验给定的 token 是否为空
  return t == "" || t == undefined || !t;
}
const isResTokenInvalid = function(res) {
  return !res.data.success && (res.data.info == "invalid token" || res.data.info == "auth error");
}
const showTokenInvalidModal = function(that) { // 弹窗显示登录态失效提醒
  wx.showModal({
    title: "提示",
    content: "登录状态失效，请重新登录",
    showCancel: false,
    confirmText: "知道了",
    success (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        login(that)
      }
    }
  });
}
const login = async function(that) {
  const { globalData } = getApp();
  let nickNameTmp, avatarUrlTmp;
        await new Promise((resolve) => {
          wx.getUserProfile({
            desc: '获取你的昵称、头像、地区及性别',
            success: res => {              
              nickNameTmp = res.userInfo.nickName;
              avatarUrlTmp = res.userInfo.avatarUrl;
              console.log(res.userInfo);
              resolve();
            },
            fail: res => {
              console.log(res)
              /*wx.showModal({
                title: "提示",
                content: "获取头像昵称失败",
                showCancel: false,
                confirmText: "知道了"
              });*/
              return ;
            }
          })
        });
        wx.showLoading({
          title: '正在登录中...',
        });
        // 获取 code
        globalData.code = await wxLogin();
        // console.log(globalData.code)
        // 将 code 发送到云服务器，获取 token
        let res = await wxRequest("GET", "user/code", {
          code: globalData.code,
          nickName: nickNameTmp,
          avatarUrl: avatarUrlTmp
        });
        console.log(res)
        // 失败
        if (!res.data.success) {
          wx.showModal({
            title: "提示",
            content: "登录失败",
            showCancel: false,
            confirmText: "知道了"
          });
          return ;
        }
        globalData.token = res.data.data.token;
        wx.setStorageSync("token", globalData.token); // 两处 token 一起修改

        that.onLoad();
        that.onShow();

        wx.hideLoading()
}
module.exports = {
  wxRequest,
  validateToken,
  isTokenEmpty,
  isResTokenInvalid,
  showTokenInvalidModal
}