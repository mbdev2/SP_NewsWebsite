const axios = require('axios');
const { getChannelFeed } = require('@obg-lab/youtube-channel-feed');

var apiParametri = {
  streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'YOUR PRODUCTION URL';
}


const videoteka = (req, res) => {
  getChannelFeed("UC4ZtP_QSSxISPlLuEDqAqpA").then((feed) => {
  res.render('videoteka', feed)
});
}

const pridobiLive = (req, res) => {
  getChannelFeed("UC4ZtP_QSSxISPlLuEDqAqpA").then((feed) => {
  res.render('live', feed)
});

}
module.exports = {
  videoteka,
  pridobiLive
};
