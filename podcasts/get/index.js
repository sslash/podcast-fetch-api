let arc = require("@architect/functions");
const data = require("@begin/data");
const createKey = require("@architect/shared/createKey");
const keys = require("@architect/shared/keys");

const log = (...args) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(...args);
  }
};

// uses dynamo to save podcasts
// gets podcast meta + the latest 10 episodes
exports.handler = async function read(req) {
  let url = req.queryStringParameters.url;
  const key = createKey(url);

  const res = await data.get({ table: keys.CHANNEL_KEY, key });
  log(`Get podcast head: '${url}', key: '${key}', existed? ${!!res} `);

  let body = "";
  try {
    body = JSON.stringify(res || "");
  } catch (error) {
    console.log("JSON stringify failed");
    console.error(error);
  }

  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json; charset=utf8",
      "cache-control":
        "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
    },
    body: body,
  };
};

// curl http://localhost:3333/podcasts/get-head\?url\=https://feed.pippa.io/public/shows/5b1a5a6364d9356d1af279f5
// curl http://localhost:3333/podcasts/get-head\?url\=
