// pages/wuliu/wuliu.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据 latitude: 112.896609,
    longitude: 38.248908,
   */
  data: {
    order_id: 0,
    info: [],
    products: [],
    latitude: 30.390827,
    longitude: 113.416625,
    scale: 4,
    subkey: "P5TBZ-LUJLW-XSJRQ-R2KBP-PXAKK-7WB5Q",
    height: 100,
    markers: [{
      id: 1,
      latitude: 38.248908,
      longitude: 112.896609,
      name: '杨兴乡',
      iconPath: '../../image/fahuo.png',
      height: 30,
      width: 30
    },
    {
      id: 2,
      latitude: 22.532746,
      longitude: 113.936641,
      name: '深圳大学',
      iconPath: '../../image/sh.png',
      height: 30,
      width: 30
    }],
    polyline: [
      {
        points: [{latitude: 38.248908, longitude: 112.896609}, {latitude: 22.532746, longitude: 113.936641}],
        color: "#33cc99",
        width: 3,
      }
    ]
  },

  go_back() {
    wx.navigateBack({
      delta: 0,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      height: wx.getSystemInfoSync().windowHeight
    })
    this.setData({
      order_id: options.id
    })
    this.get_info()
  },
  
  async get_info() {
          wx.showLoading({
              title: '数据加载中'
          })
          if (isTokenEmpty(getApp().globalData.token)) {
            showTokenInvalidModal();
            wx.hideLoading();
            return ;
          }
          await wxRequest("GET","order/orderInfo",{order_id: this.data.order_id}).then(res => {
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