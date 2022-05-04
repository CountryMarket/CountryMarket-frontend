const { wxRequest } = require("../../utils/wxRequest")

// pages/address_edit/address_edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      info: {name: '', address: '', phoneNumber: ''},
      region:[]
  },

  getitem(e) {
    console.log(e)
  },

  inputHandler_name(e) {
    this.setData({
      [`info.name`]: e.detail.value
    })
    console.log(this.data.info.name)
  },

  getUserProvince:function(e)
  {
     this.setData({
         region:e.detail.value     //将用户选择的省市区赋值给region
     })
  },

  inputHandler_phone(e) {
    this.setData({
      [`info.phoneNumber`]: e.detail.value
    })
    console.log(this.data.info.phoneNumber)
  },
  inputHandler_address(e) {
    this.setData({
      [`info.address`]: e.detail.value
    })
    console.log(this.data.info.address)
  },

  // 保存信息
  async keep_address() {
      let address_string = this.data.region[0] + this.data.region[1] + this.data.region[2] 
      address_string = address_string + this.data.info.address
      console.log(address_string)
      let res=await wxRequest("POST","address/addAddress",{name: this.data.info.name,phoneNumber: this.data.info.phoneNumber, address: address_string});
      console.log(this.data.info)
      console.log(res)
      if(res.data.success) {
        wx.navigateBack({
          delta: 0
        })
      } else {
        wx.showToast({
          title: '信息保存失败',
          duration: 1000,
          icon: 'none'
        })
      }
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '编辑新的地址信息',
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