let arc = require("@architect/functions");
const get = require("lodash.get");
const { mapEpisodes } = require("@architect/shared/fetchChannel");
const { fetchAndParse } = require("@architect/shared/utils");

exports.handler = async function read(req) {
  const { uri, title, channelUri } = req.queryStringParameters
  
  console.log('Get-episode-details ', uri, title, channelUri)

  const parsed = await fetchAndParse(channelUri);
  let epi = parsed.items.find((epi) => {
    let epiUrl = get(epi, "enclosures[0].url")

    return epiUrl === uri || epi.title === title
  })

  

  let mappedEpisodes = epi ? mapEpisodes([epi], undefined, parsed, channelUri) : []

  let body = "";
  try {
    body = JSON.stringify(mappedEpisodes[0] || null);
  } catch (error) {
    console.log("JSON stringify failed");
    console.error(error);
  }

  return {
    statusCode: 201,
    headers: {
      "content-type": "application/json; charset=utf8",
      "cache-control":
        "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
    },
    body,
  };
};

// curl -X POST localhost:3333/podcasts -H "Content-Type: application/json" -d "{\"url\":\"https://www.omnycontent.com/d/playlist/9b7dacdf-a925-4f95-84dc-ac46003451ff/46fa741f-6c9f-4aab-bcce-acb500364223/f01b9c95-5379-4121-89b1-acb50036422c/podcast.rss\"}"
