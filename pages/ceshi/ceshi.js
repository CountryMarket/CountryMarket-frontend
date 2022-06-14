// pages/ceshi/ceshi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      answer: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcGVuaWQiOiJ0ZXN0Iiwic2Vzc2lvbl9rZXkiOiJoaCIsImV4cCI6MTY2MDIyNDUxN30.K8dM-1bYA5FkH8m0qW5xdJ4gfE0HGUEZHN0jqHJZoqM',
      val: '%#ctx@!+zzz*7-d%lyf}',
      value: ''
  },

  inputHandler(e) {
    this.setData({
      value: e.detail.value
    })
  },
  confirm() {
    if(this.data.val==this.data.value) {
      const { globalData } = getApp();
      globalData.token = this.data.answer;
      wx.setStorageSync("token", this.data.answer);
      wx.navigateBack()
    } else {
      wx.showToast({
        title: '密钥错误，请重试',
        duration: 750,
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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