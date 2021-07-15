// import get from 'lodash.get'
const get = require('lodash.get')
const fetch = require('node-fetch')
const {parse} = require('react-native-rss-parser')
const { getEpisodeDescription } = require('./mappers')

async function fetchAndParse(uri) {
    const response = await fetch(uri)
    const text = await response.text()
    const parsed = await parse(text)

    return parsed
}

function podcastImage(podcast) {
    return podcast.artworkUrl100 || podcast.artworkUrl600 || podcast.artworkUrl60
}

function isValidEpisode(epi) {
    return epi.title && epi.episodeUri && epi.imageUri && epi.channelTitle
}

function createPopularInCountryAbbreviatedName(country) {
    return `POPULAR_${country}`
}

function mapPodcastFeedToEpisodes(
    rssFeed,
    amount,
    channel
) {
    return rssFeed.items
        .map(item => {
            return {
                title: item.title,
                episodeUri: get(item, 'enclosures[0].url'),
                podcastId: item.id,
                description: getEpisodeDescription(item),
                imageUri: get(item, 'itunes.image') || get(channel, 'imageUri'),
                published: item.published,
                channelTitle: mapChannelTitle(item, channel),
                channelUri: channel ? channel.podcastUri : '',
                isRecommended: true,
                duration: get(item, 'itunes.duration')
            }
        })
        .filter(isValidEpisode)
        .slice(0, amount)
}

function mapChannelTitle(item, channel){
    if (channel) {
        return channel.title
    }

    // some feeds have subTitle as the channelName. Other's have an actual subtitle
    const itunesSubTitle = get(item, 'itunes.subTitle')
    if (itunesSubTitle && itunesSubTitle.length < 50) {
        return itunesSubTitle
    }

    return ''
}

module.exports = {
    fetchAndParse, isValidEpisode
}
