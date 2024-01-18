Component({
  properties: {
    title: {
      type: String,
      value: '',
      observer(title) {
        this.setData({
          title
        })
      }
    },
    type: {
      type: Number,
      value: 1,
      observer(type) {
        this.setData({
          type
        })
      }
    }
  },
  methods: {
    onBack() {
      wx.navigateBack()
    },
    onGoHome() {
      wx.reLaunch({
        url: '/pages/home/home'
      })
    }
  }
})
