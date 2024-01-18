Page({
  data: {
    video_url: ''
  },
  onLoad(e) {
    console.log(e)
    const { video_url } = e
    this.setData({ video_url })
  }
})
