import { getMyDouYinList } from '../../../services/usercenter/login'
Page({
  data: {
    douyinList: [],
    loadStatus: 0, //加载状态
    isScanPopupShow: false,
    params: {
      page: 1
    }
  },
  onLoad() {
    this.init()
  },
  // 上拉加载更多
  onReachBottom() {
    if (this.data.loadStatus === 0 || this.data.loadStatus === 2) this.loadDouyinList()
  },
  // 下拉重置加载
  async onPullDownRefresh() {
    wx.startPullDownRefresh()
    await this.init()
    wx.stopPullDownRefresh()
  },
  // 网络请求失败时重试
  onReTry() {
    this.loadDouyinList()
  },
  // 初始化
  init() {
    this.loadDouyinList(true)
  },
  // 获取抖音列表
  async loadDouyinList(fresh = false) {
    this.setData({ loadStatus: 1 }) // 加载中
    if (fresh) wx.pageScrollTo({ scrollTop: 0 }) // 是否重置刷新
    fresh ? (this.data.params.page = 1) : this.data.params.page++
    this.setData({ params: this.data.params })
    const token = wx.getStorageSync('storage_token')

    const { code, data } = await getMyDouYinList({ token, ...this.data.params })
    if (code === 1) {
      if (data.data.length > 0) {
        this.setData({ loadStatus: 0 }) // 返回10条=>上拉加载更多
        this.setData({ douyinList: fresh ? data.data : this.data.douyinList.concat(data.data) })
      } else {
        if (this.data.params.page > 1) {
          this.data.params.page--
          this.setData({ params: this.data.params })
          wx.showToast({ title: '没有更多数据了', icon: 'none' })
        } else {
          this.setData({ douyinList: [] })
          wx.showToast({ title: '暂无数据', icon: 'none' })
        }
        this.setData({ loadStatus: 2 })
      }
    } else {
      this.setData({ loadStatus: 3 })
    }
  },
  // 显示刷新授权弹框
  handleShowPopup() {
    this.setData({ isScanPopupShow: true })
  },
  // 关闭刷新授权弹框
  handlePopupHide() {
    this.setData({ isScanPopupShow: false })
  }
})
