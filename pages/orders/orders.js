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
        title: '订单'
      })
      this.setData({
        now_page: options.id,
        from: 0
      })
      this.get_orders()
      console.log(this.data.now_page)
  },

  goto_order_info(e) {
      console.log(e)
      wx.navigateTo({
        url: `/pages/order_info/order_info?id=${this.data.orders[e.currentTarget.dataset.value].order_id}`
      })
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
                  console.log(this.data.orders.length)
                  for(let i=0;i<this.data.orders.length;i++) {
                    this.setData({
                      [`orders[${i}].total_price`]: (Number)(this.data.orders[i].total_price)
                    })
                    this.setData({
                      [`orders[${i}].total_price`]: this.data.orders[i].total_price.toFixed(2)
                    })
                  }
            console.log(this.data.orders)
            console.log(res.data.data.orders)
                }
          }).then(()=> {
            wx.hideLoading()
            this.get_products()
          })
          console.log(this.data.orders)
    },

    goto_comment(e) {
      console.log(e)
      wx.navigateTo({
        url: `/pages/comment/comment?id=${e.currentTarget.dataset.value.order_id}`
      })
    },

    goto_pay() {
      wx.navigateTo({
        url: '/pages/pay/pay',
      })
    },

    goto_wuliu(e) {
      wx.navigateTo({
        url: `/pages/wuliu/wuliu?id=${e.currentTarget.dataset.value.order_id}`
      })
    },
    get_products() {
        for(let i=0;i<this.data.orders.length;i++) {
          this.setData({
            [`products[${i}]`]: []
          })
          for(let j=0;j<this.data.orders[i].product_and_count.length;j++) {
                     this.setData({
                         [`products[${i}]`]: [...this.data.products[i],this.data.orders[i].product_and_count[j].products]
                      })
          }
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
      this.get_orders()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})