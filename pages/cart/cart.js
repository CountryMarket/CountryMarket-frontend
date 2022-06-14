// pages/cart/cart.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

let lastPos = [];
let startTrans = [];
let rightWidth = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {

    shopList: [],
    page_from: 0,
    page_length: 50,

    address_message: [],

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
    // isSelected: [],//记录是否被选中,默认不,到时要转数组

    is_all_Selected: false,

    startX: '', //开始位置空
    active: false,  //左滑删除是否工作,默认false

    translateX: [],
    
    push: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '购物车'
    })
    // this.getShopList() //获取购物车数据
    this.getAddressList() //获取地址信息列表
  },

  // 跳转到商品页
  goto_goods(e) {
    console.log(e)
      wx.navigateTo({
        url: `/pages/goods/goods?id=${e.currentTarget.dataset.value}`
      })
  },

  goto_xiadan() {
    this.countAll()
    if(this.data.total_money==0) {
      wx.showToast({
        title: '亲，请选择商品哦~',
        duration: 2000,
        icon: 'none'
      })
    } else {
      wx.navigateTo({
          url: `/pages/xiadan/xiadan?id=${this.data.push}`
        })
    }
      
  },

  //获取商品列表信息-----------------------------------------------------
  getShopList() {
    console.log('获取商品列表')
          wx.showLoading({
              title: '数据加载中'
          })
          if (isTokenEmpty(getApp().globalData.token)) {
            this.setData({
              page_from: 0
            })
            let that = this;
            showTokenInvalidModal(that);
            wx.hideLoading();
            return ;
          }
          wxRequest("GET","cart/userProducts",{from: 0, length: this.data.page_length}).then(async res => {
                console.log(res)
                if (isResTokenInvalid(res)) {
                  let that = this;
                  showTokenInvalidModal(that);
                  return ;
                }
                if(res.data.data.Products==null) {
                    this.setData({
                      page_from: this.data.page_from + this.data.page_length
                    })
                  wx.showToast({
                    title: '购物车已经到底了喔~',
                    icon: 'none'
                  })
                } else {
                  let st=this.data.shopList.length
                  this.setData({
                    is_all_Selected: false,        
                    page_from: this.data.page_from + this.data.page_length,
                    // shopList: [...this.data.shopList,...res.data.data.Products]
                    shopList: res.data.data.Products
                  })
                  console.log(this.data.shopList)
                  let tmpShopList = this.data.shopList;
                  console.log(tmpShopList)
                  for(let i=0;i<res.data.data.Products.length;i++) {
                    //tmpShopList[st+i]['isSelected'] = 0;
                    Object.defineProperty(tmpShopList[i], 'isSelected', {value: 0, enumerable: true, writable: true});
                    console.log(tmpShopList)
                  }
                  this.setData({
                    shopList: tmpShopList
                  })
                  console.log(this.data.shopList)
                }
          }).then(()=> {
          console.log(this.data.shopList)
          wx.hideLoading()
          this.countAll()
        }).then(() => {
          wx.createSelectorQuery().in(this).selectAll(".delete").boundingClientRect(res => {
            console.log(res)
            rightWidth = res[0].width;
          }).exec();
        })
    },

    //获取收货信息列表
    getAddressList() {
      if (isTokenEmpty(getApp().globalData.token)) {
                return ;
       }
      wxRequest("GET","address/address").then(res => {
        console.log(res)
                    if (isResTokenInvalid(res)) {
                      getAddressList();
                      return ;
                    }
                    this.setData({
                      address_message: res.data.data.Address
                    })
                    console.log(this.data.address_message)
              })
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
          if(this.data.shopList[e.currentTarget.dataset.value].Count>=this.data.shopList[e.currentTarget.dataset.value].Stock) {
            wx.showToast({
              title: '超过库存咯~',
              duration: 750,
              icon: 'none'
            })
          } else {
            this.add_into_cart(this.data.shopList[e.currentTarget.dataset.value].Id).then(() => {
              this.setData({
                [`shopList[${e.currentTarget.dataset.value}].Count`]: this.data.shopList[e.currentTarget.dataset.value].Count+1
              })
            })
          }
          
        }
    },
    minus(e) {
        if(this.data.shopList[e.currentTarget.dataset.value].Count > 1) {
          this.reduce_from_cart(this.data.shopList[e.currentTarget.dataset.value].Id).then(() => {
            this.setData({
              [`shopList[${e.currentTarget.dataset.value}].Count`]: this.data.shopList[e.currentTarget.dataset.value].Count-1
            })
          })
        } else {
          wx.showToast({
            title: '该宝贝不能减少了哟~',
            duration: 750,
            icon: 'none'
          })
        }
    },
  // 处理输入数量-------------------
  inputHandler(e) {
    this.setData({
      input_num_Hidden: false,
      nowChange_index: e.currentTarget.dataset.value,
      now_change_number: this.data.shopList[e.currentTarget.dataset.value].Count
    })
    console.log(e)
  },

  input_number_Handler(e) {
      this.setData({
        now_change_number: e.detail.value
      })
  },

  async add_into_cart(idex) {
    let res=await wxRequest("POST","cart/addProduct",{productId: idex});
    console.log(res)
    if(res.data.success) {
      wx.showToast({
        title: '商品+1',
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

  input_number_Handler(e) {
    this.setData({
      now_change_number: e.detail.value
    })
},

async reduce_from_cart(idex) {
  let res=await wxRequest("POST","cart/reduceProduct",{productId: idex});
  console.log(res)
  if(res.data.success) {
    wx.showToast({
      title: '商品-1',
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

goto_home() {
  console.log('haha')
  wx.switchTab({
    url: '/pages/home/home',
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
            if(this.data.now_change_number>this.data.shopList[this.data.nowChange_index].Stock) {
              wx.showToast({
                title: '亲,数量超过库存了喔~',
                duration: 750,
                icon: 'none'
              })
              console.log('haha')
            } else {
              this.modifyProduct_cart({idex: this.data.shopList[this.data.nowChange_index].Id, number: this.data.now_change_number}).then(()=> {
                console.log('寄')
                this.setData({
                  [`shopList[${this.data.nowChange_index}].Count`]: this.data.now_change_number
                })
                this.modelCancel()
              })
            }
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
      page_from: 0,
      translateX: []
    })
    console.log(this.data.translateX)
    this.getShopList(()=> {
      wx.stopPullDownRefresh()
    })
    this.countAll()
    wx.stopPullDownRefresh()
  },

  //触底事件-----------------------------------------
  onReachBottom() {
    wx.showToast({
      title: '亲已经到底了哦~',
      duration: 750,
      icon: 'none'
    })
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
  async change_isSelected(e) {
    console.log(e.currentTarget.dataset.value)
    if(this.data.shopList[e.currentTarget.dataset.value].Count<=this.data.shopList[e.currentTarget.dataset.value].Stock) {
          this.setData({
            [`shopList[${e.currentTarget.dataset.value}].isSelected`]: this.data.shopList[e.currentTarget.dataset.value].isSelected==1 ? 0 : 1
          })
          console.log(this.data.shopList[e.currentTarget.dataset.value].isSelected)
          if(this.data.shopList[e.currentTarget.dataset.value].isSelected==1) {//选中
            console.log('当前被选中')
            let temp=true
            for(let i=0;i<this.data.shopList.length;i++) {
              if(this.data.shopList[i].isSelected==1||this.data.shopList[i].Count>this.data.shopList[i].Stock) continue;
              temp=false;
              break;
            }
            if(temp==true) {
              this.setData({
                is_all_Selected: true
              })
              console.log(this.data.shopList)
            }
            this.countAll()
        }  else {
          this.setData({
            is_all_Selected: false
          })
          console.log(this.data.shopList)
          this.countAll()
        }
    } else {
      wx.showToast({
        title: '亲，库存不足哦~',
        icon: 'none',
        duration: 1000
      })
    }
  },

  change_all_selected() {
    let zzq=false
    for(let i = 0, len = this.data.shopList.length ; i<len ; i++) {
        if(this.data.shopList[i].Count>this.data.shopList[i].Stock) continue;
        this.setData({
          zzq: true
        })
        break;
    } 
    if(zzq==false) {
      wx.showToast({  
        title: '当前没有商品可选~',
        duration: 750,
        icon: 'none'
      })
      return
    }
      this.setData({
        is_all_Selected: false
      })
      for(let i = 0, len = this.data.shopList.length ; i<len ; i++) {
          if(this.data.shopList[i].isSelected == 1||this.data.shopList[i].Count>this.data.shopList[i].Stock) continue;
          this.setData({
            is_all_Selected: true
          })
          break;
      } 
      if(this.data.is_all_Selected == false) {
          for(let i = 0, len = this.data.shopList.length ; i<len ; i++) {
              this.setData({
                [`shopList[${i}].isSelected`]: 0
              })
          } 
      } else {
          for(let i = 0, len = this.data.shopList.length ; i<len ; i++) {
            if(this.data.shopList[i].Count>this.data.shopList[i].Stock) continue;
            this.setData({
              [`shopList[${i}].isSelected`]: 1
            })
          } 
      }
      console.log(this.data.is_all_Selected)
      this.countAll()
  },

  countAll() {
    this.setData({
      money_sum: 0.00,
      push: []
    }) 
    console.log('计算总价')
    for(let i = 0, len = this.data.shopList.length ; i<len ; i++) {
      if(this.data.shopList[i].isSelected == 1) {
        this.setData({
          money_sum: this.data.money_sum+(this.data.shopList[i].Count*this.data.shopList[i].Price),
          push: [...this.data.push,this.data.shopList[i].Id]
        })
      }
    } 
    this.setData({
      money_sum: this.data.money_sum.toFixed(2),
      show_money_sum: this.data.money_sum.toFixed(2)
    })
    console.log(this.data.money_sum)
    this.countFinal()
  },

  countFinal() {
      console.log('计算最终')
      this.setData({
        total_money: this.data.money_sum
      })
      console.log(this.data.show_money_sum)
  },

  // 左滑删除
  onItemTouchstart(e) {
    let index = e.currentTarget.dataset.value;
    lastPos[index] = e.changedTouches[0].pageX;
    startTrans[index] = this.data.translateX[index];
    if (!this.data.translateX[index]) {
      this.setData({
        [`translateX[${index}]`]: 0
      })
    }
  },
  onItemTouchmove(e) {
    let index = e.currentTarget.dataset.value;
    let delta = e.changedTouches[0].pageX - lastPos[index];
    if (this.data.translateX[index] + delta < -rightWidth) {
      delta = -rightWidth - this.data.translateX[index]
    }
    if (this.data.translateX[index] + delta > 0) {
      delta = 0 - this.data.translateX[index]
    }
    if (this.data.translateX[index] < 0) { // 当前已左移
      if (this.data.translateX[index] < -rightWidth) {
        this.setData({
          [`translateX[${index}]`]: -rightWidth
        })
      } else if (this.data.translateX[index] == -rightWidth) {
        if (delta >= 0) { // 右移
          this.setData({
            [`translateX[${index}]`]: this.data.translateX[index] + delta
          })
        }
      } else {
        this.setData({
          [`translateX[${index}]`]: this.data.translateX[index] + delta
        })
      }
    } else if (this.data.translateX[index] == 0) { // 当前在原位
      if (this.data.translateX[index] + delta <= 0) { // 左移
        this.setData({
          [`translateX[${index}]`]: this.data.translateX[index] + delta
        })
      }
    } else { // 将要右移
      this.setData({
        [`translateX[${index}]`]: 0
      })
    }

    // 更新 lastPos
    lastPos[index] = e.changedTouches[0].pageX;
  },
  onItemTouchend(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.value;
    if (this.data.translateX[index] >= -(rightWidth - 30) && startTrans[index] == -rightWidth) {
      this.setData({
        [`translateX[${index}]`]: 0
      })
    } else if (this.data.translateX[index] <= -30) {
      this.setData({
        [`translateX[${index}]`]: -rightWidth
      })
    } else {
      this.setData({
        [`translateX[${index}]`]: 0
      })
    }
  },

  async delete_cart(e) {
    console.log(e)
    console.log(this.data.shopList)
    let res=await wxRequest("POST","cart/modifyProduct",{productId: this.data.shopList[e.currentTarget.dataset.value].Id, modifyCount: 0});
    console.log(res)
    this.getShopList()
  },

  onTapOnItem() {
    this.setData({
      translateX: []
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
      this.getAddressList()
      this.getShopList()
  },













  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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