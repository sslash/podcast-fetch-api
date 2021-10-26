const get = require("lodash.get");
const { feedXmlToEpisode } = require("./mappers");
const { fetchAndParse, isValidEpisode } = require("./utils");

const fetchChannel = async (uri, limit) => {
  try {
    console.log(`fetchChannel() ${uri}, limit: ${limit}`);
    const parsed = await fetchAndParse(uri);
    const episodes = (limit ? parsed.items.slice(0, limit) : parsed.items)
      .map((epi) => feedXmlToEpisode(parsed, epi, uri))
      .filter(({ data: { imageUri, title, episodeUri }, channelTitle }) =>
        isValidEpisode({ imageUri, title, channelTitle, episodeUri })
      );

    return {
      uri,
      episodes,
      meta: {
        title: parsed.title,
        publisherName: get(parsed, "itunes.owner.name"),
        description: parsed.description,
        image: parsed.image.url,
      },
    };
  } catch (error) {
    console.log(`Fetch channel error: ${uri}`);
    console.log(error);
    return null;
  }
};

module.exports = {
  fetchChannel,
};
