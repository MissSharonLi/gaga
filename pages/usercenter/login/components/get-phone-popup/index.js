Component({
  options: {
    multipleSlots: true
  },

  properties: {
    title: {
      type: String,
      value: ''
    },
    show: {
      type: Boolean
    }
  },
  data: {
    overflayProps: { style: 'z-index:11501' }
  },

  methods: {
    closePhonePopup() {
      this.triggerEvent('closePhonePopup', { show: false })
    },

    getPhoneNumber(e) {
      const { detail } = e
      this.triggerEvent('getPhoneNumber', detail)
    }
  }
})
