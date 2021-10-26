let arc = require("@architect/functions");
let data = require("@begin/data");
let createKey = require("../utils/createKey");
const keys = require("../utils/keys");

const log = (...args) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(...args);
  }
};

exports.handler = async function create(req) {
  let podcastChannel = arc.http.helpers.bodyParser(req);
  const { uri, channel } = podcastChannel;

  const key = createKey(uri);
  log("Will insert key", key);
  const existing = await data.get({ table: keys.CHANNEL_KEY, key });

  let newEntry;

  // was empty
  if (!existing) {
    log("didnt exist");
    newEntry = channel;

    // existed before
  } else if ("uri" in existing && existing.uri === uri) {
    log("did exist");
    newEntry = channel;

    // was a different channel, but not collition yet
  } else if ("uri" in existing && existing.uri !== uri) {
    log("did exist with different uri");
    newEntry = {
      isCollition: true,
      [existing.uri]: existing,
      [channel.uri]: channel,
    };

    // was already a collition
  } else if ("isCollition" in existing) {
    log("did exist in collition");
    newEntry = {
      isCollition: true,
      ...existing,
      [channel.uri]: channel,
    };

    // should not happen, but in any case, assume collition
  } else {
    log("default case");
    newEntry = {
      isCollition: true,
      ...existing,
      [channel.uri]: channel,
    };
  }

  try {
    await data.set({
      table: keys.CHANNEL_KEY,
      key,
      ...newEntry,
    });

    let table = await data.get({ table: keys.CHANNEL_KEY });
    log("Table length ", table.length);

    return {
      statusCode: 201,
      headers: {
        location: "/",
        "cache-control":
          "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
      },
    };
  } catch (error) {
    log("ERROR ", error);
    return {
      statusCode: 400,
    };
  }
};
