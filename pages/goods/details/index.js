import { getGoodsDetail, getNewerGuide } from '../../../services/good/good'
import download from '../../../utils/download'
import Toast, { hideToast } from 'tdesign-miniprogram/toast/index'

Page({
  data: {
    idx: 0,
    id: 0, // 当前商品ID
    play: true, // 是否播放
    muted: true, // 是否静音
    curImgUrls: [], // 当前查看数组
    imgVisible: false, // 是否查看图片
    initialIndex: 0,
    isAddPopupShow: false, // 是否添加至橱窗popup
    isGetPopupShow: false, // 是否展示领取要求popup
    isVideoPopupShow: false, // 是否展示视频popup
    isGuildPopupShow: false, // 是否展示新手指引popup
    isAddWxPopupShow: false, // 是否展示专属选品官popup
    allSelectedMb: 0, // 所有可选取总数
    allSelectedNum: 0, // 已选取总数
    current: 0, // 图片切换index
    swiperIndex: 0, // 视频标题
    swiperIndex1: 0,
    autoplay: true, // 自动播放
    duration: 500, // swiper滑动时间
    videoPoster: '', // 视频查看默认海报
    videoSrc: '', // 视频查看视频链接
    returnObj: {}, // 详情返回对象
    loadingTheme: 'loading', // 加载主题
    helpVideo: '', //新手帮助
    noticeContent: [], // 领取详情数组
    tabPanelstyle: 'display:flex;justify-content:center;align-items:center;', // 详情tab组件样式
    stepArray: ['下载视频添加商品到橱窗', '发布视频', '在嘎嘎小程序提交作业'], // 步骤数组
    tabValue: 1, // 默认展示分镜素材
    tabList: [], // 详情tab数组
    storyTabList: [], // 分镜素材数组
    imagesList: [], // 图片素材数组
    videoTextList: [], // 视频脚本数组
    addWindowParams: {
      //添加至橱窗入参
      goods_id: '',
      goods_content_ids: '',
      dou_user_id: ''
    }
  },
  // 页面加载后
  onLoad(e) {
    this.setData({ id: e.id }) // 接收当前商品ID
    this.getGoodsDetail()
    this.getNewerGuide()
    this.handleShowGuild()
  },
  // 是否显示新手指引
  handleShowGuild() {
    const isNew = wx.getStorageSync('storage_new')
    if (!isNew) this.setData({ isGuildPopupShow: true })
  },
  doNext(e) {
    const { current } = e.detail
    switch (current) {
      case 1:
        wx.pageScrollTo({ duration: 300, selector: '#moveThis' })
        break
    }
  },
  // 复制
  handleCopy(e) {
    const { data } = e.currentTarget.dataset
    wx.setClipboardData({
      data: data,
      success() {
        wx.showToast({ title: '复制成功', icon: 'none' })
      }
    })
  },
  onChange(e) {
    const { index } = e.currentTarget.dataset
    if (index === 0) {
      this.setData({
        swiperIndex: e.detail.current
      })
    } else {
      this.setData({
        swiperIndex1: e.detail.current
      })
    }
  },
  // 获取新手帮助
  async getNewerGuide() {
    const { code, data } = await getNewerGuide()
    if (code === 1) this.setData({ helpVideo: data.video_url })
  },
  // 获取商品详情
  async getGoodsDetail() {
    const tab1 = [{ title: '作业流程', title_key: 0 }]
    const { code, data } = await getGoodsDetail({ id: this.data.id })
    if (code === 1) {
      const videoArr = data.contentChildren.filter((v) => v.title_key === 'video')
      const imagesArr = data.contentChildren.filter((v) => v.title_key === 'image')
      const videoTxtArr = data.contentChildren.filter((v) => v.title_key === 'video_text')
      if (videoArr.length)
        videoArr[0].children.forEach((v) => v.children.forEach((e) => (e.selected = false)))
      if (imagesArr.length)
        imagesArr[0].children.forEach((v) => v.children.forEach((e) => (e.selected = false)))
      if (videoTxtArr.length)
        videoTxtArr[0].children.forEach((v) => v.children.forEach((e) => (e.selected = false)))

      this.setData({
        returnObj: {
          ...data,
          image_arr: [data.image],
          public_commission: parseInt(data.public_commission),
          commission: parseInt(data.commission)
        },
        noticeContent: data.dou_user_logs,
        tabList: tab1.concat(data.content_cat_ids_arr),
        storyTabList: videoArr.length ? videoArr[0].children : [],
        imagesList: imagesArr.length ? imagesArr[0].children : [],
        videoTextList: videoTxtArr.length ? videoTxtArr[0].children : []
      })
    }
  },
  // 下载文件至手机
  handleDownloadSave() {
    // 当前选择的分镜素材
    const urls = this.data.storyTabList[0].children
      .filter((v) => v.selected)
      .map((v) => v.video_url)
    // 当前选择的图片素材
    const imgUrls = this.data.imagesList[0].children
      .filter((v) => v.selected)
      .map((v) => v.thumb_url)

    if (!urls.length && !imgUrls.length)
      return wx.showToast({ title: '请先选择分镜素材', icon: 'none' })
    // 总共选择的分镜素材
    const allUrls = urls.concat(imgUrls)
    // 判断否有保存权限
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              this.handleSaveFile(allUrls)
            },
            fail: () => {
              wx.showModal({
                title: `获取【添加到相册】失败`,
                content: `获取【添加到相册】失败，请在【右上角】-小程序【设置】项中，将【添加到相册】开启。`,
                confirmText: '去设置',
                confirmColor: '#FA550F',
                cancelColor: '取消',
                success: (res) => {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (settinRes) => {
                        if (settinRes.authSetting['scope.writePhotosAlbum']) {
                          this.handleSaveFile(allUrls)
                        } else {
                          wx.showToast({ title: '未打开【添加到相册】权限', icon: 'none' })
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
          this.handleSaveFile(allUrls)
        }
      }
    })
  },
  // 下载素材保存至相册
  handleSaveFile(urls) {
    const that = this
    Toast({
      context: this,
      selector: '#t-toast',
      direction: 'column',
      duration: 'none',
      theme: this.data.loadingTheme,
      preventScrollThrough: true
    })
    download.downloadSaveFiles({
      urls: urls,
      compelete: (idx) => {
        console.log(idx)
        that.setData({ idx })
      },
      success: () => {
        const timer = setTimeout(() => {
          that.setData({ loadingTheme: 'success' })
          clearTimeout(timer)
        }, 100)
        const timer1 = setTimeout(() => {
          hideToast({
            context: this,
            selector: '#t-toast'
          })
          clearTimeout(timer1)
        }, 500)
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  // 选择下载分镜
  handleSelected(e) {
    const { type, item, index, idx } = e.currentTarget.dataset
    switch (type) {
      case 0: // 点击选择分镜素材
        {
          const storyTabList = JSON.parse(JSON.stringify(this.data.storyTabList))
          const imagesList = JSON.parse(JSON.stringify(this.data.imagesList))
          storyTabList[index].children[idx].selected = !item.selected
          this.setData({ storyTabList })
          const selectedAll = storyTabList
            .map((v) => v.children)
            .flat()
            .filter((v) => v.selected)
            .concat(
              imagesList
                .map((v) => v.children)
                .flat()
                .filter((v) => v.selected)
            )
          const allSelectedNum = selectedAll.length
          const allSelectedMb = selectedAll
            .map((v) => v.file_size)
            .reduce((arr, cur) => arr + cur, 0)
            .toFixed(1)
          this.setData({ allSelectedMb, allSelectedNum })
        }
        break
      case 1: // 点击选择图片素材
        {
          const imagesList = JSON.parse(JSON.stringify(this.data.imagesList))
          const storyTabList = JSON.parse(JSON.stringify(this.data.storyTabList))
          imagesList[index].children[idx].selected = !item.selected
          this.setData({ imagesList })
          const selectedAll = storyTabList
            .map((v) => v.children)
            .flat()
            .filter((v) => v.selected)
            .concat(
              imagesList
                .map((v) => v.children)
                .flat()
                .filter((v) => v.selected)
            )
          const allSelectedNum = selectedAll.length
          const allSelectedMb = selectedAll
            .map((v) => v.file_size)
            .reduce((arr, cur) => arr + cur, 0)
            .toFixed(1)
          this.setData({ allSelectedNum, allSelectedMb })
        }
        break
      case 2: {
        const images = this.data.imagesList.map((v) => v.children).flat()
        const initialIndex = images.findIndex((v) => v.thumb_url === item.thumb_url)
        this.setData({
          initialIndex: initialIndex,
          imgVisible: true,
          curImgUrls: images.map((v) => v.thumb_url)
        })
      }
      default: {
        // this.setData({ imgVisible: false })
      }
    }
  },
  onClose() {
    this.setData({ imgVisible: false })
  },
  // 点击切换详情tab
  handleChange(e) {
    this.setData({ tabValue: e.detail.value })
  },
  // 点击切换图片swiper
  bindchange(e) {
    const { current } = e.detail
    this.setData({ current: current })
    if (current > 0) {
      this.videoContext = wx.createVideoContext('myVideo')
      this.videoContext.stop()
      this.setData({ play: false })
    } else {
      this.videoContext.play()
      this.setData({ play: true })
    }
  },
  // 点击播放/暂停
  handlePlay() {
    if (this.data.play) {
      this.videoContext = wx.createVideoContext('myVideo')
      this.videoContext.pause()
      this.setData({ play: false })
    } else {
      this.videoContext.play()
      this.setData({ play: true })
    }
  },
  // 点击放大视频播放
  handleToScreen(e) {
    const { type, url } = e.currentTarget.dataset
    switch (type) {
      case 0:
        wx.navigateTo({ url: `/pages/goods/video/index?video_url=${url}` })
        break
      default:
        wx.navigateTo({ url: `/pages/goods/video/index?video_url=${this.data.helpVideo}` })
    }
  },
  // 点击关闭/打开静音
  handleMuted() {
    this.setData({ muted: !this.data.muted })
  },
  // 点击切换范本视频/商品图
  handleShift(e) {
    const { num } = e.currentTarget.dataset
    this.setData({ current: num })
  },
  // 关闭弹框
  handlePopupHide(e) {
    const { type } = e.currentTarget.dataset
    switch (type) {
      case 0:
        this.setData({
          isVideoPopupShow: false
        })
        break
      case 1:
        this.setData({
          isGetPopupShow: false
        })
        break
      case 3:
        this.setData({ isGuildPopupShow: false })
        break
      case 4:
        this.setData({ isAddWxPopupShow: false })
        break
      default:
        this.setData({
          isAddPopupShow: false
        })
    }
  },
  // 显示弹框
  handleShowPopup(e) {
    const { type } = e.currentTarget.dataset
    switch (type) {
      case 0:
        {
          const { thumb_url, video_url } = e.currentTarget.dataset.item
          this.setData({
            isVideoPopupShow: true,
            videoPoster: thumb_url,
            videoSrc: video_url
          })
        }
        break
      case 1:
        this.setData({ isGetPopupShow: true })
        break
      case 3:
        this.setData({ isAddWxPopupShow: true })
        break
      default: {
        // 当前选择的分镜素材
        const ids = this.data.storyTabList[0].children.filter((v) => v.selected).map((v) => v.id)
        // 当前选择的图片素材
        const imgIds = this.data.imagesList[0].children.filter((v) => v.selected).map((v) => v.id)
        const goods_content_ids = ids.concat(imgIds).join(',')
        const { addWindowParams } = this.data
        addWindowParams.goods_content_ids = goods_content_ids
        addWindowParams.goods_id = this.data.returnObj.id
        this.setData({ isAddPopupShow: true, addWindowParams })
      }
    }
  }
})
