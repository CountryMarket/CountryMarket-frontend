// pages/good_comments/good_comments.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments: [],
    product_id: 0,
    good_info: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      product_id: options.product_id
    })
    wxRequest("GET","comment/product",{product_id: options.product_id}).then(res => {
      console.log(res)
      this.setData({
        comments: res.data.data.comments
      })
      console.log(this.data.comments)
    })
    this.getGoodList()
  },

  async getGoodList() {
  await wxRequest("GET","shop/product",{id: this.data.product_id}).then(res => {
        this.setData({
          good_info: res.data.data
        })
    console.log(this.data.good_info)
  })
},

  go_back() {
    wx.navigateBack({
      delta: -1,
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