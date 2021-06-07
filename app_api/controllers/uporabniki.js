const mongoose = require('mongoose');
const Clanek = mongoose.model('clanki');
const Uporabniki = mongoose.model('uporabniki');
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

const pridobiVseUporabnike = (req, res) => {
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
         if (uporabnik.nivodostopa == 'admin') {
              Uporabniki
               .find()
               .exec((napaka, uporabniki) => {
                  if (!uporabniki) {
                    return res.status(404).json({
                     "sporočilo":
                        "Ne najdem nobenega uporabnika!"
                    });
                  } else if (napaka) {
                    return res.status(500).json(napaka);
                  }
                  res.status(200).json(uporabniki);
               });
         } else {
              return res.status(401).json({
               "sporočilo":
                 "Dostop ni dovoljen."
             });
         }
       });
     });

};

const izbrisiUporabnika = (req, res) => {
  vrniUpId(req, res, (req, res, idUporabnika) => {
       if (!idUporabnika) {
         return res.status(404).json({
           "sporočilo":
             "Ne najdem uporabnika, " +
             "userID je obvezen parameter."
         });
       }
       if (req.headers.uporabnik != 'null') {
            //console.log("Tukaj 1");
            Uporabniki
              .findById(req.headers.uporabnik)
              .exec((napaka, uporabnik) => {
                if (!uporabnik) {
                  return res.status(404).json({"sporočilo": "Ne najdem uporabnika."});
                } else if (napaka) {
                  return res.status(500).json(napaka);
                } else {
                    uporabnik.remove()
                    res.status(204).json(null);
                }
             });
       } else {
            //console.log("Tukaj 1");
            Uporabniki
              .findById(idUporabnika)
              .exec((napaka, uporabnik) => {
                if (!uporabnik) {
                  return res.status(404).json({"sporočilo": "Ne najdem uporabnika."});
                } else if (napaka) {
                  return res.status(500).json(napaka);
                } else {
                    uporabnik.remove()
                    res.status(204).json(null);
                }
             });
       }

  });
};

const posodobiUporabnika = (req, res) => {
  vrniUpId(req, res, (req, res, idUporabnika) => {
       if (!idUporabnika) {
         return res.status(404).json({
           "sporočilo":
             "Ne najdem uporabnika, " +
             "userID je obvezen parameter."
         });
       }

       Uporabniki
         .findById(req.headers.uporabnik)
         .exec((napaka, uporabnik) => {
           if (!uporabnik) {
             return res.status(404).json({"sporočilo": "Ne najdem uporabnika."});
           } else if (napaka) {
                //console.log(napaka);
             return res.status(500).json(napaka);
           } else {
             if (req.headers.novNivo != ' ') {
                  //console.log(req.headers.novNivo);
               uporabnik.nivodostopa = req.headers.novnivo,
               uporabnik.save((napaka, uporabnik) => {
                       if (napaka) {
                         res.status(400).json(napaka);
                       } else {
                         return res.status(200).json(uporabnik);
                       }
                  });
           } else {
             res.status(500).json(null);}
        }});
  });
};

const posodobiProfil = (req, res) => {
     vrniUpId(req, res, (req, res, idUporabnika) => {
     Uporabniki
        .findById(idUporabnika)
        .exec((napaka, trenutniUser) => {
             if(!trenutniUser) {
                  return res.status(404).json({"sporočilo": "Ne najdem uporabnika."});
             } else if (napaka) {
                  return res.status(500).json(napaka);
             } else {
                  //console.log(req.headers.geslo)
                  if (req.headers.geslo == '') {
                       trenutniUser.ime = req.body.ime,
                       trenutniUser.priimek = req.body.priimek,
                       trenutniUser.telstevilka = req.body.telstevilka,
                       trenutniUser.save((napaka, uporabnik) => {
                            if (napaka) {
                              res.status(400).json(napaka);
                            } else {
                                 //console.log(uporabnik);
                              return res.status(200).json(uporabnik);
                            }
                       });
                } else {
                     trenutniUser.ime = req.body.ime,
                     trenutniUser.priimek = req.body.priimek,
                     trenutniUser.telstevilka = req.body.telstevilka,
                     trenutniUser.nastaviGeslo(req.headers.geslo);
                     trenutniUser.save((napaka, uporabnik) => {
                         if (napaka) {
                            res.status(400).json(napaka);
                         } else {
                            return res.status(200).json(uporabnik);
                         }
                     });
                  }
             }
        });
   });
};

module.exports = {
  pridobiVseUporabnike,
  izbrisiUporabnika,
  posodobiUporabnika,
  posodobiProfil
};
