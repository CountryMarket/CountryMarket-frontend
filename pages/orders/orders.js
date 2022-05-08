// pages/orders/orders.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    from: 0,
    page_size: 10,
    orders: [],
    products: [],
    now_page: 0
  },

  change_page(e) {
      console.log(e)
      this.setData({
        now_page: e.currentTarget.dataset.value,
        orders: [],
        products: [],
        from: 0
      })
      this.get_orders()
      console.log(this.data.now_page)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
      wx.setNavigationBarTitle({
        title: '全部订单'
      })
      this.setData({
        now_page: options.id,
        from: 0
      })
      this.get_orders()
      console.log(this.data.now_page)
  },

    async get_orders() {
        console.log(this.data.from)
          wx.showLoading({
              title: '数据加载中'
          })
          if (isTokenEmpty(getApp().globalData.token)) {
            showTokenInvalidModal();
            wx.hideLoading();
            return ;
          }
          await wxRequest("GET","order/userOrder",{from: this.data.from, length: this.data.page_size, status: this.data.now_page}).then(res => {
                console.log(res)
                if (isResTokenInvalid(res)) {
                  showTokenInvalidModal();
                  get_orders();
                  return ;
                }
                if(res.data.data.orders==null) {
                  wx.showToast({
                    title: '订单已经看完了喔~',
                    icon: 'none'
                  })
                } else {
                  this.setData({
                    orders: [...this.data.orders,...res.data.data.orders],
                    from: this.data.from + this.data.page_size
                  })
            console.log(this.data.orders)
            console.log(res.data.data.orders)
                }
          }).then(()=> {
            wx.hideLoading()
            this.get_products()
          })
    },

    get_products() {
        for(let i=0;i<this.data.orders.length;i++) {
          this.setData({
            [`products[${i}]`]: []
          })
          console.log(this.data.products[i])
          for(let j=0;j<this.data.orders[i].product_and_count.length;j++) {
            wx.showLoading({
                        title: '数据加载中'
                    })
                    if (isTokenEmpty(getApp().globalData.token)) {
                      showTokenInvalidModal();
                      wx.hideLoading();
                      return ;
                    }
                    wxRequest("GET","shop/product",{
                id: this.data.orders[i].product_and_count[j].product_id
              }).then(res => {
                          console.log(res)
                          if (isResTokenInvalid(res)) {
                            showTokenInvalidModal();
                            get_products();
                            return ;
                          }
                          console.log(this.data.products[i])
                            this.setData({
                                 [`products[${i}]`]: [...this.data.products[i],res.data.data]
                            })
                          console.log(this.data.products)
                          
                    }).then(()=> {
                      wx.hideLoading()
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