const passport = require('passport');
const mongoose = require('mongoose');
const Uporabnik = mongoose.model('uporabniki');

const registracija = (req, res) => {
  if (!req.body.ime || !req.body.priimek || !req.body.vzdevek || !req.body.email || !req.body.telstevilka || !req.body.geslo) {
    return res.status(400).json({"sporočilo": "Zahtevani so vsi podatki"});
  } else if (!(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(req.body.email))) {
    return res.status(400).json({"sporočilo": "Elektronski naslov ni ustrezen!"});
  }
  const uporabnik = new Uporabnik();
    uporabnik.ime = req.body.ime,
    uporabnik.priimek = req.body.priimek,
    uporabnik.vzdevek = req.body.vzdevek,
    uporabnik.email = req.body.email,
    uporabnik.telstevilka = req.body.telstevilka,
    uporabnik.nastaviGeslo(req.body.geslo);
  uporabnik.save(napaka => {
    if (napaka) {
      if (napaka.name == "MongoError" && napaka.code == 11000){
        res.status(409).json({"sporočilo": "Uporabnik s tem elektronskim naslovom je že registriran"});
      } else {
        res.status(500).json(napaka);
      }
    } else {
      res.status(200).json({"eTVtoken": uporabnik.generirajJwt()});
    }
  });
};

const prijava = (req, res) => {
  if (!req.body.email || !req.body.geslo) {
    return res.status(400).json({"sporočilo": "Zahtevani so vsi podatki"});
  } else if (!(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(req.body.email))) {
    return res.status(400).json({"sporočilo": "Elektronski naslov ni ustrezen!"});
  }
  passport.authenticate('local', (napaka, uporabnik, informacije) => {
    if (napaka)
      return res.status(500).json(napaka);
    if (uporabnik) {
      res.status(200).json({"eTVtoken": uporabnik.generirajJwt()});
    } else {
      res.status(401).json(informacije);
    }
  })(req, res);
};

module.exports = {
  registracija,
  prijava
};
