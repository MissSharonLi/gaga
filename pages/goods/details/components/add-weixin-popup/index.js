import { getCustomer } from '../../../../../services/good/good'
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
          const timer = setTimeout(() => {
            this.setData({ qrcode: this.data.originQrcode })
            clearTimeout(timer)
          }, 500)
        } else {
          this.setData({ qrcode: '' })
          wx.setPageStyle({ style: { overflow: 'auto' } })
        }
      }
    }
  },
  data: {
    qrcode: '',
    originQrcode: ''
  },
  created() {
    this.getCustomer()
  },
  methods: {
    async getCustomer() {
      const { code, data } = await getCustomer()
      if (code === 1) {
        this.setData({ originQrcode: data.video_url })
      }
    },
    closeAddWeixinPopup() {
      this.triggerEvent('closeAddWeixinPopup', { show: false })
    }
  }
})
