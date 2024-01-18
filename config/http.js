import { md5 } from 'js-md5'
const commonUtils = {
  filterData: (obj) => {
    // eslint-disable-next-line eqeqeq, no-param-reassign
    Object.keys(obj).forEach((k) => obj[k] == null && delete obj[k])
    return obj
  },
  jsonSort: (jsonObj = {}) => {
    let xtoken = ''
    const timestamp = Date.parse(new Date())
    const xtime = timestamp / 1000
    // eslint-disable-next-line no-param-reassign
    jsonObj['x-time'] = xtime
    const arr = []
    var json = {}
    for (const key in commonUtils.filterData(jsonObj)) {
      arr.push(key)
    }
    arr.sort()
    for (const i in arr) {
      xtoken += `${md5(jsonObj[arr[i]].toString())}gaga`
      json[arr[i]] = jsonObj[arr[i]]
    }
    xtoken = md5(`gg_${xtoken}_aa`)
    delete json['x-time']
    const myJson = JSON.parse(JSON.stringify(json))
    return { 'x-time': xtime, 'x-token': xtoken, data: myJson }
  },
  request: (url, data, loading = false) => {
    return new Promise((reslove, reject) => {
      if (loading) wx.showLoading({ title: '', mask: true })
      // eslint-disable-next-line no-param-reassign
      data = commonUtils.jsonSort(data)
      const baseInfo = getApp().siteInfo
      wx.request({
        url: baseInfo.siteroot + url,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'x-time': data['x-time'],
          'x-token': data['x-token']
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        data: data.data,
        success: (res) => {
          const { code, msg } = res.data
          if (code === 1) {
            reslove(res.data)
          } else if (code === 401) {
            reslove(res.data)
            wx.showToast({ title: msg, icon: 'none' })
            const pages = getCurrentPages()
            const currentPage = pages[pages.length - 1]
            const url = `/${currentPage.route}`
            // 登录失效
            wx.clearStorage()
            if (url === '/pages/usercenter/index') return
            wx.navigateTo({ url: '/pages/usercenter/login/index' })
          } else {
            reslove(res.data)
            if (msg === 'success') return
            wx.showToast({ title: msg, icon: 'none' })
          }
        },
        fail: (err) => {
          console.log(err)
          reject(err)
          wx.showModal({
            title: '提示',
            content: '网络请求失败'
          })
        },
        complete: () => {
          if (loading) wx.hideLoading()
        }
      })
    }).catch((err) => {
      console.log(err)
    })
  }
}

module.exports = { ...commonUtils, POST: commonUtils.request }
