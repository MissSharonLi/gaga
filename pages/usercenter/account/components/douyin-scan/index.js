import { getMyDouYinCode, handleDouYinCheckCode } from '../../../../../services/usercenter/login'
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    show: {
      type: Boolean,
      observer(show) {
        show ? this.handleCountDown() : this.handleClear()
      }
    }
  },
  data: {
    countdown: 300,
    qrcode: '',
    state: ''
  },
  timer: null,
  detached() {
    this.handleClear()
  },
  methods: {
    async getMyDouYinCode() {
      const token = wx.getStorageSync('storage_token')
      const { code, data } = await getMyDouYinCode({ token })
      if (code === 1) {
        this.setData({ qrcode: data.qrcode_index_url, state: data.state })
      }
    },
    closeScanPopup() {
      this.triggerEvent('closeScanPopup', {
        show: false
      })
    },
    // 刷新
    handleRefresh() {
      this.handleClear()
      this.setData({ countdown: 300 })
      this.handleCountDown()
    },
    // 倒计时
    handleCountDown() {
      this.getMyDouYinCode()
      let { countdown } = this.data
      this.timer = setInterval(() => {
        countdown--
        this.setData({ countdown })
        this.handleDouYinCheckCode()
        if (countdown === 0) this.handleClear()
      }, 1000)
    },
    // 清除倒计时
    handleClear() {
      clearInterval(this.timer)
      const timer = setTimeout(() => {
        this.setData({ countdown: 300, qrcode: '' })
        clearTimeout(timer)
      }, 1000)
    },
    // 轮询是否扫码成功
    async handleDouYinCheckCode() {
      const token = wx.getStorageSync('storage_token')
      const { code } = await handleDouYinCheckCode({ token, state: this.data.state })
      if (code === 1) {
        this.triggerEvent('success')
        this.handleClear()
        this.setData({ show: false })
      }
    }
  }
})
