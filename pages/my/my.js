// pages/my/my.js
import { wxLogin } from "../../utils/wxLogin"
import { wxRequest, isTokenEmpty, validateToken } from "../../utils/wxRequest"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    winHeight: 0
  },

  /**
   * 组件的初始数据
   */
  data: {
    nickName: "你好，请登录",
    avatarUrl: "https://blog.lyffly.com/static/images/avatar.jpg",
    isLogging: false,
    localToken: undefined, // 本地 token，用于和 global 的比较是否有出入
    isEnter: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    refresh: function() { // refresh，用于刷新，更新 local token，更新数据
      const { globalData } = getApp();
      this.setData({localToken: globalData.token});
      // 如果有登录态，获取头像
      if (!isTokenEmpty(globalData.token)) {
        this.setData({
          nickName: wx.getStorageSync("nickName"),
          avatarUrl: wx.getStorageSync("avatarUrl")
        });
      } else { // 无登录态
        // 初始化数据，显示要求登录页面
        this.setData({
          nickName: "你好，请登录",
          avatarUrl: "https://blog.lyffly.com/static/images/avatar.jpg",
        });
      }
    },
    onEnter: function() { // 每次 tab 进页面调用
      if (!this.data.isEnter) { // 第一次进页面 refresh 一次
        this.setData({ isEnter: true });
        this.refresh();
      } else { // 非第一次进入，判断 token 是否发生变化
        const { globalData } = getApp();
        validateToken().then(() => {
          if (globalData.token != this.data.localToken) {
            this.refresh();
          }
        }); // 检验 Token 合法性, 仅 my 页
        if (globalData.token != this.data.localToken) {
          this.refresh();
        }
      }
    },
    userLogin: async function() { // 用户登录，此处 global token 会改变
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
                nickNameTmp = res.userInfo.nickName;
                avatarUrlTmp = res.userInfo.avatarUrl;
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
            code: globalData.code
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
          wx.setStorageSync("nickName", nickNameTmp);
          wx.setStorageSync("avatarUrl", avatarUrlTmp);

          // 更新昵称头像
          this.setData({
            nickName: nickNameTmp,
            avatarUrl: avatarUrlTmp
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
  },
})
