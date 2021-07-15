const get = require('lodash.get')
const { feedXmlToEpisode } = require('./mappers')
const { fetchAndParse, isValidEpisode } = require('./utils')

const fetchChannel = async (uri) => {
    try {
        console.log(`fetchChannel() ${uri}`)
        const parsed = await fetchAndParse(uri)
        const episodes = parsed.items
            .map((epi) => feedXmlToEpisode(parsed, epi))
            .filter(({ data: { imageUri, title, episodeUri }, channelTitle }) =>
                isValidEpisode({ imageUri, title, channelTitle, episodeUri })
            )

        return {
            uri,
            episodes,
            meta: {
                title: parsed.title,
                publisherName: get(parsed, 'itunes.owner.name'),
                description: parsed.description,
                image: parsed.image.url
            }
        }
    } catch (error) {
        console.log(`Fetch channel error: ${uri}`)
        console.log(error)
        return null
    }
}

module.exports = {
    fetchChannel
}