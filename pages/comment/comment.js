// pages/comment/comment.js


import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: {
      order: [],
      products: [],
      comments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      console.log(options)
      wx.setNavigationBarTitle({
        title: '发表评论'
      })
      if (isTokenEmpty(getApp().globalData.token)) {
                showTokenInvalidModal();
                return ;
      }
     wxRequest("GET","order/orderInfo",{order_id: options.id}).then(res => {
           console.log(res)
        this.setData({
          order: res.data.data
        })
        console.log(this.data.order)
        this.setData({
          products: this.data.order.product_and_count,
        })
        console.log(this.data.products)
        for(let i=0;i<this.data.order.product_and_count.length;i++) {
          this.setData({
            comments: [...this.data.comments, {product_id: this.data.products[i].products.Id, comment: ''}]
          })
        }
    })
  },

  inputHandler(e) {
    console.log(e)
    this.setData({
      [`comments[${e.currentTarget.dataset.value}].comment`]: e.detail.value
    })
    console.log(e.detail.value)
    console.log(this.data.comments[e.currentTarget.dataset.value].comment)
  },

  async submit_comment() {
    console.log(this.data.comments)
    let check=false;
    for(let i=0;i<this.data.comments.length;i++) {
      if(this.data.comments[i].comment=='') continue; 
      check=true
      continue
    }
    if(check==false) {
        wx.showToast({
          title: '评论不能全为空',
          icon: 'none'
        })
    } else {
        let res = await wxRequest("POST", "comment/add", {comments: this.data.comments});
        console.log(res)
        if (!res.data.success) {
          wx.showToast({
            title: '提交评论失败',
            icon: 'error'
          })
        } else {
          wx.showToast({
            title: '提交评论成功',
            duration: 750
          })
          console.log(this.data.order.now_status)
          if(this.data.order.now_status==3) {
            console.log(this.data.orders)
            let temp= await wxRequest("POST", "order/changeStatus", {order_id: this.data.order.order_id, status: 4})
            console.log(temp)
          }
          setTimeout(()=> {
            wx.navigateBack({
              delta: -1,
            })
          }, 750)
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