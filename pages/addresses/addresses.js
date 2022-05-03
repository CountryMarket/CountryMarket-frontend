// pages/addresses/addresses.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"


Page({

  /**
   * 页面的初始数据
   */
  data: {
      address_message: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      wx.setNavigationBarTitle({
        title: '收货地址信息',
      })
      console.log(options)
      this.getAddressList()
  },

  
    //获取收货信息列表
    getAddressList() {
      if (isTokenEmpty(getApp().globalData.token)) {
                showTokenInvalidModal();
                return ;
       }
      wxRequest("GET","address/address").then(res => {
        console.log(res)
                    if (isResTokenInvalid(res)) {
                      showTokenInvalidModal();
                      getAddressList();
                      return ;
                    }
                    this.setData({
                      address_message: res.data.data.Address
                    })
                    console.log(this.data.address_message)
              })
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  goto_address_edit() {
    wx.navigateTo({
      url: "/pages/address_edit/address_edit"
    })
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