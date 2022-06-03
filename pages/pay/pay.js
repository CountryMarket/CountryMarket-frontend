// pages/pay/pay.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    product_id: 0,
    money: 0,
    order_id: 0,
    info: [],
    products: []
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
    this.get_info(options.order_id)
  },


  async get_info(id) {
          wx.showLoading({
              title: '数据加载中'
          })
          if (isTokenEmpty(getApp().globalData.token)) {
            showTokenInvalidModal();
            wx.hideLoading();
            return ;
          }
          await wxRequest("GET","order/orderInfo",{order_id: id}).then(res => {
                console.log(res)
                if (isResTokenInvalid(res)) {
                  showTokenInvalidModal();
                  get_info();
                  return ;
                }
                 this.setData({
                   info: res.data.data
                 })
          }).then(()=> {
            wx.hideLoading()
            this.get_products()
          })
          console.log(this.data.info)
    },

    get_products() {
      for(let i=0;i<this.data.info.product_and_count.length;i++) {
          this.setData({
            products: [...this.data.products,this.data.info.product_and_count[i].products]
          })
      }
      console.log(this.data.products)
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