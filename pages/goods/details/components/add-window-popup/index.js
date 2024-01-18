import { getMyDouYinList } from '../../../../../services/usercenter/login'
import { handleAddShowCase } from '../../../../../services/good/good'
Component({
  options: {
    multipleSlots: true
  },

  properties: {
    title: {
      type: String,
      value: '领取要求说明'
    },
    show: {
      type: Boolean,
      observer(show) {
        if (show) {
          wx.setPageStyle({ style: { overflow: 'hidden' } })
        } else {
          wx.setPageStyle({ style: { overflow: 'auto' } })
        }
      }
    },
    params: {
      type: Object
    }
  },
  data: {
    douyinList: [],
    dou_user_id: '',
    selectedList: []
  },
  created() {
    this.getMyDouYinList()
  },
  methods: {
    closeAddPopup() {
      this.triggerEvent('closeAddPopup', {
        show: false
      })
    },
    onChange(event) {
      this.setData({ selectedList: event.detail.value })
      const { selectedList, douyinList } = this.data
      const dou_user_id = douyinList
        .filter((v) => selectedList.includes(v.nickname))
        .map((v) => v.id)
        .join(',')
      this.setData({ dou_user_id })
    },
    handleToAdd() {
      wx.navigateTo({ url: '/pages/usercenter/account/index' })
    },
    async getMyDouYinList() {
      const token = wx.getStorageSync('storage_token')
      const { code, data } = await getMyDouYinList({ token, page: 1, num: 100 })
      if (code === 1) {
        this.setData({
          douyinList: data.data.map((v) => ({ ...v, disabled: v.auth_expire === 0 }))
        })
      }
    },
    // 添加至橱窗
    async handleAddToShowCase() {
      const { params, dou_user_id } = this.data
      const token = wx.getStorageSync('storage_token')
      const { code } = await handleAddShowCase({ token, ...params, dou_user_id })
      if (code === 1) {
        wx.showToast({ title: '添加成功', icon: 'none' })
        this.closeAddPopup()
      }
    }
  }
})
