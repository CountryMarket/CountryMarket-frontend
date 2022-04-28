# Token 系统前端使用文档

## 模式

本小程序前端使用 Token 作为小程序前端用户与后端交互的**登录凭证**。

即在”我的“页中点击登录可以向后端拿取到**有一定时限**的 Token，过期将无法使用，需要重新登录获取。

前端用户在向后端发起请求时，如果需要涉及用户相关操作，则需要在请求提供 Token 以便后端验证用户。

## token 位置

token 存在于 3 个位置：

- storage 中，可称为 storage token，与 global 的 token 同步，小程序运行开始时 token 从 storage 中取出，无则置为假值，主要是为了小程序关闭打开后还能延续 token
- globalData 中，可称为 global token，整个小程序目前最新的 token，**每次发送请求都会验证此 token 是否合法（过期），如有则会置 global token 以及 storage token 为假值**
- 每个页面中，可称为 local token，每个页面都有一个 local token，其主要是用于比较当前页面的 local token 和小程序的 global token 是否有区别 （有区别说明 Token 发生了改变），**如果有区别则会对页面做出刷新数据、刷新页面、显示需要登录等操作**，**除了比较区别不要用 local token 做任何事！用 global token！**

 ## 系统流程

### 小程序初次运行

初次运行，执行 app.js 中的内容，获取 storage token 并且检查其合法性，赋值给 global token

### 一个页面被初次加载

初次加载，则执行一次 refresh() 函数 (refresh 看后面)

具体初次加载判定实现为

- Tab 页面：父页面在 Tab 换页时，调用换到的页组件的 onEnter() 方法
- 普通页面：页面的 onload() 钩子

### 一个页面非初次加载

只存在于 Tab 页面，维护一个 isEnter 变量，如果进入过则置为 true，即可判定

非初次加载要判定 local token 和 global token 的区别，如果有区别要执行 refresh() 函数 (refresh 看后面)

```js
// onEnter 实例 (Tab 页面)
data: {
	localToken: undefined, // 本地 token，用于和 global 的比较是否有出入
	isEnter: false,
},
onEnter: function() { // 每次 tab 进页面调用
    if (!this.data.isEnter) { // 第一次进页面 refresh 一次
        this.setData({ isEnter: true });
        this.refresh();
    } else { // 非第一次进入，判断 token 是否发生变化
        const { globalData } = getApp();
        if (globalData.token != this.data.localToken) {
            this.refresh();
        }
    }
},
```

### refresh()

在下拉时需要调用这个函数，并且在上述两个情况下也有可能会调用这个函数。

这个函数作用即用于刷新，更新 local token (改为 global token)，更新当前页数据

```js
// refresh 实例
refresh: function() {
    const { globalData } = getApp();
    this.setData({localToken: globalData.token}); // 更新 token
    // 如果有登录态
    if (!isTokenEmpty(globalData.token)) {
        
        // 此处根据 token 获取数据
        // ...
        
    } else { // 无登录态
        
        // 初始化数据，显示要求登录页面
        // ...
        
        // 下面仅为示例
        this.setData({
            nickName: "你好，请登录",
            avatarUrl: "https://blog.lyffly.com/static/images/avatar.jpg",
        });
    }
},
```

**所有的页面更新都是 refresh 产生的，其他方法只是更新 global token**

### 发送请求

使用 utils/wxRequest.js 中的方法。

`wxRequest(method, path, data)`，方法名，请求路径，携带数据 (Object)

本方法自动携带 global token 发送到后端，**并且如果 token 不合法则将会置 global token 以及 storage token 为假值**

`isTokenEmpty(token)` 检验一个 token 是否为假值，即是否有登录态

`isResTokenInvalid(res)` 将 request 得到的返回值放进去可以检验 wxRequest 时有没有重置 global token

### 自动验证 token

使用 wxRequest 时自带的验证，会弹窗修改 token

### 手动验证 token

使用 `validateToken()` ，静默修改 token