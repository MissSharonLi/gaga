Component({
  options: {
    multipleSlots: true
  },

  properties: {
    show: {
      type: Boolean
    },
    src: {
      type: String,
      observer(show) {
        if (show) {
          wx.setPageStyle({ style: { overflow: 'hidden' } })
        } else {
          wx.setPageStyle({ style: { overflow: 'auto' } })
        }
      }
    }
  },

  methods: {
    change(e) {
      const { index } = e.currentTarget.dataset
      this.triggerEvent('videoChange', {
        index
      })
    },

    closeVideoPopup() {
      this.triggerEvent('closeVideoPopup', {
        show: false
      })
    }
  }
})
