Component({
  externalClasses: ['wr-class'],

  properties: {
    goodsList: {
      type: Array,
      value: []
    }
  },

  methods: {
    onClickGoods(e) {
      const { index } = e.currentTarget.dataset
      this.triggerEvent('click', { ...e.detail, index })
    },

    onClickGoodsThumb(e) {
      const { index } = e.currentTarget.dataset
      this.triggerEvent('thumb', { ...e.detail, index })
    }
  }
})
