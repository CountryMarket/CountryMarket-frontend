// pages/updateproduct/updateproduct.js
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal, isResTokenInvalid } from "../../utils/wxRequest"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    info: {
      title: "",
      description: "",
      detail: "",
      price: 0.0,
      pictureNumber: 0,
      stock: 0
    },
    temp_val: 0,
    imgSrc: "",
    imgPPTSrc: [],
    imgDetailSrc: [],
    start: 0,
    end: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({
      imgSrc: getApp().globalData.imgSrc,
      imgPPTSrc: getApp().globalData.imgPPTSrc,
      imgDetailSrc: getApp().globalData.imgDetailSrc,
    })
    wx.showLoading({
      title: '正在加载...',
    })
    this.setData({
      id: Number(options.id)
    })
    let _res = await wxRequest("GET", "shop/product", {
      id: this.data.id
    })
    this.setData({
      [`info.title`]: _res.data.data.Title,
      [`info.description`]: _res.data.data.Description,
      temp_val: _res.data.data.Price,
      [`info.pictureNumber`]: _res.data.data.PictureNumber,
      [`info.stock`]: _res.data.data.Stock,
      [`info.detail`]: _res.data.data.Detail
    })
    let res = await wx.cloud.downloadFile({
      fileID: `cloud://prod-0guks42iab6ab66f.7072-prod-0guks42iab6ab66f-1311448235/assert/image/product/${options.id}/view.png`,
    })
    this.setData({
      imgSrc: res.tempFilePath
    })
    for (let i = 0; i < _res.data.data.PictureNumber; ++i) {
      console.log(`cloud://prod-0guks42iab6ab66f.7072-prod-0guks42iab6ab66f-1311448235/assert/image/product/${options.id}/carousel${i}.png`)
      res = await wx.cloud.downloadFile({
        fileID: `cloud://prod-0guks42iab6ab66f.7072-prod-0guks42iab6ab66f-1311448235/assert/image/product/${options.id}/carousel${i}.png`,
      })
      this.setData({
        [`imgPPTSrc[${i}]`]: res.tempFilePath
      })
    }
    for (let i = 0; i < _res.data.data.DetailPictureNumber; ++i) {
      console.log(`cloud://prod-0guks42iab6ab66f.7072-prod-0guks42iab6ab66f-1311448235/assert/image/product/${options.id}/detail${i}.png`)
      res = await wx.cloud.downloadFile({
        fileID: `cloud://prod-0guks42iab6ab66f.7072-prod-0guks42iab6ab66f-1311448235/assert/image/product/${options.id}/detail${i}.png`,
      })
      this.setData({
        [`imgDetailSrc[${i}]`]: res.tempFilePath
      })
    }
    getApp().globalData.imgPPTSrc = this.data.imgPPTSrc
    getApp().globalData.imgDetailSrc = this.data.imgDetailSrc
    getApp().globalData.imgSrc = this.data.imgSrc
    wx.hideLoading()
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
      imgDetailSrc: getApp().globalData.imgDetailSrc,
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

  },

  inputHandler_stock(e) {
    this.setData({
      [`info.stock`]: Number(e.detail.value)
    })
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
      temp_val: e.detail.value
    })
  },
  inputHandler_detail(e) {
    this.setData({
      [`info.detail`]: e.detail.value
    })
  },
  choosePictrue() {
    wx.navigateTo({
      url: `/pages/cropper/cropper?disable_ratio=true&width=300&height=300&&imgSrc=&&pos=-1&&type=0`
    })
  },
  choosePPTPictrue() {
    if (!this.data.imgPPTSrc) {
      wx.navigateTo({
        url: `/pages/cropper/cropper?disable_ratio=true&width=300&height=300&&imgSrc=&&pos=0&&type=0`
      })
    } else {
      wx.navigateTo({
        url: `/pages/cropper/cropper?disable_ratio=true&width=300&height=300&&imgSrc=&&type=0&&pos=${this.data.imgPPTSrc.length}`
      })
    }
  },
  modifyPPTPictrue(e) {
    if (this.data.end - this.data.start > 350) return ;
    wx.navigateTo({
      url: `/pages/cropper/cropper?disable_ratio=true&width=300&height=300&&imgSrc=&&type=0&&pos=${e.currentTarget.dataset.value}`
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

  chooseDetailPictrue() {
    /*if (!this.data.imgDetailSrc) {
      wx.navigateTo({
        url: `/pages/cropper/cropper?disable_ratio=false&width=300&height=300&&imgSrc=&&pos=0&&type=1`
      })
    } else {
      wx.navigateTo({
        url: `/pages/cropper/cropper?disable_ratio=false&width=300&height=300&&imgSrc=&&type=1&&pos=${this.data.imgDetailSrc.length}`
      })
    }*/
    let that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
          // const tempFilePaths = res.tempFilePaths;
          getApp().globalData.imgDetailSrc = [...getApp().globalData.imgDetailSrc, ...res.tempFilePaths]
          that.onShow();
      }
  })
  },
  modifyDetailPictrue(e) {
    if (this.data.end - this.data.start > 350) return ;
    /*wx.navigateTo({
      url: `/pages/cropper/cropper?disable_ratio=false&width=300&height=300&&imgSrc=&&type=1&&pos=${e.currentTarget.dataset.value}`
    })*/
  },
  detailLongTap(e) {
    // console.log(e)
    let that = this;
    wx.showModal({
      title: "提示",
      content: "删除该图片",
      success(res) {
        if (res.confirm) {
          let tmp = JSON.stringify(that.data.imgDetailSrc)
          let imgDetailSrcTmp = JSON.parse(tmp)
          let id = e.currentTarget.dataset.value

          tmp = imgDetailSrcTmp[imgDetailSrcTmp.length - 1];
          imgDetailSrcTmp[imgDetailSrcTmp.length - 1] = imgDetailSrcTmp[id];
          imgDetailSrcTmp[id] = tmp;
          imgDetailSrcTmp.length--

          tmp = getApp().globalData.imgDetailSrc[getApp().globalData.imgDetailSrc.length - 1];
          getApp().globalData.imgDetailSrc[ getApp().globalData.imgDetailSrc.length - 1] =  getApp().globalData.imgDetailSrc[id];
          getApp().globalData.imgDetailSrc[id] = tmp;
          getApp().globalData.imgDetailSrc.length--

          that.setData({
            imgDetailSrc: imgDetailSrcTmp
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
    if (this.data.info.detail == "") {
      wx.showModal({
        title: '提示',
        content: '详细介绍不能为空',
        showCancel: false
      })
      return
    }
    if (this.data.temp_val == 0) {
      wx.showModal({
        title: '提示',
        content: '价格不能为0',
        showCancel: false
      })
      return
    }
    if (this.data.info.stock <0 ) {
      wx.showModal({
        title: '提示',
        content: '库存不能小于0',
        showCancel: false
      })
      return
    }
    if(isNaN(this.data.temp_val)==true) {
      wx.showModal({
        title: '提示',
        content: '请输入合法价格',
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
      [`info.pictureNumber`]: this.data.imgPPTSrc.length,
      [`info.detailPictureNumber`]: this.data.imgDetailSrc.length,
      [`info.id`]: this.data.id,
      [`info.description`]: this.data.info.detail,
      [`info.price`]: Math.floor(parseFloat(this.data.temp_val)*100)/100
    })
    console.log(this.data.temp_val)
    console.log(this.data.info.price)
    let res = await wxRequest("POST", "shop/updateProduct", this.data.info)
    console.log(res)
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
    let id = this.data.id;
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
    for (let i = 0; i < this.data.imgDetailSrc.length; ++i) {
      let gg = i;
      await wx.cloud.uploadFile({
        cloudPath: 'assert/image/product/' + id + `/detail${gg}.png`, 
        filePath: this.data.imgDetailSrc[gg], 
        config: {
          env: 'prod-0guks42iab6ab66f' 
        },
        success: res => {
          console.log(res.fileID)
        },
        fail: err => {
          wx.showModal({
            title: '提示',
            content: `商品详情图第${gg + 1}张上传发生错误，请进入修改页面重新上传图片`,
          })
          console.error(err)
        }
      })
    }
    wx.hideLoading()
    wx.showModal({
      title: '提示',
      content: '修改成功！图片修改将会在3分钟内生效',
      showCancel: false,
      success(res) {
        wx.navigateBack({
          delta: -1
        })
      }
    })
    
  },

})