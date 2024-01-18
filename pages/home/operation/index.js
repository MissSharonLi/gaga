import { handleGetReceiveStatus, handleGetReceiveList } from '../../../services/home/home'
Page({
  data: {
    tabNum: 0,
    tabList: [],
    loadStatus: 0, //加载状态
    params: {
      page: 1,
      status: ''
    },
    operationList: []
  },
  // 上拉加载更多
  onReachBottom() {
    if (this.data.loadStatus === 0 || this.data.loadStatus === 2) this.loadReceiveList()
  },
  // 下拉重置加载
  async onPullDownRefresh() {
    wx.startPullDownRefresh()
    await this.init()
    wx.stopPullDownRefresh()
  },
  // 提交作业
  handlToSubmit(e) {
    const { submit_left_time, id } = e.currentTarget.dataset.item
    wx.navigateTo({ url: `/pages/home/submit/index?id=${id}&time=${submit_left_time}` })
  },
  onShow() {
    this.init()
    this.handleGetReceiveStatus()
  },
  handleShiftTab(e) {
    const { num, status } = e.currentTarget.dataset
    const { params } = this.data
    params.status = status
    this.setData({ tabNum: num, params: params })
    this.loadReceiveList(true)
  },
  // 获取作业状态
  async handleGetReceiveStatus() {
    const token = wx.getStorageSync('storage_token')
    const { code, data } = await handleGetReceiveStatus({ token })
    if (code === 1) this.setData({ tabList: data })
  },
  // 网络请求失败时重试
  onReTry() {
    this.loadReceiveList()
  },
  // 初始化
  init() {
    this.loadReceiveList(true)
  },
  // 获取抖音列表
  async loadReceiveList(fresh = false) {
    this.setData({ loadStatus: 1 }) // 加载中
    if (fresh) wx.pageScrollTo({ scrollTop: 0 }) // 是否重置刷新
    fresh ? (this.data.params.page = 1) : this.data.params.page++
    this.setData({ params: this.data.params })
    const token = wx.getStorageSync('storage_token')

    const { code, data } = await handleGetReceiveList({ token, ...this.data.params })
    if (code === 1) {
      if (data.data.length > 0) {
        this.setData({ loadStatus: 0 }) // 返回10条=>上拉加载更多
        this.setData({
          operationList: fresh ? data.data : this.data.operationList.concat(data.data)
        })
      } else {
        if (this.data.params.page > 1) {
          this.data.params.page--
          this.setData({ params: this.data.params })
          wx.showToast({ title: '没有更多数据了', icon: 'none' })
        } else {
          this.setData({ operationList: [] })
          wx.showToast({ title: '暂无数据', icon: 'none' })
        }
        this.setData({ loadStatus: 2 })
      }
    } else {
      this.setData({ loadStatus: 3 })
    }
  }
})
