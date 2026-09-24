export const baseProps = {
  color: {
    type: String,
    default: 'light-blue-2'
  },

  icon: {
    type: String,
    default: ''
  },

  label: {
    type: String,
    default: ''
  },

  multiLine: {
    type: Boolean
  },

  textColor: {
    type: String,
    default: 'black'
  },

  removable: {
    type: Boolean
  },

  tabindex: {
    type: [String, Number],
    default: undefined
  },

  useSubtle: {
    type: Boolean
  }
}
