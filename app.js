// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // 云请求初始化
    wx.cloud.init({
      traceUser: true
    })
  },
  globalData: {
    userInfo: null,
    code: "",
    openId: undefined
  }
})
