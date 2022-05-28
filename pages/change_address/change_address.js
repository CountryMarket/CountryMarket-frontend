

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"


// pages/address_edit/address_edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      info: {},
      id: 0,
      region:[],
      address_message: []
  },

  getitem(e) {
    console.log(e)
  },

  inputHandler_name(e) {
    this.setData({
      [`info.Name`]: e.detail.value
    })
    console.log(this.data.info.Name)
  },

  getUserProvince:function(e)
  {
     this.setData({
         region:e.detail.value     //将用户选择的省市区赋值给region
     })
  },

  inputHandler_phone(e) {
    this.setData({
      [`info.PhoneNumber`]: e.detail.value
    })
    console.log(this.data.info.PhoneNumber)
  },
  inputHandler_address(e) {
    this.setData({
      [`info.Address`]: e.detail.value
    })
    console.log(this.data.info.Address)
  },

  // 保存信息
  async keep_address() {
    
    if(this.data.info.Name=='') {
      wx.showToast({
        title: '请输入称谓',
        duration: 1000,
        icon: 'none'
      })
      return;
    }
    if(this.data.info.PhoneNumber=='') {
      wx.showToast({
        title: '请输入联系方式',
        duration: 1000,
        icon: 'none'
      })
      return;
    }
    if(this.data.region[0]==undefined||this.data.region[1]==undefined||this.data.region[2]==undefined) {
      wx.showToast({
        title: '请选择地区',
        duration: 1000,
        icon: 'none'
      })
      return;
    }
    if(this.data.info.Address=='') {
      wx.showToast({
        title: '请输入地址',
        duration: 1000,
        icon: 'none'
      })
      return;
    }
    if(this.data.info.PhoneNumber.length!=11) {
      wx.showToast({
        title: '请输入11位电话号码',
        duration: 1000,
        icon: 'none'
      })
      return;
    }

      let address_string = this.data.region[0] + ' ' + this.data.region[1] + ' ' + this.data.region[2] + ' '
      this.setData({
        [`info.Address`]: address_string + this.data.info.Address
      })
      console.log({addressId: this.data.info.AddressId,name: this.data.info.Name, address: this.data.info.Address, phoneNumber: this.data.info.PhoneNumber})
      let res=await wxRequest("POST","address/modifyAddress",{addressId: this.data.info.AddressId,name: this.data.info.Name, address: this.data.info.Address, phoneNumber: this.data.info.PhoneNumber});
      console.log(this.data.info)
      console.log(res)
      if(res.data.success) {
         wx.navigateBack({
           delta: 0
         })
      } else {
        wx.showToast({
          title: '信息修改失败',
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
      title: '修改地址信息',
    })
    this.setData({
        id: options.id
    })
    this.getInfo()
  },

  getInfo() {
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
                  this.setData({
                    info: this.data.address_message[this.data.id]
                  })
                  console.log(this.data.info)
                  let arr = this.data.info.Address.split(" ")
                  console.log(arr)
                  this.setData({
                    [`info.Address`]: arr[3],
                    region: [arr[0],arr[1],arr[2]]
                  })
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