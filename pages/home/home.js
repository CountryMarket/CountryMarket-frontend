// pages/home/home.js
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

    /**
     * 页面的初始数据
     */
    data: {
      productsLeft: [],
      productsRight: [],
      keyvalue: "",
      from: 0,
      length: 10
    },

    // 跳转到商品页
    goto_goods(e) {
      console.log(e)
        wx.navigateTo({
          url: `/pages/goods/goods?id=${e.currentTarget.dataset.value}`
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    load() {
      wxRequest("GET", "product/homeTab", {
        from: this.data.from,
        length: this.data.length,
      }).then(async res => {
        console.log(res)
        if (res.statusCode != 200) {
          this.load();
          return ;
        }
        let products = res.data.data.products;
        let tmpLeft = [], tmpRight = [];
        for (let i = 0; i < products.length; ++i) {
          if (i % 2 == 0) {
            tmpLeft = [...tmpLeft, products[i]]
          } else {
            tmpRight = [...tmpRight, products[i]]
          }
        }
        this.setData({
          productsLeft: tmpLeft,
          productsRight: tmpRight, 
        })
        wx.hideLoading();
      })
    },
    onLoad: function (options) {
      wx.showLoading({
          title: '数据加载中'
      })
      this.load();
    },

    goto_tab(e) {
        console.log(e)
        getApp().globalData.goto_tab=e.currentTarget.dataset.value
        wx.switchTab({
          url: `/pages/products/products`
        })
    },

    goto_ljyx() {
      wx.navigateTo({
        url: '/pages/ljyx/ljyx',
      })
    },

    goto_sousuo() {
      wx.navigateTo({
        url: '/pages/ss/ss',
      })
    },

    goto_hnzcpj() {
      wx.navigateTo({
        url: '/pages/hnzcpj/hnzcpj',
      })
    },

    goto_kxzh() {
      wx.navigateTo({
        url: '/pages/kxzh/kxzh',
      })
    },

    handleSearch(e) {
      console.log(e)
      if (e.detail == '') {
        wx.showToast({
          title: '不能没有输入哦~',
          icon: 'none'
        })
        return 
      }
      wx.navigateTo({
        url: `/pages/search_result/search_result?key=${e.detail}`,
      })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      this.setData({
        from: this.data.from + this.data.length
      })
      wxRequest("GET", "product/homeTab", {
        from: this.data.from,
        length: this.data.length,
      }).then(async res => {
        if(res.data.data.products==null) {
          wx.showToast({
            title: '商品已经浏览完了哦~',
            duration: 750,
            icon: 'none'
          })
          return;
        }
        let products = res.data.data.products;
        let tmpLeft = [], tmpRight = [];
        for (let i = 0; i < products.length; ++i) {
          if (i % 2 == 0) {
            tmpLeft = [...tmpLeft, products[i]]
          } else {
            tmpRight = [...tmpRight, products[i]]
          }
        }
        this.setData({
          productsLeft: [...this.data.productsLeft, ...tmpLeft],
          productsRight:  [...this.data.productsRight, ...tmpRight], 
        })
        wx.hideLoading();
      })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})