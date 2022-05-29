// pages/xiadan/xiadan.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
    products: [],
    address_message: [],
    message: [],
    message_temp: '',
    input_Hidden: true,
    now_index: 0,
    total_money: 0,
    transportation_price: 0,
    final_price: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: '下单页面'
    })
    this.getAddressList() //获取地址信息列表
    this.setData({
      order: options.id.split(',')
    })
    for(let i=0;i<this.data.order.length;i++) {
      this.setData({
        [`order[${i}]`]: Number(this.data.order[i])
      })
    }
    console.log(this.data.order)
    this.get_products()
  },
  get_products() { 
    if (isTokenEmpty(getApp().globalData.token)) {
              showTokenInvalidModal();
              return ;
     }
    wxRequest("POST","cart/getCart",{product_ids: this.data.order}).then(res => {
      console.log(res)
                  if (isResTokenInvalid(res)) {
                    showTokenInvalidModal();
                    get_products()
                    return ;
                  }
                  this.setData({
                    products: res.data.data.Products
                  })
                  console.log(this.data.products)
                  this.countAll()
                  for(let i=0;i<this.data.products.length;i++) {
                    this.setData({
                      [`message[${i}]`]: ''
                    })
                  }
                  console.log(this.data.message)
            })
    
  },
  change_hidden(e) {
      this.setData({
        now_index: e.currentTarget.dataset.value,
        input_Hidden: false,
        message_temp: this.data.message[e.currentTarget.dataset.value]
      })
      console.log(this.data.now_index)
  },
  changeModel() {
    this.setData({
      input_Hidden: true,
    })
  },
  modelCancel() {
    console.log(this.data.message_temp)
    console.log(this.data.now_index)
    console.log(this.data.message)
    this.setData({
      input_Hidden: true,
      [`message[${this.data.now_index}]`]: this.data.message_temp
    })
},

input_Handler(e) {
  this.setData({
      [`message[${this.data.now_index}]`]: e.detail.value
  })
  console.log(this.data.message[this.data.now_index])
},
  goto_goods(e) {
    console.log(e)
      wx.navigateTo({
        url: `/pages/goods/goods?id=${this.data.products[e.currentTarget.dataset.value].Id}`
      })
  },

  goto_pay() {
    this.countAll()
    console.log(this.data.address_message)
    if(this.data.address_message==null) {
      wx.showToast({
        title: '请完善收货地址~',
        icon: 'none'
      })
      return;
    }
    if (isTokenEmpty(getApp().globalData.token)) {
              showTokenInvalidModal();
              return ;
     }
    wxRequest("POST","order/generateOrder",{product_ids: this.data.order, transportation_price: 5, name: this.data.address_message[0].Name, phone_number: this.data.address_message[0].PhoneNumber, address: this.data.address_message[0].Address, message: this.data.message[0]}).then(res => {
      console.log(res)
      console.log({product_ids: this.data.order, transportation_price: 5, name: this.data.address_message[0].Name, phone_number: this.data.address_message[0].PhoneNumber, address: this.data.address_message[0].Address, message: this.data.message[0]})
                  if (isResTokenInvalid(res)) {
                    showTokenInvalidModal();
                    goto_pay()
                    return ;
                  }
                  wx.navigateTo({
                    url: `/pages/pay/pay?money=${this.data.total_money}`
                  })
            })
  },

  countAll() {
    console.log('haha')
      this.setData({
        total_money: 0
      })
      for(let i=0;i<this.data.products.length;i++) {
          this.setData({
            total_money: this.data.total_money+this.data.products[i].Count*this.data.products[i].Price
          })
      }
      this.setData({
        total_money: this.data.total_money.toFixed(2),
        final_price: (this.data.total_money+this.data.transportation_price).toFixed(2)
      })
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getAddressList()
    this.countAll()
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