import { handleUserLogin } from '../../../services/usercenter/login'
// import { phoneRegCheck } from '../../../utils/util'
Page({
  data: {
    loading: false,
    params: { account: '', password: '' }
  },
  handleOperation() {
    wx.navigateTo({ url: '/pages/usercenter/login-verify/index' })
  },
  accountChange(event) {
    this.setData({ params: { ...this.data.params, account: event.detail.value } })
  },
  passwordChange(event) {
    this.setData({ params: { ...this.data.params, password: event.detail.value } })
  },
  async handleSubmit() {
    const { account, password } = this.data.params
    if (!account) return wx.showToast({ title: '请输入账号', icon: 'none' })
    if (!password) return wx.showToast({ title: '请输入密码', icon: 'none' })
    // if (!phoneRegCheck(account)) return wx.showToast({ title: '账号格式不正确！', icon: 'none' })
    this.setData({ loading: true })
    const { code, data } = await handleUserLogin(this.data.params)
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
