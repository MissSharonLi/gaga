Component({
  options: {
    multipleSlots: true
  },

  properties: {
    title: {
      type: String,
      value: '领取要求说明'
    },
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
  methods: {
    change(e) {
      const { index } = e.currentTarget.dataset
      this.triggerEvent('promotionChange', {
        index
      })
    },

    closePromotionPopup() {
      this.triggerEvent('closePromotionPopup', {
        show: false
      })
    }
  }
})
