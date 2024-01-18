import { handleUserWxapplogin, handleWxapplogin } from '../../../services/usercenter/login'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sign: '',
    btnType: 0,
    userInfo: {},
    isAgree: false,
    showDialog: false,
    isGetPopupShow: false,
    isVerification: '0',
    dialogKey: 'showDialog',
    confirmBtn: { content: '同意并登录', variant: 'base' }
  },
  onLoad() {},
  // 勾选同意协议
  handleChange(event) {
    this.setData({ isAgree: event.detail.checked })
  },

  // 登录方式
  handleToLogin({ currentTarget }) {
    const { type } = currentTarget.dataset
    this.setData({ btnType: type })
    switch (type) {
      case 0: {
        if (this.data.isAgree) return this.handleUserWxapplogin()
        // 弹出同意协议弹框
        this.showDialog()
        break
      }
      case 1: {
        if (!this.data.isAgree) return this.showDialog()
        wx.navigateTo({ url: '/pages/usercenter/login-input/index' })
        break
      }
      default:
        if (!this.data.isAgree) return this.showDialog()
        wx.navigateTo({ url: '/pages/usercenter/login-verify/index' })
    }
  },
  // 判断是否需要手机号授权
  async handleUserWxapplogin() {
    wx.login({
      provider: 'weixin',
      onlyAuthorize: true,
      success: async (obj) => {
        const { code, data } = await handleUserWxapplogin({ code: obj.code })
        if (code === 1 && data) {
          const { isVerification, sign, userinfo, token } = data
          this.setData({ isVerification })
          if (isVerification === '1') {
            wx.setStorageSync('storage_token', token)
            wx.setStorageSync('storage_userInfo', userinfo)
            wx.showToast({ title: '登录成功', icon: 'none' })
            wx.navigateBack()
            this.closeDialog()
          } else {
            this.setData({ code: obj.code, sign, isGetPopupShow: true })
          }
        }
      },
      fail: () => {
        wx.showToast({ title: '您已拒绝授权', icon: 'none' })
      }
    })
  },
  // 手机号授权登录
  async getPhoneNumber(e) {
    console.log(e)
    // 拒绝授权则跳转至手机号码验证登录
    if (!e.detail.code) {
      wx.navigateTo({ url: '/pages/usercenter/login-verify/index' })
      this.handlePopupHide()
      return
    }
    const { code, data } = await handleWxapplogin({ code: e.detail.code, sign: this.data.sign })
    if (code === 1 && data) {
      console.log(data)
      const { userinfo, token } = data
      wx.setStorageSync('storage_token', token)
      wx.setStorageSync('storage_userInfo', userinfo)
      wx.navigateBack()
    }
  },
  // 登录
  doLogin() {
    const type = this.data.btnType
    switch (type) {
      case 0:
        this.handleUserWxapplogin()
        break
      case 1:
        this.setData({ isAgree: true })
        wx.navigateTo({ url: '/pages/usercenter/login-input/index' })
        this.closeDialog()
        break
      default:
        this.setData({ isAgree: true })
        wx.navigateTo({ url: '/pages/usercenter/login-verify/index' })
        this.closeDialog()
    }
  },
  // 打开同意协议弹框
  showDialog() {
    const { dialogKey } = this.data
    this.setData({ [dialogKey]: true })
  },
  // 关闭同意协议弹框
  closeDialog() {
    const { dialogKey } = this.data
    this.setData({ [dialogKey]: false })
  },
  // 关闭手机号授权弹框
  handlePopupHide() {
    this.setData({ isGetPopupShow: false })
  }
})
