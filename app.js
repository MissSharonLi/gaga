import updateManager from './common/updateManager'

App({
  globalData: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight
  },
  siteInfo: {
    siteroot: 'https://gaga.yiyunrj.com/api/'
  },
  onLaunch: function () {},
  onShow: function () {
    updateManager()
  }
})
