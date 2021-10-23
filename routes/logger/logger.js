const colors = require('./color_constants')

let config = require('./default_config.json')

setColor = (fg, bg) => `${fg == undefined ? '' : fg}${bg == undefined ? '' : bg}%s${colors.reset}`

assignFormat = (level) => {
    let tagFg = config[level].tag.fg == "default" ? "" : eval("colors." + config[level].tag.fg)
    let tagBg = config[level].tag.bg == "default" ? "" : eval("colors." + config[level].tag.bg)
    let msgFg = config[level].msg.fg == "default" ? "" : eval("colors." + config[level].msg.fg)
    let msgBg = config[level].msg.bg == "default" ? "" : eval("colors." + config[level].msg.bg)

    return setColor(tagBg, tagFg) + setColor(msgBg, msgFg)
}

module.exports = (tag, message) => {
    console.log(assignFormat("log"), `L: ${tag}\t`, `${message}`)
}

module.exports.verbose = (tag, message) => {
    console.log(assignFormat("verbose"), `V: ${tag}\t`, `${message}`)
}

module.exports.info = (tag, message) => {
    console.log(assignFormat("info"), `I: ${tag}\t`,`${message}`)
}

module.exports.debug = (tag, message) => {
    console.log(assignFormat("debug"), `D: ${tag}\t`, `${message}`)
}

module.exports.warn = (tag, message) => {
    console.log(assignFormat("warn"), `W: ${tag}\t`, `${message}`)
}

module.exports.error = (tag, message) => {
    console.log(assignFormat("error"), `E: ${tag}\t`, `${message}`)
}

module.exports.setConfig = (configObj) => {
    config = configObj
}
