#!/usr/bin/env node

import { argv } from 'node:process'
import { parseArgs } from 'node:util'

const { values } = parseArgs({
  args: argv.slice(2),
  options: {
    build: {
      type: 'boolean',
    },
    publish: {
      type: 'boolean',
    },
  },
})

if (values.build) {
  void import('./build')
} else if (values.publish) {
  void import('./publish')
} else {
  console.log('Please specify a command: build or publish')
}
