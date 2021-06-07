const axios = require('axios');
const { getChannelFeed } = require('@obg-lab/youtube-channel-feed');

var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
    apiParametri.streznik = 'YOUR PRODUCTION URL';
}



const pridobiRezultate = (req, res) => {
    axios
        .get(apiParametri.streznik + '/api/rezultati/' +  req.query.iskalniNiz)
        .then((odgovor) => {
            getChannelFeed("UC4ZtP_QSSxISPlLuEDqAqpA").then((feed) => {
                //console.log(feed.feed.entry)
                videos = [];
                for(var i in feed.feed.entry) {
                    match = feed.feed.entry[i].title[0].toLowerCase().includes(req.query.iskalniNiz.toLowerCase());
                    if (match){
                        videos.push(feed.feed.entry[i])
                    }
                }
                //console.log(videos)
                prikaziRezultate(req, res, odgovor.data, videos);
            });
        })
        .catch((napaka) => {
            console.log(napaka)
        });
};


const prikaziRezultate = (req, res, seznamClankov, videos) => {
    res.render('rezultatiIskanja', {
        clanki: seznamClankov,
        videos: videos
    });
};


module.exports = {
  pridobiRezultate
};
