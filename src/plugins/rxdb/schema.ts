const videoSchema = {
  version: 0,
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    type: {
      type: 'string'
    },
    time: {
      type: 'string'
    },
    detail: {
      type: 'string',
      primary: true
    },
    urls: {
      type: 'array'
    },
    index: {
      type: 'number'
    }
  }
}

const settingSchema = {
  version: 0,
  type: 'object',
  properties: {
    theme: {
      type: 'string',
      default: 'light'
    }
  }
}

export {
  videoSchema,
  settingSchema
}
