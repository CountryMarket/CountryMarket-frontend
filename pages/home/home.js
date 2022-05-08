// pages/home/home.js
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

    /**
     * 页面的初始数据
     */
    data: {
      productsLeft: [],
      productsRight: []
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
    onLoad: function (options) {
      wx.showLoading({
          title: '数据加载中'
      })
      wxRequest("GET", "product/homeTab").then(async res => {
        if (isResTokenInvalid(res)) {
          showTokenInvalidModal();
          wx.hideLoading();
          return ;
        }
        let ids = res.data.data.ids;
        let idsLeft = [], idsRight = [];
        for (let i = 0; i < ids.length; ++i) {
          if (i % 2 == 0) {
            idsLeft = [...idsLeft, ids[i]]
          } else {
            idsRight = [...idsRight, ids[i]]
          }
        }
        let tmpLeft = [], tmpRight = [];
        for (let i = 0; i < idsLeft.length; ++i) {
          let res = await wxRequest("GET", "shop/product", {id: idsLeft[i]});
          if (isResTokenInvalid(res)) {
            showTokenInvalidModal();
            wx.hideLoading();
            return ;
          }
          tmpLeft =  [...tmpLeft, res.data.data]
        }
        for (let i = 0; i < idsRight.length; ++i) {
          let res = await wxRequest("GET", "shop/product", {id: idsRight[i]});
          if (isResTokenInvalid(res)) {
            showTokenInvalidModal();
            wx.hideLoading();
            return ;
          }
          tmpRight =  [...tmpRight, res.data.data]
        }
        console.log(tmpLeft)
        this.setData({
          productsLeft: tmpLeft,
          productsRight: tmpRight, 
        })
        wx.hideLoading();
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})