const axios = require('axios');
var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
    apiParametri.streznik = 'YOUR PRODUCTION URL';
}

//funkcije za vsako podstran
const pridobiAktualno = (req, res) => {
    const naslov = 'Danes';
    axios
        .get(apiParametri.streznik + '/api/Danes', {
             headers: {limita: "vsi"}
        })
        .then((odgovor) => {
            prikaziClanke(req, res, odgovor.data, naslov);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};

const pridobiEkonomijo = (req, res) => {
    const naslov = 'Ekonomija';
    axios
        .get(apiParametri.streznik + '/api/Ekonomija', {
             headers: {limita: "vsi"}
        })
        .then((odgovor) => {
            prikaziClanke(req, res, odgovor.data, naslov);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};

const pridobiIzobraževanje = (req, res) => {
    const naslov = 'Izobrazba';
    axios
        .get(apiParametri.streznik + '/api/Izobrazba', {
             headers: {limita: "vsi"}
        })
        .then((odgovor) => {
            prikaziClanke(req, res, odgovor.data, naslov);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};

const pridobiCovid = (req, res) => {
    const naslov = 'Covid';
    axios
        .get(apiParametri.streznik + '/api/Covid', {
             headers: {limita: "vsi"}
        })
        .then((odgovor) => {
            prikaziClanke(req, res, odgovor.data, naslov);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};

const pridobiKultura = (req, res) => {
    const naslov = 'Kultura';
    axios
        .get(apiParametri.streznik + '/api/Kultura', {
             headers: {limita: "vsi"}
        })
        .then((odgovor) => {
            prikaziClanke(req, res, odgovor.data, naslov);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};

const pridobiŠport = (req, res) => {
    const naslov = 'Šport';
    axios
        .get(apiParametri.streznik + '/api/Sport', {
             headers: {limita: "vsi"}
        })
        .then((odgovor) => {
            prikaziClanke(req, res, odgovor.data, naslov);
        })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
};

//prikaži pridobljene članke
const prikaziClanke = (req, res, seznamClankov, naslov) => {
    res.render('media', {
        clanki: seznamClankov,
        naslovKategorije: naslov
    });
}

// Funkcija za prikaz napake
const prikaziNapako = (req, res, napaka) => {
    let naslov = "Nekaj je šlo narobe!";
    let vsebina = napaka.response.data["sporočilo"] ?
        napaka.response.data["sporočilo"] : (napaka.response.data["message"] ?
            napaka.response.data["message"] : "Nekaj nekje očitno ne deluje.");
    res.render('index', {
        title: naslov,
        vsebina: vsebina
    });
};

module.exports = {
    pridobiAktualno,
    pridobiEkonomijo,
    pridobiIzobraževanje,
    pridobiCovid,
    pridobiKultura,
    pridobiŠport
}
