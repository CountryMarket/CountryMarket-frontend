// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    winWidth: 0,  
    winHeight: 0,
    currentTab: 0,
  },
  
  onLoad() {
    // swich tab
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

  // swich tab
  bindChange(e) {  
    let that = this;  
    that.setData({ currentTab: e.detail.current });  
  },  
  swichNav(e) {  
    let that = this;  
    if(this.data.currentTab === e.target.dataset.current) {  
      return false;  
    } else {  
      that.setData({ currentTab: e.target.dataset.current });
    }  
  }  
})
