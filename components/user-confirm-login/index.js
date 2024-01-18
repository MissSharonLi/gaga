Component({
  properties: {
    title: {
      type: String,
      value: '',
      observer(title) {
        this.setData({
          title
        })
      }
    },
    content: {
      type: String,
      value: '',
      observer(content) {
        this.setData({
          content
        })
      }
    },
    showDialog: {
      type: Boolean,
      value: false
    }
  },
  observers: {
    showDialog(data) {
      console.log(data)
    }
  },
  data: {
    dialogKey: '',
    confirmBtn: { content: '确定', variant: 'base' }
  },
  methods: {
    showDialog(e) {
      const { key } = e.currentTarget.dataset
      this.setData({ [key]: true, dialogKey: key })
    },
    closeDialog() {
      const { dialogKey } = this.data
      this.setData({ [dialogKey]: false })
      this.triggerEvent('closeDialog', {
        dialogKey: '李四'
      })
    }
  }
})
