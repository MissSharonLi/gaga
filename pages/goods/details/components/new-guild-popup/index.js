Component({
  options: {
    multipleSlots: true
  },
  properties: {
    show: {
      type: Boolean,
      observer(show) {
        if (show) {
          wx.setPageStyle({ style: { overflow: 'hidden' } })
        } else {
          wx.setPageStyle({ style: { overflow: 'auto' } })
        }
      }
    }
  },
  data: {
    current: 0
  },
  methods: {
    closeGuildPopup() {
      wx.pageScrollTo({ scrollTop: 0 })
      wx.setStorageSync('storage_new', true)
      this.triggerEvent('closeGuildPopup', {
        show: false
      })
    },
    doNext(e) {
      const { num } = e.currentTarget.dataset
      this.setData({ current: num })
      this.triggerEvent('doNext', { current: num })
    }
  }
})
