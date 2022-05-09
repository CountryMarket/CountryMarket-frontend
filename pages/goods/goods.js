

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal } from "../../utils/wxRequest"


// pages/goods/goods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      is_kept_path: '/image/keep.png',
      if_in_cart: '加入购物车',
      id: 0,
      good_info: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '商品详情'
    })
    console.log(options)
    this.setData({
      id: Number(options.id)
    })
    this.getGoodList().then( () => {
        this.check_cart()
    })
  },

  check_cart() {
      wxRequest("GET","cart/inCart",{productId: this.data.id}).then(res => {
        console.log(res)
        if(res.data.data.Count != 0) {
          this.setData({
              if_in_cart: '已加入购物车'
          })
        } else {
          this.setData({
            if_in_cart: '加入购物车'
          })
        }
      })
  },

  async getGoodList() {
          wx.showLoading({
            title: '数据加载中'
        })
        await wxRequest("GET","shop/product",{id: this.data.id}).then(res => {
              this.setData({
                good_info: res.data.data
              })
          console.log(this.data.good_info)
        })
        wx.hideLoading()
  },

  // 改变是否收藏
  change_keep() {
    if(this.data.is_kept_path == '/image/keep.png') {
      this.setData({
        is_kept_path : '/image/keep_active.png'
      })
      wx.showToast({
        title: '宝贝收藏成功~',
        duration: 1000,
        icon: 'none'
      })
    } else {
      this.setData({
        is_kept_path : '/image/keep.png'
      })
      wx.showToast({
        title: '取消收藏咯~',
        duration: 1000,
        icon: 'none'
      })
    }
  },

  // 加入购物车
  async add_into_cart() {
    if(this.data.if_in_cart == '加入购物车') {
          let res=await wxRequest("POST","cart/addProduct",{productId: this.data.id});
          console.log(res)
          if(res.data.success) {
            wx.showToast({
              title: '商品添加成功！',
              duration: 500,
              icon: 'none'
            })
            this.setData({
              if_in_cart: '已加入购物车'
            })
          } else {
            wx.showToast({
              title: '商品添加失败，请重试~',
              duration: 1000,
              icon: 'none'
            })
          }
    } else {  
            let res=await wxRequest("POST","cart/modifyProduct",{productId: this.data.id, modifyCount: 0});
            if(res.data.success) {
              wx.showToast({
                title: '商品移除成功！',
                duration: 500,
                icon: 'none'
              })
              this.setData({
                if_in_cart: '加入购物车'
              })
            } else {
              wx.showToast({
                title: '商品移除失败，请重试~',
                duration: 1000,
                icon: 'none'
              })
            }
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