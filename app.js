// app.js
App({
  onLaunch() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
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
    Custom: 0,
    CustomBar: 0,
    userInfo: null,
    code: "",
    token: undefined // 全局 token, 用于登录凭证, 请求时要在头部携带
  }
})
