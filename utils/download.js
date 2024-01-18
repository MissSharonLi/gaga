/**
 * 下载保存一个文件
 */
function downloadSaveFile(obj) {
  const { success } = obj
  const { fail } = obj
  let id = ''
  const { url } = obj
  if (obj.id) {
    id = obj.id
  } else {
    id = url
  }

  wx.downloadFile({
    url: obj.url,
    success: function (res) {
      //保存到相册
      wx.saveVideoToPhotosAlbum({
        filePath: res.tempFilePath,
        success: (result) => {
          result.id = id
          if (success) {
            success(result)
          }
        },
        fail: (e) => {
          console.info('保存一个文件失败')
          if (fail) {
            fail(e)
          }
        }
      })
    },
    fail: function (e) {
      console.info('下载一个文件失败')
      if (fail) {
        fail(e)
      }
    }
  })
}
/**
 * 多文件下载并且保存，强制规定，必须所有文件下载成功才算返回成功
 */
function downloadSaveFiles(obj) {
  console.log(obj)
  const { success, compelete } = obj //下载成功
  const { fail } = obj //下载失败
  const { urls } = obj //下载地址 数组，支持多个 url下载 [url1,url2]
  const savedFilePaths = new Map()
  const urlsLength = urls.length // 有几个url需要下载
  for (let i = 0; i < urlsLength; i++) {
    downloadSaveFile({
      url: urls[i],
      success: function (res) {
        //一个文件下载保存成功
        savedFilePaths.set(res.id + Math.random(), res)
        compelete(savedFilePaths.size)
        if (savedFilePaths.size === urlsLength) {
          //如果所有的url 才算成功
          if (success) {
            success(savedFilePaths)
          }
        }
      },
      fail: function (e) {
        console.info('下载失败')
        if (fail) {
          fail(e)
        }
      }
    })
  }
}
module.exports = {
  downloadSaveFiles: downloadSaveFiles
}
