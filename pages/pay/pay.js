// pages/pay/pay.js

import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    product_id: 0,
    money: 0,
    order_id: 0
  },

  goto_home() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  async finish_pay() {
    console.log({order_id: this.data.order_id, status: 2})
    let res = await wxRequest("POST", "order/changeStatus", {order_id: Number(this.data.order_id), status: 2})
    console.log(res)  
    if (!res.data.success) {
      console.log('失败')
      wx.showToast({
        title: '支付失败',
        icon: 'error'
      })
    } else {
      wx.showToast({
        title: '支付成功',
        duration: 750
      })
      setTimeout(()=> {
        wx.switchTab({
          url: '/pages/home/home',
        })
      }, 750)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '支付页面'
    })
    console.log(options)
    this.setData({
      money: options.money,
      order_id: options.order_id
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
    wx.navigateBack({
      delta: 1,
    })
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