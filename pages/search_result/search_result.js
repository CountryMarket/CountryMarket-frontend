// pages/search_result/search_result.js
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: "",
    products: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      key: options.key
    })
    wxRequest("POST", "search", {
      key: this.data.key
    }).then(res => {
      console.log(res)
      this.setData({
        products: res.data.data.Products
      })
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
    this.onLoad({key: e.detail});
  },

  goto_goods(e) {
    console.log(e.currentTarget.dataset.value)
    wx.navigateTo({
      url: `/pages/goods/goods?id=${this.data.products[e.currentTarget.dataset.value].Id}`,
    })
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