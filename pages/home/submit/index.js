import { jsonSort } from '../../../config/http'
import { handleGgetAddConfig, handleAddWork } from '../../../services/home/home'
Page({
  data: {
    loading: false,
    resultTab: 0,
    evaluateType: [],
    releaseResults: [],
    fileList: [],
    time: 0,
    gridConfig: {
      column: 4,
      width: 160,
      height: 160
    },
    config: {
      count: 5
    },
    params: {
      result_type: ''
    }
  },
  onLoad(e) {
    console.log(e)
    const { id, time } = e
    this.setData({ ['params.receive_id']: id, time: Number(time) })
    this.handleGgetAddConfig()
  },
  // 发布结果
  handleTab(e) {
    const { params } = this.data
    const { index, item } = e.currentTarget.dataset
    params.result_type = item.value
    this.setData({ resultTab: index, params })
  },
  // textarea
  handleChange(e) {
    const { value } = e.detail
    const { params } = this.data
    const { type } = e.currentTarget.dataset
    switch (type) {
      case 0:
        params.video_url = value
        this.setData({ params })
        break
      case 1:
        params.advisement = value
        this.setData({ params })
        break
      default:
    }
  },
  // 选择视频评价
  handleSelected(e) {
    const { item, index } = e.currentTarget.dataset
    const { evaluateType } = this.data
    evaluateType[index].selected = !item.selected
    this.setData({ evaluateType })
  },
  // 获取添加页面选项
  async handleGgetAddConfig() {
    const token = wx.getStorageSync('storage_token')
    const { code, data } = await handleGgetAddConfig({ token })
    if (code === 1) {
      const { params } = this.data
      params.result_type = data.resultType[0].value
      this.setData({
        releaseResults: data.resultType,
        evaluateType: data.evaluateType.map((v) => ({ selected: false, text: v }))
      })
    }
  },
  // 添加截图
  async handleAdd(e) {
    const { files } = e.detail
    files.forEach((file) => this.onUpload(file))
  },
  // 上传截图
  onUpload(file) {
    const token = wx.getStorageSync('storage_token')
    const baseUrl = getApp().siteInfo.siteroot
    const data = jsonSort({ token })
    const { fileList } = this.data
    this.setData({
      fileList: [...fileList, { ...file, status: 'loading' }]
    })
    console.log(this.data.fileList)
    const { length } = fileList
    const task = wx.uploadFile({
      url: `${baseUrl}common/upload`,
      filePath: file.url,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        accept: 'application/json',
        'x-time': data['x-time'],
        'x-token': data['x-token']
      },
      formData: { token },
      success: (result) => {
        const res = JSON.parse(result.data)
        const { code, data, msg } = res
        if (code === 1) {
          wx.showToast({ title: msg, icon: 'none' })
          this.setData({
            [`fileList[${length}].url`]: data.fullurl,
            [`fileList[${length}].video_image`]: data.url
          })
        }
        this.setData({
          [`fileList[${length}].status`]: 'done'
        })
      }
    })
    task.onProgressUpdate((res) => {
      this.setData({
        [`fileList[${length}].percent`]: res.progress
      })
    })
  },
  // 删除
  handleRemove(e) {
    const { index } = e.detail
    const { fileList } = this.data
    fileList.splice(index, 1)
    this.setData({ fileList })
  },
  // 提交
  async handleSubmit() {
    const { params, fileList, evaluateType } = this.data
    const { video_url } = params
    const evaluateArr = evaluateType.filter((v) => v.selected)
    const canSubmit = fileList.filter((v) => v.status === 'loading').length === 0

    if (!canSubmit) return wx.showToast({ title: '正在上传截图，请稍后', icon: 'none' })
    if (!video_url) return wx.showToast({ title: '请填写视频链接', icon: 'none' })
    if (!evaluateArr.length) return wx.showToast({ title: '请选择视频评价', icon: 'none' })
    this.setData({ loading: true })

    const evaluate_type = evaluateArr.map((v) => v.text).join(',')
    const video_image = fileList
      .filter((v) => v.video_image)
      .map((v) => v.video_image)
      .join(',')
    const token = wx.getStorageSync('storage_token')
    const { code } = await handleAddWork({ ...params, video_image, evaluate_type, token })
    if (code === 1) {
      wx.showToast({ title: '提交成功', icon: 'none' })
      const timer = setTimeout(() => {
        wx.navigateBack()
        clearTimeout(timer)
      }, 200)
    }
    this.setData({ loading: false })
  }
})
