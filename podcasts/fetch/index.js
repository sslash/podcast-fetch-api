let arc = require("@architect/functions");
const data = require("@begin/data");
const { fetchChannel } = require("./fetchChannel");

exports.handler = async function read(req) {
  let args = arc.http.helpers.bodyParser(req)
  const url = args.url
  const limit = args.limit

  const podcast = await fetchChannel(url, limit)
  let body = ""
  try {
    body = JSON.stringify(podcast)
  } catch (error) {
    console.log('JSON stringify failed')
    console.error(error)
  }

  return {
    statusCode: 201,
    headers: {
      "content-type": "application/json; charset=utf8",
      "cache-control":
        "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
    },
    body
  };
};

// curl -X POST localhost:3333/podcasts -H "Content-Type: application/json" -d "{\"url\":\"https://www.omnycontent.com/d/playlist/9b7dacdf-a925-4f95-84dc-ac46003451ff/46fa741f-6c9f-4aab-bcce-acb500364223/f01b9c95-5379-4121-89b1-acb50036422c/podcast.rss\"}"
