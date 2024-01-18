import { getUserInfo, handleLoginOut } from '../../services/usercenter/login'
import { phoneEncryption } from '../../utils/util'

Page({
  data: {
    isLogin: false,
    userInfo: {},
    confirmBtn: { content: '确定', variant: 'base' },
    dialogKey: '',
    showConfirm: false,
    showWarnConfirm: false
  },
  onLoad() {
    this.init()
  },
  onShow() {
    this.getTabBar().init()
    if (!this.data.isLogin) this.init()
  },
  // 下拉刷新
  async onPullDownRefresh() {
    wx.startPullDownRefresh()
    await this.init()
    wx.stopPullDownRefresh()
  },
  // 初始化
  init() {
    this.runApiToGetUserInfo()
  },
  // 获取个人信息
  async runApiToGetUserInfo() {
    try {
      const token = wx.getStorageSync('storage_token')
      const { code, data } = await getUserInfo({ token: token })
      if (code === 1 && data) {
        this.setData({ userInfo: { ...data, mobile: phoneEncryption(data.mobile) } })
        wx.setStorageSync('storage_userInfo', JSON.stringify(data))
        this.setData({ isLogin: true })
      } else {
        this.setData({ isLogin: false })
      }
    } catch {}
  },
  // 显示退出登录弹框
  showDialog(e) {
    const { key } = e.currentTarget.dataset
    this.setData({ [key]: true, dialogKey: key })
  },
  // 关闭退出登录弹框
  closeDialog() {
    const { dialogKey } = this.data
    this.setData({ [dialogKey]: false })
  },
  // 退出登录
  async handleExitLogin() {
    const token = wx.getStorageSync('storage_token')
    const { code } = await handleLoginOut({ token })
    if (code === 1) {
      wx.showToast({ title: '退出成功', icon: 'none' })
      wx.clearStorage()
      this.closeDialog()
      this.init()
    }
  },
  // 点击操作
  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset
    switch (type) {
      case 'login': {
        if (!this.data.isLogin) wx.navigateTo({ url: '/pages/usercenter/login/index' })
        break
      }
      default: {
        if (Object.keys(this.data.userInfo).length) {
          wx.navigateTo({ url: '/pages/usercenter/account/index' })
        } else {
          wx.navigateTo({ url: '/pages/usercenter/login/index' })
        }
      }
    }
  }
})
