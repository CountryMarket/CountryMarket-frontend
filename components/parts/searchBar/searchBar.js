Component({
  properties: {
    placeholder: {
      type: String,
      value: '',
    }
  },
  data: {
    inputValue: ''
  },
  methods: {
    // 用户输入
    handleInput: function(e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    // 点击清空输入框按钮
    handleDeleteClick: function() {
      this.setData({
        inputValue: ''
      })
    },
    // 点击取消触发
    handleTextbtnClick() {
      this.setData({
        inputValue: ''
      })
    },
    // 用户点击确定触发
    handleConfirm() {
      this.triggerEvent('handleSearch', this.data.inputValue)
    }
  }
})