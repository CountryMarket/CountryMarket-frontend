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
        products: [],

        navHeight: '',
        menuButtonInfo: {},
        searchMarginTop: 0, // 搜索框上边距
        searchWidth: 0, // 搜索框宽度
        searchHeight: 0 ,// 搜索框高度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options)
      let systeminfo=wx.getSystemInfoSync()
      //console.log(systeminfo.windowHeight)
      this.setData({
        movehight:systeminfo.windowHeight,
        movehight2:systeminfo.windowHeight-100,
        currentTab: getApp().globalData.goto_tab
      })
  
      this.setData({
        menuButtonInfo: wx.getMenuButtonBoundingClientRect()
      })
      console.log(this.data.menuButtonInfo)
      const { top, width, height, right } = this.data.menuButtonInfo
      wx.getSystemInfo({
        success: (res) => {
          const { statusBarHeight } = res
          const margin = top - statusBarHeight
          this.setData({
            navHeight: (height + statusBarHeight + (margin * 2)),
            searchMarginTop: statusBarHeight + margin, // 状态栏 + 胶囊按钮边距
            searchHeight: height,  // 与胶囊按钮同高
            searchWidth: right - width -20// 胶囊按钮右边坐标 - 胶囊按钮宽度 = 按钮左边可使用宽度
          })
        }
      })
        wx.setNavigationBarTitle({
          title: '商品分类'
        })
        this.getTabList().then(() => {
          this.gettabProducts()
        })
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
    async getTabList() {
            wx.showLoading({
                title: '数据加载中'
            })
            if (isTokenEmpty(getApp().globalData.token)) {
              showTokenInvalidModal();
              wx.hideLoading();
              return ;
            }
            let res= await wxRequest("GET","product/tabList")
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
                      console.log(this.data.products)
                })
      },
    async add_into_cart(e) {
      console.log(e)
      let res=await wxRequest("POST","cart/addProduct",{productId: this.data.products[e.currentTarget.dataset.value].Id});
      console.log(res)
      if(res.data.success) {
        wx.showToast({
          title: '商品添加成功！',
          duration: 500,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '商品添加失败，请重试~',
          duration: 1000,
          icon: 'none'
        })
      }
    },
    goto_goods(e) {
      console.log(e)
        wx.navigateTo({
          url: `/pages/goods/goods?id=${this.data.products[e.currentTarget.dataset.value].Id}`
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
      this.setData({
        currentTab: getApp().globalData.goto_tab
      })
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