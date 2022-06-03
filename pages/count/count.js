// pages/count/count.js
import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"
Page({

  /**
   * 页面的初始数据
   */
  data: {
      from: 0,
      page_size: 10,
      goods: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.get_goods()
  },

  get_goods() {
            if (isTokenEmpty(getApp().globalData.token)) {
              showTokenInvalidModal();
              wx.hideLoading();
              return ;
            }
            wxRequest("GET","shop/ownerProducts",{from: this.data.from, length: this.data.page_size}).then(res => {
                  console.log(res)
                  if (isResTokenInvalid(res)) {
                    showTokenInvalidModal();
                    get_goods();
                    return ;
                  }
                  if(res.data.data.Products == null) {
                    wx.showToast({
                      title: '您的商品已经看完了喔~',
                      icon: 'none'
                    })
                  } else {
                    this.setData({
                      goods: [...this.data.goods,...res.data.data.Products],
                      from: this.data.from + this.data.page_size
                    })
                  }
            }).then(()=> {
              console.log(this.data.goods)
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