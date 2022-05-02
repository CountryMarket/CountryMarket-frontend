// pages/cart/cart.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '李家炫',//收货人姓名
    tel: '15975539500',//电话
    address: '广东省深圳市南山区学府路深圳大学',//收货地址

    shopList: [],
    page_from: 0,
    page_length: 50,

    now_change_number: 1,//弹出输入框
    input_num_Hidden: true,
    nowChange_index: 0,

    number: [], //每个商品的选择数量
    number_limit: 999,
    left: [], //商品的库存
    money_sum: 0.00,//理论总价
    total_money: 0.00,//计总价，优惠
    show_money_sum: 0.00,
    // 后端需要记录上一次的购物车预选信息
    isSelected: [],//记录是否被选中,默认不,到时要转数组
    is_all_Selected: false,

    startX: '', //开始位置空
    active: false  //左滑删除是否工作,默认false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '购物车'
    })
    this.getShopList() //获取购物车数据
  },

  // 跳转到商品页
  goto_goods(e) {
    console.log(e)
      wx.navigateTo({
        url: `/pages/goods/goods?id=${e.currentTarget.dataset.value}`
      })
  },

  //获取商品列表信息-----------------------------------------------------
  getShopList() {
      wx.showLoading({
          title: '数据加载中'
      })
      wxRequest("GET","cart/userProducts",{from: this.data.page_from, length: this.data.page_length}).then(res => {
            console.log(res)
            if(res.data.data.Products==null) {
              wx.showToast({
                title: '购物车已经到底了喔~',
                icon: 'none'
              })
            } else {
              this.setData({
                shopList: [...this.data.shopList,...res.data.data.Products],
                page_from: this.data.page_from + this.data.page_length
              })
            }
      })
      console.log(this.data.shopList)
      wx.hideLoading()
      this.countAll()
},

    //单量改变-------------------------
    add(e) {
        console.log(e.currentTarget.dataset.value)
        if(this.data.shopList[e.currentTarget.dataset.value].Count >= this.data.number_limit) {
          wx.showToast({
            title: '亲购买数量太多了喔~',
            duration: 750,
            icon: 'none'
          })
        } else {
          this.setData({
            [`shopList[${e.currentTarget.dataset.value}].Count`]: this.data.shopList[e.currentTarget.dataset.value].Count + 1
          }) 
          this.countAll()
        }
    },
    minus(e) {
        if(this.data.shopList[e.currentTarget.dataset.value].Count > 1) {
          this.setData({
            [`shopList[${e.currentTarget.dataset.value}].Count`]: this.data.shopList[e.currentTarget.dataset.value].Count - 1
          }) 
        } else {
          wx.showToast({
            title: '该宝贝不能减少了哟~',
            duration: 750,
            icon: 'none'
          })
        }
        this.countAll()
    },
  // 处理输入数量-------------------
  inputHandler(e) {
    this.setData({
      input_num_Hidden: false,
      nowChange_index: e.currentTarget.dataset.value,
      now_change_number: this.data.shopList[e.currentTarget.dataset.value].Count
    })
    console.log(e)
    // if(e.detail.value == "") {
    //   this.setData({
    //     [`shopList[${e.currentTarget.dataset.value}].Count`]: 0
    //   })
    // } else {
    //   this.setData({
    //     [`shopList[${e.currentTarget.dataset.value}].Count`]: Number(e.detail.value)
    //   })
    // }
  },

  input_number_Handler(e) {
      this.setData({
        now_change_number: e.detail.value
      })
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
            this.setData({
              [`shopList[${this.data.nowChange_index}].Count`]: Number(this.data.now_change_number)
            })
            this.countAll()
            this.modelCancel()
          }
        }
      }
  },

  modelCancel() {
      this.setData({
        input_num_Hidden: true,
        nowChange_index: 0,
        now_change_number: ""
      })
  },


/**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({
      shopList: [],
      isSelected: [],
      page_from: 0
    })
    this.getShopList(()=> {
      wx.stopPullDownRefresh()
    })
    this.countAll()
    wx.stopPullDownRefresh()
  },

  //触底事件-----------------------------------------
  onReachBottom() {
    this.getShopList()
  },

  // 滑动出现删除-----------------------------------
  touchStart: function(e) {
      console.log(e)
      this.setData({
        startX: e.touches[0].clientX
      })
  },
  touchMove: function(e) {
      console.log('move',e.touches[0])
      var moveX = e.touches[0].clientX;
      if(moveX < this.data.startX-30) {
          this.setData({
            active: true
          })
      } else {
        this.setData({
          active: false
        })
      }
  },

  //----------------------------------------------
  change_isSelected(e) {
    console.log(e.currentTarget.dataset.value)
    this.setData({
      [`isSelected[${e.currentTarget.dataset.value}]`]: this.data.isSelected[e.currentTarget.dataset.value]==1 ? 0 : 1
    })
    this.countAll()
  },

  change_all_selected() {
      this.setData({
        is_all_Selected: false
      })
      for(let i = 0, len = this.data.shopList.length ; i<len ; i++) {
          if(this.data.isSelected[i] == 1) continue;
          this.setData({
            is_all_Selected: true
          })
          break;
      } 
      if(this.data.is_all_Selected == false) {
          for(let i = 0, len = this.data.shopList.length ; i<len ; i++) {
              this.setData({
                [`isSelected[${i}]`]: 0
              })
          } 
      } else {
          for(let i = 0, len = this.data.shopList.length ; i<len ; i++) {
            this.setData({
              [`isSelected[${i}]`]: 1
            })
          } 
      }
      console.log(this.data.is_all_Selected)
      this.countAll()
  },

  countAll() {
    this.setData({
      money_sum: 0.00
    }) 
    for(let i = 0, len = this.data.isSelected.length ; i<len ; i++) {
      if(this.data.isSelected[i] == 1) {
        this.setData({
          money_sum: this.data.money_sum+(this.data.shopList[i].Count*this.data.shopList[i].Price)
        })
      }
    } 
    this.setData({
      money_sum: this.data.money_sum.toFixed(2),
      show_money_sum: this.data.money_sum.toFixed(2)
    })
    this.countFinal()
  },
  countFinal() {
      console.log('计算最终')
      this.setData({
        total_money: this.data.money_sum
      })
      console.log(this.data.show_money_sum)
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
   * 页面上拉触底事件的处理函数
   */


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})