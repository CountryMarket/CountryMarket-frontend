// pages/products/products.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"


Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabList: [],
        currentTab: 0,
        currentId: 0,
        products: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
          title: '商品分类'
        })
        this.getTabList()
    },

    change_currentTab(e) {
      console.log(e)
      this.setData({
        currentTab: e.currentTarget.dataset.value,
        currentId: this.data.tabList[ e.currentTarget.dataset.value ].Id
      })
      this.gettabProducts()
    },

    //获取Tab List
    getTabList() {
            wx.showLoading({
                title: '数据加载中'
            })
            if (isTokenEmpty(getApp().globalData.token)) {
              showTokenInvalidModal();
              wx.hideLoading();
              return ;
            }
            wxRequest("GET","product/tabList").then(res => {
                  console.log(res)
                  if (isResTokenInvalid(res)) {
                    showTokenInvalidModal();
                    getTabList();
                    return ;
                  }
                  this.setData({
                      tabList: res.data.data.Tabs,
                  })
                  this.setData({
                    currentId: this.data.tabList[0].Id
                  })
            })
            this.gettabProducts()
            wx.hideLoading()
      },

      gettabProducts() {
        if (isTokenEmpty(getApp().globalData.token)) {
                  showTokenInvalidModal();
                  wx.hideLoading();
                  return;
        }
                wxRequest("GET","product/tabProducts",{tabId: this.data.currentId}).then(res => {
                      console.log(this.data.currentId)
                      console.log(res)
                      if (isResTokenInvalid(res)) {
                        showTokenInvalidModal();
                        this.gettabProducts();
                        return ;
                      }
                      this.setData({
                          products: res.data.data.Products
                      })
                })
                console.log(this.data.products)
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