import { statusBarHeight } from '../../utils/util'
import {
  handleGetBannerList,
  handleGetGoodsCat,
  handleGetGoodsList
} from '../../services/home/home'

Page({
  data: {
    barHeight: statusBarHeight,
    bannerList: [],
    tabList: [],
    goodsList: [],
    loadStatus: 0, //加载状态
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: { type: 'dots' },
    swiperImageProps: { mode: 'scaleToFill' },
    goodsParams: {
      page: 1,
      category_id: -1,
      keywords: ''
    },
    noticeContent: [
      '不知道怎么领视频？点我快速了解',
      '领取视频后，请在24小时内提交作业',
      '点击关注嘎嘎公众号，实时接收视频上新消息'
    ]
  },
  // 商品列表请求参数
  goodsParams: {
    page: 1,
    category_id: -1,
    keywords: ''
  },
  onShow() {
    this.getTabBar().init()
  },
  onLoad() {
    this.getBannerList()
    this.handleGetGoodsCat()
    this.loadGoodsList(true)
  },
  // 上拉加载更多
  onReachBottom() {
    if (this.data.loadStatus === 0 || this.data.loadStatus === 2) this.loadGoodsList()
  },
  // 下拉重置加载
  async onPullDownRefresh() {
    wx.startPullDownRefresh()
    await this.init()
    wx.stopPullDownRefresh()
  },
  // 获取首页Banner
  async getBannerList() {
    const { code, data } = await handleGetBannerList()
    if (code === 1) {
      const swiper = data.map((i) => i.image)
      this.setData({ bannerList: swiper })
    }
  },
  // 获取商品分类
  async handleGetGoodsCat() {
    const { code, data } = await handleGetGoodsCat()
    if (code === 1) this.setData({ tabList: data.sort((a, b) => a.id - b.id) })
  },
  // 获取商品列表
  async loadGoodsList(fresh = false) {
    this.setData({ loadStatus: 1 }) // 加载中
    if (fresh) wx.pageScrollTo({ scrollTop: 0 }) // 是否重置刷新
    fresh ? (this.data.goodsParams.page = 1) : this.data.goodsParams.page++
    this.setData({ goodsParams: this.data.goodsParams })

    const { code, data } = await handleGetGoodsList(this.data.goodsParams)
    if (code === 1) {
      if (data.data.length > 1) {
        this.setData({ loadStatus: 0 }) // 返回10条=>上拉加载更多
        this.setData({ goodsList: fresh ? data.data : this.data.goodsList.concat(data.data) })
      } else {
        if (this.data.goodsParams.page > 0) {
          this.data.goodsParams.page--
          this.setData({ goodsParams: this.data.goodsParams })
          wx.showToast({ title: '没有更多数据了', icon: 'none' })
        } else {
          this.setData({ goodsList: [] })
          wx.showToast({ title: '暂无数据', icon: 'none' })
        }
        this.setData({ loadStatus: 2 })
      }
    } else {
      this.setData({ loadStatus: 3 })
    }
  },
  // 初始化数据
  init() {
    this.loadHomePage()
  },
  // 加载首页数据
  loadHomePage() {
    this.loadGoodsList(true)
  },

  tabChangeHandle(e) {
    this.data.goodsParams.category_id = e.detail.value
    this.setData({ goodsParams: this.data.goodsParams })
    this.loadGoodsList(true)
  },
  // 网络请求失败时重试
  onReTry() {
    this.loadGoodsList()
  },
  // 跳转至商品详情
  goodListClickHandle(e) {
    const { index } = e.detail
    const { id } = this.data.goodsList[index]
    wx.navigateTo({
      url: `/pages/goods/details/index?id=${id}`
    })
  },
  // 搜索
  handleSearch() {
    this.loadGoodsList(true)
  },
  changeHandle(e) {
    const { value } = e.detail
    this.data.goodsParams.keywords = value
    this.setData({ goodsParams: this.data.goodsParams })
  },
  // banner跳转至活动页面
  handleToOperation() {
    const token = wx.getStorageSync('storage_token')
    if (!token) {
      wx.navigateTo({
        url: `/pages/usercenter/login/index`
      })
    } else {
      wx.navigateTo({
        url: `/pages/home/operation/index`
      })
    }
  }
})
