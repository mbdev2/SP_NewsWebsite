const mongoose = require('mongoose');
const Uporabniki = mongoose.model('uporabniki');
const Clanek = mongoose.model('clanki');
const CakalnaVrsta = mongoose.model('cakalnaVrsta');
const axios = require('axios');
const { getChannelFeed } = require('@obg-lab/youtube-channel-feed');

var apiParametri = {
  streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'YOUR PRODUCTION URL';
}

const vrniUpId = (req, res, pkOdgovor) => {
  if (req.payload && req.payload.email) {
    Uporabniki
      .findOne({email: req.payload.email})
      .exec((napaka, uporabnik) => {
        if (!uporabnik)
          return res.status(404).json({"sporočilo": "Ne najdem uporabnika"});
        else if (napaka)
          return res.status(500).json(napaka);
        pkOdgovor(req, res, uporabnik._id);
      });
  } else {
    return res.status(400).json({"sporočilo": "Ni podatka o uporabniku"});
  }
};

const najdiUporabnika = (req, res) => {
  vrniUpId(req, res, (req, res, idUporabnika) => {
  Uporabniki
    .findById(idUporabnika)
    .exec((napaka, uporabnik) => {
      res.status(200).json(uporabnik.ime);
    });
  });
};

const brisiDB = (req, res) => {
  mongoose.connect('mongodb://localhost/etv',function(){
    mongoose.connection.db.dropDatabase();
  });
  res.status(200).json("Uspesno izbrisana baza.");
};

const polniDB = (req, res) => {
        var jsonUporabniki = require('../models/uporabnikiData.json');
        var jsonClanki = require('../models/clankiData.json');
        var jsonCakalnaVrsta = require('../models/cakalnaVrstaData.json');

        Uporabniki.insertMany(jsonUporabniki, function(napaka, uporabniki) {
          if (napaka) {
            res.status(500).json(napaka);
          }
        });
        Clanek.insertMany(jsonClanki, function(napaka, clanki) {
          if (napaka) {
            res.status(500).json(napaka);
          }
        });
        CakalnaVrsta.insertMany(jsonCakalnaVrsta, function(napaka, cakalnaVrsta) {
          if (napaka) {
            res.status(500).json(napaka);
          }
        });
        var delayInMilliseconds = 2000; //2 second

        setTimeout(function() {
          res.status(201).json("Uspesno napolnjena baza.");
        }, delayInMilliseconds);
};

const uporabnikPreberiIzbrano = (req, res) => {
  vrniUpId(req, res, (req, res, idUporabnika) => {
    Uporabniki
    .findById(idUporabnika)
    .exec((napaka, uporabnik) => {
      if (!uporabnik) {
        return res.status(404).json({
          "sporočilo":
            "Ne najdem uporabnika s podanim enoličnim identifikatorjem idOsebe.+"
        });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      res.status(200).json(uporabnik);
    });
  });
};

const avtorPreberiIzbrano = (req, res) => {
  vrniUpId(req, res, (req, res, idUporabnika) => {
    Uporabniki
    .findById(idUporabnika)
    .exec((napaka, uporabnik) => {
      if (!uporabnik) {
        return res.status(404).json({
          "sporočilo":
            "Ne najdem uporabnika s podanim enoličnim identifikatorjem idAvtorja."
        });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      res.status(200).json(uporabnik);
    });
  });
};

const seznamMojihClankov = (req, res) => {
     vrniUpId(req, res, (req, res, idUporabnika) => {
       if (req.headers.limita == "3") {
          limita = 3;
       } else {
          limita = 10000000;
       }

       if (!idUporabnika) {
         return res.status(400).json({
           "sporočilo": "Id uporabnika je obvezen."
         });
       }

       Clanek
         .find()
         .where("avtor").equals(idUporabnika)
         .limit(limita)
         .exec((napaka, mojiClanki) => {
           if (napaka) {
             res.status(500).json(napaka);
           } else {
             res.status(200).json(mojiClanki);
           }
         });
     });
};

const seznamPriljubljenihClankov = (req, res) => {
  vrniUpId(req, res, (req, res, idUporabnika) => {

       if (!idUporabnika) {
         return res.status(400).json({
           "sporočilo": "Id uporabnika je obvezen."
         });
       };

       if (req.headers.limita == "3") {
         limita = 3;
       } else {
         limita = 10000000;
       };

       Uporabniki
       .findById(idUporabnika)
       .exec((napaka, uporabnik) => {
         if (!uporabnik) {
           return res.status(404).json({
             "sporočilo":
               "Ne najdem uporabnika s podanim enoličnim identifikatorjem idOsebe.+"
           });
         } else if (napaka) {
           return res.status(500).json(napaka);
         }
         seznamPriljubljenih = uporabnik.priljubljeniClanki;

         if (seznamPriljubljenih.length < 1) {
             return res.status(200).json([])
         };

          Clanek
               .find()
               .where("_id").in(seznamPriljubljenih)
               .limit(limita)
               .exec((napaka, priljubljeniClanki) => {
               if (napaka) {
                 res.status(500).json(napaka);
               } else {
                 res.status(200).json(priljubljeniClanki);
               }
          });
       });
    });
};

const videoteka = (req, res) => {
  getChannelFeed("UC4ZtP_QSSxISPlLuEDqAqpA").then((feed) => {
    entry = feed.feed.entry
    for (i = 0; i < entry.length; i++) {
      delete entry[i]['media:group'];
      delete entry[i]['yt:channelId'];
      delete entry[i]['updated'];
      entry[i]['id'] = entry[i]['yt:videoId'][0]
      delete entry[i]['yt:videoId'];
      entry[i].author = entry[i]['author'][0]['name'][0];
      entry[i]['link'] = entry[i]['link'][0]['$']['href']
      entry[i]['title'] = entry[i]['title'][0]
      entry[i]['published'] = entry[i]['published'][0]
    }
  res.status(200).json(entry)
});
}

module.exports = {
  najdiUporabnika,
  brisiDB,
  polniDB,
  uporabnikPreberiIzbrano,
  avtorPreberiIzbrano,
  seznamMojihClankov,
  seznamPriljubljenihClankov,
  videoteka
};
