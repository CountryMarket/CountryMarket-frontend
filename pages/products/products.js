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
        search: "",

        if_in_cart: [],
        input_num_Hidden: true,
        now_change_number: 0,
        nowChange_index: 0,
        number_limit:  999
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
      getApp().globalData.goto_tab=e.currentTarget.dataset.value
      this.gettabProducts()
    },
    
  changeModel() {
    if(this.data.now_change_number == '' || this.data.now_change_number == undefined) {
      wx.showToast({
        title: '亲不能什么都不输入呀~',
        duration: 750,
        icon: 'none'
      })
    } else {
      if(!(/(^[0-9]*$)/.test(this.data.now_change_number))) {//非整数
        wx.showToast({
          title: '现在是非法输入哦亲~',
          duration: 750,
          icon: 'none'
        })
      } else {
        this.setData({
          now_change_number: Number(this.data.now_change_number)
        })
        if(this.data.now_change_number == 0) {
          this.setData({
            now_change_number: 1
          })
        }
        if(this.data.now_change_number > this.data.number_limit) {
          wx.showToast({
            title: '亲购买数量太多了喔~',
            duration: 750,
            icon: 'none'
          })
        } else {
          if(this.data.now_change_number>this.data.products[this.data.nowChange_index].Stock) {
            wx.showToast({
              title: '亲,数量超过库存了喔~',
              duration: 750,
              icon: 'none'
            })
            console.log('haha')
          } else {
            this.modifyProduct_cart({idex: this.data.products[this.data.nowChange_index].Id, number: this.data.now_change_number}).then(()=> {
              this.modelCancel()
            })
          }
        }
      }
    }
},


async modifyProduct_cart(p) {
  let res=await wxRequest("POST","cart/modifyProduct",{productId: p.idex,modifyCount: p.number});
  console.log(res)
  if(res.data.success) {
    wx.showToast({
      title: '商品数量修改成功',
      duration: 500,
      icon: 'none'
    })
  } else {
    wx.showToast({
      title: '商品修改失败，请重试~',
      duration: 1000,
      icon: 'none'
    })
  }
},

modelCancel() {
  this.setData({
    input_num_Hidden: true,
    nowChange_index: 0,
    now_change_number: ""
  })
  this.gettabProducts()
},


  // 处理输入数量-------------------
  inputHandler(e) {
    this.setData({
      input_num_Hidden: false,
      nowChange_index: e.currentTarget.dataset.value,
      now_change_number: this.data.if_in_cart[e.currentTarget.dataset.value]
    })
    console.log(e)
    console.log(this.data.products[e.currentTarget.dataset.value])
  },
input_number_Handler(e) {
  this.setData({
    now_change_number: e.detail.value
  })
},

    //获取Tab List
    async getTabList() {
            wx.showLoading({
                title: '数据加载中'
            })
            /*if (isTokenEmpty(getApp().globalData.token)) {
              let that = this;
              showTokenInvalidModal(that);
              wx.hideLoading();
              return ;
            }*/
            let res= await wxRequest("GET","product/tabList")
                  console.log(res)
                  /*if (isResTokenInvalid(res)) {
                    let that = this;
                    showTokenInvalidModal(that);
                    getTabList();
                    return ;
                  }*/
                  this.setData({
                      tabList: res.data.data.Tabs,
                  })
                  this.setData({
                    currentId: this.data.tabList[this.data.currentTab].Id
                  })
            wx.hideLoading()
      },

      gettabProducts() {
        /*if (isTokenEmpty(getApp().globalData.token)) {
                  //showTokenInvalidModal();
                  wx.hideLoading();
                  return;
        }*/
                wxRequest("GET","product/tabProducts",{tabId: this.data.currentId}).then(res => {
                      console.log(this.data.currentId)
                      console.log(res)
                      if (isResTokenInvalid(res)) {
                        //showTokenInvalidModal();
                        this.gettabProducts();
                        return ;
                      }
                      this.setData({
                          products: res.data.data.Products
                      })
                      for(let i=0;i<this.data.products.length;i++) {
                         wxRequest("GET","cart/inCart",{productId: this.data.products[i].Id}).then(res => {
                          console.log(res)
                          if(res.data.data.InCart==true) {
                            this.setData({
                              [`if_in_cart[${i}]`]: res.data.data.Count
                            })
                          } else {
                            this.setData({
                              [`if_in_cart[${i}]`]: 0
                            })
                          }
                        })
                      }
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
        this.setData({
          [`if_in_cart[${e.currentTarget.dataset.value}]`]: this.data.if_in_cart[e.currentTarget.dataset.value]+1
        })
      } else {
        if (isResTokenInvalid(res)) {
          wx.showToast({
            title: '请先登录哦~',
            duration: 500,
            icon: 'none'
          })
          return;
        }
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

    search() {
      if (this.data.search == "") {
        wx.showToast({
          title: '不能没有输入哦~',
          icon: 'none'
        })
        return 
      }
      wx.navigateTo({
        url: `/pages/search_result/search_result?key=${this.data.search}`,
      })
    },
    handleInput(e) {
      this.setData({
        search: e.detail.value
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
      if(this.data.tabList==null) {
        this.getTabList()
      }
      this.setData({
        currentTab: getApp().globalData.goto_tab
      })
      this.setData({
        currentId: this.data.tabList[ this.data.currentTab ].Id
      })
      this.gettabProducts()
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