// pages/addproduct/addproduct.js
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal, isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
      title: "",
      description: "",
      price: 0.0,
      pictureNumber: 0
    },
    imgSrc: "",
    imgPPTSrc: [],
    start: 0,
    end: 0,
  },

  inputHandler_title(e) {
    this.setData({
      [`info.title`]: e.detail.value
    })
  },
  inputHandler_description(e) {
    this.setData({
      [`info.description`]: e.detail.value
    })
  },
  inputHandler_price(e) {
    this.setData({
      [`info.price`]: parseFloat(e.detail.value)
    })
  },
  choosePictrue() {
    wx.navigateTo({
      url: `/pages/cropper/cropper?width=300&height=300&&imgSrc=&&pos=-1`
    })
  },
  choosePPTPictrue() {
    if (!this.data.imgPPTSrc) {
      wx.navigateTo({
        url: `/pages/cropper/cropper?width=300&height=300&&imgSrc=&&pos=0`
      })
    } else {
      wx.navigateTo({
        url: `/pages/cropper/cropper?width=300&height=300&&imgSrc=&&pos=${this.data.imgPPTSrc.length}`
      })
    }
  },
  modifyPPTPictrue(e) {
    if (this.data.end - this.data.start > 350) return ;
    wx.navigateTo({
      url: `/pages/cropper/cropper?width=300&height=300&&imgSrc=&&pos=${e.currentTarget.dataset.value}`
    })
  },
  mytouchstart: function (e) { 
    this.setData({start: e.timeStamp })
  },
  mytouchend: function (e) {  
    this.setData({end: e.timeStamp })
  }, 
  PPTlongTap(e) {
    // console.log(e)
    let that = this;
    wx.showModal({
      title: "提示",
      content: "删除该图片",
      success(res) {
        if (res.confirm) {
          let tmp = JSON.stringify(that.data.imgPPTSrc)
          let imgPPTSrcTmp = JSON.parse(tmp)
          let id = e.currentTarget.dataset.value

          tmp = imgPPTSrcTmp[imgPPTSrcTmp.length - 1];
          imgPPTSrcTmp[imgPPTSrcTmp.length - 1] = imgPPTSrcTmp[id];
          imgPPTSrcTmp[id] = tmp;
          imgPPTSrcTmp.length--

          tmp = getApp().globalData.imgPPTSrc[getApp().globalData.imgPPTSrc.length - 1];
          getApp().globalData.imgPPTSrc[ getApp().globalData.imgPPTSrc.length - 1] =  getApp().globalData.imgPPTSrc[id];
          getApp().globalData.imgPPTSrc[id] = tmp;
          getApp().globalData.imgPPTSrc.length--

          that.setData({
            imgPPTSrc: imgPPTSrcTmp
          })
        }
      }
    })
  },
  async uploadProduct() {
    if (this.data.info.title == "") {
      wx.showModal({
        title: '提示',
        content: '标题不能为空',
        showCancel: false
      })
      return
    }
    if (this.data.info.description == "") {
      wx.showModal({
        title: '提示',
        content: '描述不能为空',
        showCancel: false
      })
      return
    }
    if (this.data.info.price == 0) {
      wx.showModal({
        title: '提示',
        content: '价格不能为0',
        showCancel: false
      })
      return
    }
    if (this.data.imgSrc == "" || !this.data.imgSrc) {
      wx.showModal({
        title: '提示',
        content: '图片不能为空',
        showCancel: false
      })
      return
    }
    wx.showLoading({
      title: '正在提交商品...',
    })
    this.setData({
      [`info.pictureNumber`]: this.data.imgPPTSrc.length
    })
    let res = await wxRequest("POST", "shop/addProduct", this.data.info)
    if (isResTokenInvalid(res)) {
      wx.hideLoading()
      showTokenInvalidModal();
      return 
    }
    if (!res.data.success) {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '提交发生错误',
        showCancel: false
      })
      return 
    }
    let id = res.data.data.id;
    await wx.cloud.uploadFile({
      cloudPath: 'assert/image/product/' + id + '/view.png', 
      filePath: this.data.imgSrc, 
      config: {
        env: 'prod-0guks42iab6ab66f' 
      },
      success: res => {
        console.log(res.fileID)
      },
      fail: err => {
        wx.showModal({
          title: '提示',
          content: '图片上传发生错误，请进入修改页面重新上传图片',
        })
        console.error(err)
      }
    })
    for (let i = 0; i < this.data.imgPPTSrc.length; ++i) {
      let gg = i;
      await wx.cloud.uploadFile({
        cloudPath: 'assert/image/product/' + id + `/carousel${gg}.png`, 
        filePath: this.data.imgPPTSrc[gg], 
        config: {
          env: 'prod-0guks42iab6ab66f' 
        },
        success: res => {
          console.log(res.fileID)
        },
        fail: err => {
          wx.showModal({
            title: '提示',
            content: `幻灯图第${gg + 1}张上传发生错误，请进入修改页面重新上传图片`,
          })
          console.error(err)
        }
      })
    }
    wx.showModal({
      title: '提示',
      content: '新增成功！',
      showCancel: false
    })
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getApp().globalData.imgSrc = ""
    getApp().globalData.imgPPTSrc = []
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
      imgSrc: getApp().globalData.imgSrc,
      imgPPTSrc: getApp().globalData.imgPPTSrc,
    })
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