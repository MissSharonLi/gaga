import { handleMobileLogin, handleSmsSend } from '../../../services/usercenter/login'
import { phoneRegCheck } from '../../../utils/util'
Page({
  data: {
    timer: null,
    loading: false,
    countText: '发送验证码',
    countdown: 60,
    params: { type: 1, mobile: '', captcha: '' }
  },
  timer: null,
  onShow() {
    this.setData({ countdown: 60 })
    this.setData({ countText: '发送验证码' })
  },
  onHide() {
    clearInterval(this.timer)
  },
  onUnload() {
    clearInterval(this.timer)
  },
  handleOperation() {
    wx.navigateTo({ url: '/pages/usercenter/login-input/index' })
  },
  // 倒计时
  handleCountDown() {
    let { countdown } = this.data
    this.timer = setInterval(() => {
      countdown--
      this.setData({ countdown })
      this.setData({ countText: `${this.data.countdown}s 重新发送` })
      if (countdown === 0) this.handleClear()
    }, 1000)
  },
  mobileChange(event) {
    this.setData({ params: { ...this.data.params, mobile: event.detail.value } })
  },
  captchaChange(event) {
    this.setData({ params: { ...this.data.params, captcha: event.detail.value } })
  },
  // 发送验证码
  async handleSmsSend() {
    const { mobile } = this.data.params
    if (!mobile) return wx.showToast({ title: '请输入手机号码', icon: 'none' })
    if (!phoneRegCheck(mobile)) return wx.showToast({ title: '手机号码格式不正确！', icon: 'none' })
    this.handleCountDown()
    const { code, data, msg } = await handleSmsSend({ mobile })
    if (code === 1) {
      wx.showToast({ title: data.msg, icon: 'none' })
    } else {
      wx.showToast({ title: msg, icon: 'none' })
      this.handleClear()
    }
  },
  // 清除倒计时
  handleClear() {
    this.setData({ countdown: 60 })
    this.setData({ countText: '发送验证码' })
    clearInterval(this.timer)
  },
  // 登录
  async handleSubmit() {
    const { mobile, captcha } = this.data.params
    if (!mobile) return wx.showToast({ title: '请输入手机号码', icon: 'none' })
    if (!captcha) return wx.showToast({ title: '请输入验证码', icon: 'none' })
    if (!phoneRegCheck(mobile)) return wx.showToast({ title: '手机号码格式不正确！', icon: 'none' })
    this.setData({ loading: true })
    const { code, data } = await handleMobileLogin(this.data.params)
    this.setData({ loading: false })
    if (code === 1) {
      wx.setStorageSync('storage_token', data.userinfo.token)
      wx.setStorageSync('storage_userInfo', JSON.stringify(data.userinfo))
      wx.switchTab({ url: '/pages/usercenter/index' })
    } else if (code === 0) {
      wx.showToast({ title: '账号或密码不正确！', icon: 'none' })
    }
  }
})
