const { validateToken } = require("../../utils/wxRequest")

// index.js
const app = getApp();

Page({
  data: {
    winWidth: 0,  
    winHeight: 0,
    currentTab: 0,
    callbacks: []
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  onReady() {
    this.home = this.selectComponent("#home");
    this.my = this.selectComponent("#my");
  },
  
  onLoad() {
    // 检验 Token 合法性
    validateToken();
    // Tab 初始化
    let that = this;  
    wx.getSystemInfo( {  
      success: res => {  
        that.setData({
          winWidth: res.windowWidth,  
          winHeight: res.windowHeight  
        });
      }  
    });  
  },

  // Tab 事件
  bindChange(e) {  
    let that = this;  
    that.setData({ currentTab: e.detail.current });  
    this.triggerOnEnter(e.detail.current);
  },
  switchNav(e) {  
    let that = this;  
    if(this.data.currentTab === e.currentTarget.dataset.current) {  
      return false;  
    } else {  
      that.setData({ currentTab: e.currentTarget.dataset.current });
    }  
  },
  // switch 到某个页面触发
  triggerOnEnter(id) {
    if (id == 0) {
      this.home.onEnter();
    } else if (id == 3) {
      this.my.onEnter();
    }
  }
})
