// pages/orders/orders.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    from: 0,
    page_size: 50,
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

  goto_shouhou() {
      wx.navigateTo({
        url: '/pages/shouhou/shouhou',
      })
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

  async shouhuo(e) {
    console.log(this.data.orders)
    console.log(this.data.orders[e.currentTarget.dataset.value])
    let res = await wxRequest("POST", "order/changeStatus", {order_id: this.data.orders[e.currentTarget.dataset. value].order_id, status: 3});
    console.log( this.data.orders[e.currentTarget.dataset. value].order_id)
    console.log(res)
    if (!res.data.success) {
      console.log('失败')
      wx.showToast({
        title: '收货失败',
        icon: 'error'
      })
    } else {
      console.log('成功')
      wx.showToast({
        title: '收货成功'
      })
      this.get_orders()
    }
  },

    async get_orders() {
        console.log(this.data.from)
          if (isTokenEmpty(getApp().globalData.token)) {
            showTokenInvalidModal();
            wx.hideLoading();
            return ;
          }
          await wxRequest("GET","order/userOrder",{from: 0, length: this.data.page_size, status: this.data.now_page}).then(res => {
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
                  this.setData({
                    orders: []
                  })
                } else {
                  console.log('请求数据')
                  this.setData({
                    orders: res.data.data.orders
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

    goto_pay(e) {
      wx.navigateTo({
        url: `/pages/pay/pay?money=${this.data.orders[e.currentTarget.dataset.value].total_price}&order_id=${this.data.orders[e.currentTarget.dataset.value].order_id}`
      })
    },

    goto_wuliu(e) {
      console.log(this.data.orders)
      console.log(this.data.orders[e.currentTarget.dataset.value].order_id)
      wx.navigateTo({
        url: `/pages/wuliu/wuliu?id=${this.data.orders[e.currentTarget.dataset.value].order_id}`
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
    this.get_orders()
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
      wx.showToast({
        title: '已经到底了哦~',
        icon: 'none'
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})