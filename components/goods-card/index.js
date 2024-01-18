Component({
  properties: {
    data: {
      type: Object,
      observer(data) {
        if (!data) {
          return
        }
        this.setData({ goods: data })
      }
    }
  },

  data: {
    goods: { id: '' }
  },
  methods: {
    clickHandle() {
      this.triggerEvent('click', { goods: this.data.goods })
    },

    clickThumbHandle() {
      this.triggerEvent('thumb', { goods: this.data.goods })
    }
  }
})
