// pages/guanli/guanli.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal ,isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    from: 0,
    page_size: 100,
    goods: [],
    input_num_Hidden: true,
    now_id: 0,
    number_limit: 999,
    now_change_number: ''
  },
  add(e) {
    console.log('haha')
    if(this.data.goods[e.currentTarget.dataset.value].Stock < this.data.number_limit) {
      this.setData({
        [`goods[${e.currentTarget.dataset.value}].Stock`]: this.data.goods[e.currentTarget.dataset.value].Stock+1
      })
      this.change_number(e.currentTarget.dataset.value)
    } else {
      wx.showToast({
        title: '该商品库存不能增加了哟~',
        duration: 750,
        icon: 'none'
      })
    }
  },

  minus(e) {
    if(this.data.goods[e.currentTarget.dataset.value].Stock >=1) {
      this.setData({
        [`goods[${e.currentTarget.dataset.value}].Stock`]: this.data.goods[e.currentTarget.dataset.value].Stock-1
      })
      this.change_number(e.currentTarget.dataset.value)
    } else {
      wx.showToast({
        title: '该商品库存不能减少了哟~',
        duration: 750,
        icon: 'none'
      })
    }
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
            title: '亲库存数量太多了喔~',
            duration: 750,
            icon: 'none'
          })
        } else {
          this.setData({
            [`goods[${this.data.now_id}].Stock`]: this.data.now_change_number
          })
          this.change_number(this.data.now_id).then(()=>{
            this.modelCancel()
          })
        }
      }
    }
},
  async change_number(index) {
    console.log(this.data.goods[index])
    let res=await wxRequest("POST","shop/updateProduct",this.data.goods[index]);
    console.log(res)
    if(res.data.success) {
      wx.showToast({
        title: '商品库存修改成功',
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
  async drop_product(e) {
    let res=await wxRequest("POST","shop/dropProduct",{id: this.data.goods[e.currentTarget.dataset.value].Id});
    console.log(res)
    if(res.data.success) {
      wx.showToast({
        title: '商品下架成功',
        duration: 500,
        icon: 'none'
      })
      this.setData({
        [`goods[${e.currentTarget.dataset.value}].IsDrop`]: true
      })
    } else {
      wx.showToast({
        title: '商品下架失败，请重试~',
        duration: 1000,
        icon: 'none'
      })
    }
 },
 async put_product(e) {
  let res=await wxRequest("POST","shop/putProduct",{id: this.data.goods[e.currentTarget.dataset.value].Id});
  console.log(res)
  if(res.data.success) {
    wx.showToast({
      title: '商品上架成功',
      duration: 500,
      icon: 'none'
    })
    this.setData({
      [`goods[${e.currentTarget.dataset.value}].IsDrop`]: false
    })
  } else {
    wx.showToast({
      title: '商品上架失败，请重试~',
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
  inputHandler(e) {
    console.log(e)
    this.setData({
      now_id: e.currentTarget.dataset.value,
      now_change_number: this.data.goods[e.currentTarget.dataset.value].Stock,
      input_num_Hidden: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.get_goods()
  },

  goto_goods(e) {
    console.log(e)
    console.log(e.currentTarget.dataset.value)
      wx.navigateTo({
        url: `/pages/goods/goods?id=${this.data.goods[e.currentTarget.dataset.value].Id}`
      })
  },

  goto_addproduct() {
    wx.navigateTo({
      url: '/pages/addproduct/addproduct',
    })
  },
  get_goods() {
            if (isTokenEmpty(getApp().globalData.token)) {
              showTokenInvalidModal();
              wx.hideLoading();
              return ;
            }
            wxRequest("GET","shop/ownerProducts",{from: this.data.from, length: this.data.page_size}).then(res => {
                  console.log(res)
                  if (isResTokenInvalid(res)) {
                    showTokenInvalidModal();
                    get_goods();
                    return ;
                  }
                  if(res.data.data.Products == null) {
                    wx.showToast({
                      title: '您的商品已经看完了喔~',
                      icon: 'none'
                    })
                  } else {
                    this.setData({
                      goods: res.data.data.Products,
                      from: this.data.from + this.data.page_size
                    })
                  }
            }).then(()=> {
              console.log(this.data.goods)
          })
  },

  modelCancel() {
    this.setData({
      input_num_Hidden: true,
      now_id: 0,
      now_change_number: 0
    })
    this.getShopList()
},

modifyProduct(e) {
  wx.navigateTo({
    url: `/pages/updateproduct/updateproduct?id=${this.data.goods[e.currentTarget.dataset.value].Id}`,
  })
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
      this.setData({
        from: 0,
        goods: []
      })
    this.get_goods()
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
    this.get_goods()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})