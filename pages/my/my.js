// pages/my/my.js

import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken, showTokenInvalidModal } from "../../utils/wxRequest"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickName: "你好，请登录",
        avatarUrl: "https://blog.lyffly.com/static/images/avatar.jpg",
        isLogging: false,
        localToken: undefined, // 本地 token，用于和 global 的比较是否有出入
        permission: 1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '个人主页'
        })
        this.refresh();
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
      // 非第一次进入，判断 token 是否发生变化
      const { globalData } = getApp();
      validateToken().then(() => { // 检验 Token 合法性, 仅 my 页
          if (isTokenEmpty(globalData.token)) {
            showTokenInvalidModal();
            this.refresh();
          }
      }); 
    },
       
  goto_orders(e) {
    wx.navigateTo({
      url: `/pages/orders/orders?id=${e.currentTarget.dataset.value}`
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

    },

    // refresh，用于刷新，更新 local token，更新数据
    refresh: function() { 
      const { globalData } = getApp();
      // 如果有登录态，获取头像
      if (!isTokenEmpty(globalData.token)) {
         wxRequest("GET", "user/profile").then(res => {
          let porfile = res.data.data;
          this.setData({
            nickName: porfile.NickName,
            avatarUrl: porfile.AvatarUrl,
            permission: porfile.Permission
          });
        });
      } else { // 无登录态
        // 初始化数据，显示要求登录页面
        this.setData({
          nickName: "你好，请登录",
          avatarUrl: "https://blog.lyffly.com/static/images/avatar.jpg",
          permission: 1
        });
      }
  },

  goto_product() {
    wx.navigateTo({
      url: '/pages/addproduct/addproduct'
    })
  },

  goto_guanli() {
    console.log('跳转到管理')
      wx.navigateTo({
        url: '/pages/guanli/guanli'
      })
  },

  // 用户登录，此处 global token 会改变
  userLogin: async function() {
    const { globalData } = getApp();
    console.log(globalData.token)
    if (isTokenEmpty(globalData.token) && !this.data.isLogging) {
      this.data.isLogging = true;
      // 获取昵称头像
      try {
        let nickNameTmp, avatarUrlTmp;
        await new Promise((resolve) => {
          wx.getUserProfile({
            desc: '获取你的昵称、头像、地区及性别',
            success: res => {              
              nickNameTmp = res.userInfo.nickName;
              avatarUrlTmp = res.userInfo.avatarUrl;
              console.log(res.userInfo);
              resolve();
            },
            fail: res => {
              console.log(res)
              wx.showModal({
                title: "提示",
                content: "获取头像昵称失败",
                showCancel: false,
                confirmText: "知道了"
              });
              this.data.isLogging = false;
              return ;
            }
          })
        });
        wx.showLoading({
          title: '正在登录中...',
        });
        // 获取 code
        globalData.code = await wxLogin();
        // console.log(globalData.code)
        // 将 code 发送到云服务器，获取 token
        let res = await wxRequest("GET", "user/code", {
          code: globalData.code,
          nickName: nickNameTmp,
          avatarUrl: avatarUrlTmp
        });
        console.log(res)
        // 失败
        if (!res.data.success) {
          wx.showModal({
            title: "提示",
            content: "登录失败",
            showCancel: false,
            confirmText: "知道了"
          });
          this.data.isLogging = false;
          return ;
        }
        globalData.token = res.data.data.token;
        wx.setStorageSync("token", globalData.token); // 两处 token 一起修改
        this.data.localToken = globalData.token; // 本地同步

        // 获取头像
        res = await wxRequest("GET", "user/profile");
        let profile = res.data.data;
        if (!res.data.success) { // 获取不到暂时用当前的
          profile.NickName = nickNameTmp;
          profile.AvatarUrl = avatarUrlTmp;
        }

        // 更新昵称头像
        this.setData({
          nickName: profile.NickName,
          avatarUrl: profile.AvatarUrl,
          permission: profile.Permission,
        });
      } catch(err) {
        wx.showModal({
          title: "提示",
          content: "登录失败，发生错误",
          showCancel: false,
          confirmText: "知道了"
        });
        this.data.isLogging = false;
        return ;
      } finally {
        // 关闭 Loading 框
        wx.hideLoading();
        this.data.isLogging = false;
      }
    }
  }
})
