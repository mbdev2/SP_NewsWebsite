const axios = require("axios");
const xml2js = require("xml2js");

const remote = axios.create({
  baseURL: "https://www.youtube.com/feeds/videos.xml",
  timeout: 2000,
  mode: "no-cors",
  headers: {
    "Content-Type": "text/xml; charset=UTF-8",
    accept: "text/xml; charset=UTF-8",
    pragma: "no-cache",
  },
});

const fetchFeed = async (channelId) => {
  try {
    const response = await remote.get("", {
      params: {
        channel_id: channelId,
      },
    });

    return response.data;
  } catch (err) {
    const newErr = new Error("Error fetching youtube channel feed.");
    throw Object.assign(newErr, err);
  }
};

exports.getChannelFeed = async (channelId) => {
  // TODO: Improve the channel ID validation
  if (!channelId || channelId.length < 1) {
    throw new Error("Invalid channel ID");
  }

  const feedData = await fetchFeed(channelId);

  try {
    const parser = new xml2js.Parser();
    const feed = await parser.parseStringPromise(feedData);
    return feed;
  } catch (err) {
    const newErr = new Error("Error parsing youtube channel feed data.");
    throw Object.assign(newErr, err);
  }
};
