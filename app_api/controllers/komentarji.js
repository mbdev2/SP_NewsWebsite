const mongoose = require('mongoose');
const Uporabniki = mongoose.model('uporabniki');
const Clanek = mongoose.model('clanki');
const axios = require('axios');

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

const komentarjiKreiraj = (req, res) => {
  vrniUpId(req, res, (req, res, idUporabnika) => {
       const idClanka = req.params.idClanka;

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
         vzdevek = uporabnik.vzdevek;

         if (idClanka) {
           Clanek
             .findById(idClanka)
             .select('komentarji')
             .exec((napaka, clanek) => {
               if (napaka) {
                 res.status(400).json(napaka);
               } else {
                 dodajKomentar(req, res, clanek, vzdevek);
               }
             });
         } else {
           res.status(400).json({
             "sporočilo":
               "Ne najdem clanka, idClanka je obvezen parameter."
           });
         }
       });
  });
};
const dodajKomentar = (req, res, clanek, avtor) => {
  if (!clanek) {
    res.status(404).json({"sporočilo": "Ne najdem clanka."});
  } else {
    clanek.komentarji.push({
      avtor: avtor,
      besediloKomentarja: req.body.besedilo
    });
    clanek.save((napaka, clanek) => {
      if (napaka) {
        res.status(400).json(napaka);
      } else {
        const dodaniKomentar = clanek.komentarji.slice(-1).pop();
        res.status(201).json(dodaniKomentar);
      }
    });
  }
};

const komentarjiBrisi = (req, res) => {
  vrniUpId(req, res, (req, res, idUporabnika) => {
       const idClanka = req.params.idClanka;
       const idKomentarja = req.params.idKomentarja;
       if (!idClanka || !idKomentarja) {
         return res.status(404).json({
           "sporočilo":
             "Ne najdem clanka oz. komentarja, " +
             "idClanka in idKomentarja sta obvezna parametra."
         });
       }
       Clanek
         .findById(idClanka)
         .select('komentarji')
         .exec((napaka, clanek) => {
           if (!clanek) {
             return res.status(404).json({"sporočilo": "Ne najdem clanka."});
           } else if (napaka) {
             return res.status(500).json(napaka);
           }
           if (clanek.komentarji && clanek.komentarji.length > 0) {
             clanek.komentarji.id(idKomentarja).remove();
             clanek.save((napaka) => {
               if (napaka) {
                 return res.status(500).json(napaka);
               } else {
                 res.status(204).json(null);
               }
             });
           } else {
             res.status(404).json({"sporočilo": "Ni komentarja za brisanje."});
           }
         });
  });
};

module.exports = {
  komentarjiKreiraj,
  komentarjiBrisi
};
