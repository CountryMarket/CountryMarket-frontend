// pages/guanli/guanli.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    from: 0,
    page_size: 10,
    status: 0,
    orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      wx.setNavigationBarTitle({
        title: '管理端'
      })
  },

  get_orders() {
    wx.showLoading({
                title: '数据加载中'
            })
            if (isTokenEmpty(getApp().globalData.token)) {
              showTokenInvalidModal();
              wx.hideLoading();
              return ;
            }
            wxRequest("GET","order/shopOrder",{from: this.data.from, length: this.data.page_size}).then(res => {
                  console.log(res)
                  if (isResTokenInvalid(res)) {
                    showTokenInvalidModal();
                    get_orders();
                    return ;
                  }
                  if(res.data.data.orders == null) {
                    wx.showToast({
                      title: '订单已经到底了喔~',
                      icon: 'none'
                    })
                  } else {
                    this.setData({
      //                 shopList: [...this.data.shopList,...res.data.data.Products],
                      orders: res.data.data.orders,
                      from: this.data.from + this.data.page_size
                    })
                  }
            }).then(()=> {
            console.log(this.data.orders)
            wx.hideLoading()
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