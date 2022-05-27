// pages/order_info/order_info.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    products: [],
    if_open: false,
    order_id: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      console.log(options)
      this.setData({
        if_open: false
      })
      this.get_info(options.id).then(()=> {
        this.setData({
          order_id: options.id
        })
        if(this.data.info.now_status==1) {
          wx.setNavigationBarTitle({
            title: '待支付'
          })
        }
        if(this.data.info.now_status==2) {
          wx.setNavigationBarTitle({
            title: '待收货'
          })
        }
        if(this.data.info.now_status==3) {
          wx.setNavigationBarTitle({
            title: '待评价'
          })
        }
        if(this.data.info.now_status==4) {
          wx.setNavigationBarTitle({
            title: '已完成'
          })
        }
      })
  },

  change_open() {
    if(this.data.if_open==true) {
      this.setData({
        if_open: false
      })
    } else {
      this.setData({
        if_open: true
      })
    }
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

  goto_goods(e) {
    console.log(e)
      wx.navigateTo({
        url: `/pages/goods/goods?id=${this.data.products[e.currentTarget.dataset.value].Id}`
      })
  },

  delete_order(e) {
      console.log(e)
      if(this.data.info.now_status>=3) {
          this.del_order()
      } else {
        wx.showToast({
          title: '当前订单尚未完成，不可以删除哦',
          icon: 'none'
        })
      }
  },

  async del_order() {
    let res=await wxRequest("POST","order/deleteOrder",{order_id: Number(this.data.order_id)});
    console.log(res)
    if(res.data.success) {
      wx.showToast({
        title: '订单删除成功',
        duration: 500,
        icon: 'none'
      })
      wx.navigateTo({
        url: '/pages/orders/orders'
      })
    } else {
      wx.showToast({
        title: '订单删除失败，请重试~',
        duration: 1000,
        icon: 'none'
      })
    }
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