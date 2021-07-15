const get = require('lodash.get')
const striptags = require('striptags')
const { formatDuration } = require('./timeStringifier')

const feedXmlToEpisode = (xmlChannel, epi) => {
    const channelImageUri = get(xmlChannel, 'image.url') || get(xmlChannel, 'itunes.image')

    const duration = formatDuration(get(epi, 'itunes.duration')) || ''
    const episode = {
        channelImageUri,
        channelTitle: xmlChannel.title,
        data: {
            duration,
            episodeUri: get(epi, 'enclosures[0].url'),
            title: epi.title,
            description: getEpisodeDescription(epi),
            // @ts-ignore
            imageUri: get(epi, 'itunes.image') || channelImageUri,
            published: epi.published,
            summary: getEpisodeSummary(epi),
            id: epi.id || epi.guid
        }
    }

    return episode
}

const omitDescription = (epi) => {
    return {
        ...epi,
        data: {
            ...epi.data,
            description: ''
        }
    }
}

const omitDescriptionFromDbEpisode = (epi) => {
    return {
        ...epi,
        description: ''
    }
}

const getEpisodeDescription = (episode) => {
    const description = episode.description || ''
    const itunesSubTitle = get(episode, 'itunes.subtitle') || ''

    return description.length > itunesSubTitle.length ? description : itunesSubTitle
}

const MAX_SIZE_SUMMARY = 255
const getEpisodeSummary = (epi) => {
    const str = get(epi, 'itunes.subtitle') || get(epi, 'itunes.summary') || epi.description || ''
    return striptags(str).substr(0, MAX_SIZE_SUMMARY)
}

module.exports = {
    feedXmlToEpisode
}