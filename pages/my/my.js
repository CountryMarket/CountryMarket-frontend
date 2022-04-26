// pages/my/my.js
import { wxLogin } from "../../utils/wxLogin"
import { wxRequest } from "../../utils/wxRequest"

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
  },

  /**
   * 组件的方法列表
   */
  methods: {
    userLogin: async function() {
      const globalData = getApp().globalData;
      if (globalData.openId == undefined) {
        // 获取昵称头像
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
              return
            }
          })
        });
        // 获取 code
        globalData.code = await wxLogin();
        // console.log(globalData.code)
        // 将 code 发送到云服务器，获取 OpenId
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
          return ;
        }
        globalData.openId = res.data.data.openid;


        // 更新昵称头像
        this.setData({
          nickName: nickNameTmp,
          avatarUrl: avatarUrlTmp
        });
      }
    }
  },
})
