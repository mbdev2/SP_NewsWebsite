const { getChannelFeed } = require("./index");

const channelId = "UCBWbWViVqDHckknir8PIIdg";

test("get feed in json", async () => {
  const feed = await getChannelFeed(channelId);
  expect(feed).toBeDefined();
});

test("invalid channelId", async () => {
  try {
    const feed = await getChannelFeed("");
    expect(feed).toBeUndefined();
  } catch (err) {
    expect(err).toBeDefined();
    expect(err.message).toBe("Invalid channel ID");
  }
});

test("null channelId", async () => {
  try {
    const feed = await getChannelFeed(null);
    expect(feed).toBeUndefined();
  } catch (err) {
    expect(err).toBeDefined();
    expect(err.message).toBe("Invalid channel ID");
  }
});

test("undefined channelId", async () => {
  try {
    const feed = await getChannelFeed(undefined);
    expect(feed).toBeUndefined();
  } catch (err) {
    expect(err).toBeDefined();
    expect(err.message).toBe("Invalid channel ID");
  }
});

// TODO: add more tests
