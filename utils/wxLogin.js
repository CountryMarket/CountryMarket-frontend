const wxLogin = () => {
  return new Promise((resolve) => {
    wx.login({
      success(res) {
        resolve(res.code);
      } 
    })
  })
}

module.exports = {
  wxLogin
}