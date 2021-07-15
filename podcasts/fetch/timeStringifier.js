const timeStringifier = (time) => {
    if (!time) {
        return '0'
    }

    // copied from https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
    // tslint:disable
    const hrs = ~~(time / 3600)
    const mins = ~~((time % 3600) / 60)
    const secs = ~~time % 60

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = ''

    if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
    }

    ret += '' + mins + ':' + (secs < 10 ? '0' : '')
    ret += '' + secs
    // tslint:enable
    return ret
}

// creates string like:
// `1 hour, 10 minute`
// `55 minute`
const formatDuration = (duration) => {
    if (duration.includes(':')) {
        return duration
    }
    return timeStringifier(+duration)
}

const durationWordy = (time) => {
    const mins = Math.ceil(time / 60)
    const hrs = Math.floor(mins / 60)

    if (hrs > 0) {
        return `${hrs} hour, :${mins} minute${mins > 1 ? 's' : ''}`
    }
    return `${mins} minute`
}

module.exports = {
    formatDuration,
    durationWordy,
    timeStringifier
}
