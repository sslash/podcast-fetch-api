const get = require("lodash.get");
const { feedXmlToEpisode } = require("./mappers");
const { fetchAndParse, isValidEpisode } = require("./utils");

const fetchChannel = async (uri, limit) => {
  try {
    console.log(`fetchChannel() ${uri}, limit: ${limit}`);
    const parsed = await fetchAndParse(uri);
    const episodes = mapEpisodes(parsed.items, limit, parsed, uri)

    return {
      uri,
      episodes,
      meta: {
        title: parsed.title,
        publisherName: get(parsed, "itunes.owner.name"),
        description: parsed.description,
        image: getChannelImage(parsed),
      },
    };

  } catch (error) {
    console.log(`Fetch channel error: ${uri}`);
    console.log(error);
    return null;
  }
};

function mapEpisodes(items, limit, parsed, uri) {
  return (limit ? items.slice(0, limit) : items)
      .map((epi) => feedXmlToEpisode(parsed, epi, uri))
      .filter(({ data: { imageUri, title, episodeUri }, channelTitle }) =>
        isValidEpisode({ imageUri, title, channelTitle, episodeUri })
      );
}


function getChannelImage (parsed) {
  return get(parsed, 'image.url') || get(parsed, 'itunes.image')
}


module.exports = {
  fetchChannel,
  mapEpisodes
};
