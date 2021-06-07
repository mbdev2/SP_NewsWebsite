const axios = require('axios');
var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
    apiParametri.streznik = 'YOUR PRODUCTION URL';
}

const pridobiAktualno = (req, res) => {
    const naslov = 'Danes';
    axios
        .get(apiParametri.streznik + '/api/Danes', {
             headers: {limita: "3"}
        })
        .then((odgovor) => {
            pridobiSportne(req,res,odgovor.data);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};

const pridobiSportne = (req, res, aktualniClanki) => {
    const naslov = 'Danes';
    axios
        .get(apiParametri.streznik + '/api/Sport', {
             headers: {limita: "3"}
        })
        .then((odgovor) => {
            pridobiKulturne(req,res, aktualniClanki, odgovor.data);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};

const pridobiKulturne = (req, res, aktualniClanki, sportniClanki) => {
    const naslov = 'Danes';
    axios
        .get(apiParametri.streznik + '/api/Kultura', {
             headers: {limita: "3"}
        })
        .then((odgovor) => {
            prikaziHomepage(req,res, aktualniClanki, sportniClanki, odgovor.data);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};

/* GET home page */
const prikaziHomepage = (req, res, aktualniClanki, sportniClanki, kulturniClanki) => {
  res.render('main', {
      aktualno : aktualniClanki,
      sport: sportniClanki,
      kultura: kulturniClanki
  });
};

const prikaziNapako = (req, res) => {
    res.render('index', { title: 'Main'});
};

module.exports = {
    pridobiAktualno,
    prikaziNapako
};
