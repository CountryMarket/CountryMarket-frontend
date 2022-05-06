// pages/orders/orders.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    from: 0,
    page_size: 10,
    orders: [],

    now_page: 1
  },

  change_page(e) {
      console.log(e)
      this.setData({
        now_page: e.currentTarget.dataset.value
      })
      console.log(this.data.now_page)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
      wx.setNavigationBarTitle({
        title: '全部订单'
      })
      this.get_orders()
      this.setData({
        now_page: Number(options.id)
      })
      console.log(this.data.now_page)
  },

    get_orders() {
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
                if(res.data.data.Orders==null) {
                  wx.showToast({
                    title: '订单已经看完了喔~',
                    icon: 'none'
                  })
                } else {
                  this.setData({
                    orders: [...this.data.orders,...res.data.data.Orders],
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