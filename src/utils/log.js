const chalk = require('chalk')
const log = require('loglevel')
const prefix = require('loglevel-plugin-prefix')

const env = process.env.ENV || 'dev'

const colors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
}

prefix.reg(log)

prefix.apply(log, {
  format(level, name, timestamp) {
    return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](
      level
    )} ${chalk.green(`${name}:`)}`
  },
})

prefix.apply(log.getLogger('critical'), {
  format(level, name, timestamp) {
    return chalk.red.bold(`[${timestamp}] ${level} ${name}:`)
  },
})

if (env === 'prod') {
  log.setLevel('info')
} else {
  log.setLevel('trace')
}

module.exports = {
  log,
}
