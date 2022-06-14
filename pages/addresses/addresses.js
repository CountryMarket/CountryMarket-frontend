// pages/addresses/addresses.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"


Page({

  /**
   * 页面的初始数据
   */
  data: {
      address_message: [],
      statue: '管理'
  },

  change_statue() {
      if(this.data.statue == '管理') {
        this.setData({
          statue: '完成'
        })
      } else {
        this.setData({
          statue: '管理'
        })
      }
  },

  async delete_address(e) {
      console.log(e)
      console.log(this.data.address_message[e.currentTarget.dataset.value].AddressId)
      let res=await wxRequest("POST","address/deleteAddress",{addressId: this.data.address_message[e.currentTarget.dataset.value].AddressId});
      console.log(res)
      if(!res.data.success) {
          wx.showToast({
            title: '删除地址失败~',    
            duration: 1000,
            icon: 'none'
          })
      } else {
        wx.showToast({
          title: '删除地址成功~',    
          duration: 500,
          icon: 'none'
        })
        this.getAddressList()
      }
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

  goto_change_address(e) {
      wx.navigateTo({
        url: `/pages/change_address/change_address?id=${e.currentTarget.dataset.value}`
      })
  },

  change_first_address(e) {
      console.log(e)
      this.change_address_info(e.currentTarget.dataset.value)
  },

  async change_address_info(now_id) {
    let first = this.data.address_message[0]
    let second = this.data.address_message[now_id]
    let temp = second.AddressId
    second.AddressId = first.AddressId
    first.AddressId = temp
    console.log(first)
    console.log(second)
    let res=await wxRequest("POST","address/modifyAddress",second);
    console.log(res)
    if(!res.data.success) {
      wx.showToast({
        title: '信息修改失败',
        duration: 1000,
        icon: 'none'
      })
      return
    }
    res=await wxRequest("POST","address/modifyAddress",first);
    console.log(res)
    if(!res.data.success) {
      wx.showToast({
        title: '信息修改失败',
        duration: 1000,
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '当前地址已成为默认地址~',
        duration: 1000,
        icon: 'none'
      })
    }
      console.log(this.data.address_message)
    
      this.getAddressList()
},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      statue: '管理'
    })
    this.getAddressList()
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
    this.setData({
      address_message: []
    })
    this.getAddressList()
    wx.stopPullDownRefresh()
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