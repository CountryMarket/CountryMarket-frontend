// pages/ss/ss.js
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    products: [],
    Ffocus: true
  },
  load() {
    wxRequest("GET", "product/homeTab", {
      from: 0,
      length: 4,
    }).then(async res => {
      console.log(res)
      if (res.statusCode != 200) {
        this.load();
        return ;
      }
      this.setData({
        products: res.data.data.products
      })
    })
  },
  goto_tab(e) {
    console.log(e)
    getApp().globalData.goto_tab=e.currentTarget.dataset.value
    wx.switchTab({
      url: `/pages/products/products`
    })
  },
  handleSearch(e) {
    console.log(e)
    if (e.detail == '') {
      wx.showToast({
        title: '不能没有输入哦~',
        icon: 'none'
      })
      return 
    }
    wx.navigateTo({
      url: `/pages/search_result/search_result?key=${e.detail}`,
    })
  },
  search_mi() {
    wx.navigateTo({
      url: `/pages/search_result/search_result?key=米`,
    })
  },
  search_mian() {
    wx.navigateTo({
      url: `/pages/search_result/search_result?key=面`,
    })
  },
  search_dou() {
    wx.navigateTo({
      url: `/pages/search_result/search_result?key=豆`,
    })
  },
  search_cai() {
    wx.navigateTo({
      url: `/pages/search_result/search_result?key=菜`,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.load()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})