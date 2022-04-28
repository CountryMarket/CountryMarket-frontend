// app.js
App({
  onLaunch() {
    // 云请求初始化
    wx.cloud.init({
      traceUser: true
    })
    // 读取本地存储
    // wx.setStorageSync("token", undefined) // for test
    const token = wx.getStorageSync("token")
    this.globalData.token = token
  },
  globalData: {
    userInfo: null,
    code: "",
    token: undefined // 全局 token, 用于登录凭证, 请求时要在头部携带
  }
})
