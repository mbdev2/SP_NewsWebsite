# Youtube channel feed

Simple nodejs package to load Youtube Channel Feed and parse into JSON.

## Install

```bash
npm install @obg-lab/youtube-channel-feed --save
# or
yarn add @obg-lab/youtube-channel-feed
```

## How to use

```js
const { getChannelFeed } = require("./index");

getChannelFeed("channelId").then((feed) => {
  console.log(feed);
});
```
