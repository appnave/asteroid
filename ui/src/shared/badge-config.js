export const baseProps = {
  color: {
    type: String,
    default: 'light-blue-2'
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
  }
}
