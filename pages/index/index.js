// index.js
const app = getApp();

Page({
  data: {
    winWidth: 0,  
    winHeight: 0,
    currentTab: 0,
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  
  onLoad() {
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
  },  
  switchNav(e) {  
    let that = this;  
    if(this.data.currentTab === e.currentTarget.dataset.current) {  
      return false;  
    } else {  
      that.setData({ currentTab: e.currentTarget.dataset.current });
    }  
  }  
})
