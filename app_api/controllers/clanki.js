const mongoose = require('mongoose');
const Clanek = mongoose.model('clanki');
const CakalnaVrsta = mongoose.model('cakalnaVrsta');
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

const clanekKreiraj = (req, res) => {
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
          } else {
               if (uporabnik.nivodostopa == "avtor") {
                    dodajVCakalnoVrsto(req, res, uporabnik)
               }
               else {
                    objaviClanek(req, res, uporabnik)
               }
          }
     });
  });
};

const objaviClanek = (req, res, avtor) => {
  if (req.body.slika == '') {
       Clanek.create({
         naslov: req.body.naslov,
         kraj: req.body.kraj,
         caption: req.body.caption,
         besedilo: req.body.clanektext,
         kategorija: req.body.kategorija,
         avtor: avtor._id,
         avtorVzdevek: avtor.vzdevek
      }, (napaka, clanek) => {
        if (napaka) {
          res.status(400).json(napaka);
        } else {
          res.status(201).json(clanek);
        }
      });
} else {
       Clanek.create({
          naslov: req.body.naslov,
          kraj: req.body.kraj,
          caption: req.body.caption,
          slika: req.body.slika,
          besedilo: req.body.clanektext,
          kategorija: req.body.kategorija,
          avtor: avtor._id,
          avtorVzdevek: avtor.vzdevek
       }, (napaka, clanek) => {
         if (napaka) {
           res.status(400).json(napaka);
         } else {
           res.status(201).json(clanek);
         }
       });
  }
};



const dodajVCakalnoVrsto = (req, res, avtor) => {
  if (req.body.slika == '') {
       CakalnaVrsta.create({
         naslov: req.body.naslov,
         kraj: req.body.kraj,
         caption: req.body.caption,
         besedilo: req.body.clanektext,
         kategorija: req.body.kategorija,
         avtor: avtor._id,
         avtorVzdevek: avtor.vzdevek
      }, (napaka, clanek) => {
        if (napaka) {
          res.status(400).json(napaka);
        } else {
          res.status(201).json(clanek);
        }
      });
} else {
       CakalnaVrsta.create({
          naslov: req.body.naslov,
          kraj: req.body.kraj,
          caption: req.body.caption,
          slika: req.body.slika,
          besedilo: req.body.clanektext,
          kategorija: req.body.kategorija,
          avtor: avtor._id,
          avtorVzdevek: avtor.vzdevek
       }, (napaka, clanek) => {
         if (napaka) {
           res.status(400).json(napaka);
         } else {
           res.status(201).json(clanek);
         }
       });
  }
};

const clanekPosodobi = (req, res) => {
  const idClanka = req.params.idClanka;
  Clanek
     .findById(idClanka)
     .exec((napaka, trenutniClanek) => {
          if(!trenutniClanek) {
               return res.status(404).json({"sporočilo": "Ne najdem clanka."});
          } else if (napaka) {
               return res.status(500).json(napaka);
          } else {
               if (req.body.slika == '') {
                    trenutniClanek.naslov = req.body.naslov;
                    trenutniClanek.kraj = req.body.kraj;
                    trenutniClanek.caption = req.body.caption;
                    trenutniClanek.besedilo = req.body.clanektext;
                    trenutniClanek.kategorija = req.body.kategorija;
                    trenutniClanek.save((napaka, clanek) => {
                         if (napaka) {
                            res.status(400).json(napaka);
                         } else {
                            res.status(200).json(trenutniClanek);
                         }
                    });
             } else {
                  trenutniClanek.naslov = req.body.naslov;
                  trenutniClanek.kraj = req.body.kraj;
                  trenutniClanek.caption = req.body.caption;
                  trenutniClanek.besedilo = req.body.clanektext;
                  trenutniClanek.kategorija = req.body.kategorija;
                  trenutniClanek.slika = req.body.slika;
                  trenutniClanek.save((napaka, clanek) => {
                       if (napaka) {
                         res.status(400).json(napaka);
                       } else {
                         res.status(200).json(trenutniClanek);
                       }
                  });
               }
          }
     });
};

const clanekIzbrisi = (req, res) => {
  vrniUpId(req, res, (req, res, idUporabnika) => {
       const idClanka = req.params.idClanka;
       if (!idClanka) {
         return res.status(404).json({
           "sporočilo":
             "Ne najdem clanka, " +
             "idclanka je obvezen parameter."
         });
       }
       Clanek
         .findById(idClanka)
         .exec((napaka, clanek) => {
           if (!clanek) {
             return res.status(404).json({"sporočilo": "Ne najdem clanka."});
           } else if (napaka) {
             return res.status(500).json(napaka);
           } else {
               clanek.remove()
               res.status(204).json(null);
           }
        });
  });
};

const clanekPreberiIzbrano = (req, res) => {

     Clanek
       .findById(req.params.idClanka)
       .exec((napaka, clanek) => {
         if (!clanek) {
           return res.status(404).json({
             "sporočilo":
               "Ne najdem clanka s podanim enoličnim identifikatorjem idClanka."
           });
         } else if (napaka) {
           return res.status(500).json(napaka);
         }

         console.log(req.headers.prijavljen);
         console.log(req.headers.prijavljen !== 'undefined')

         if (clanek.komentarji && clanek.komentarji.length > 0 && req.headers.prijavljen !== 'undefined') {
              vrniUpId(req, res, (req, res, idUporabnika) => {
                   Uporabniki
                     .findById(idUporabnika)
                     .exec((napaka, uporabnik) => {
                          var mojiKomentarji = []
                          for (var i = 0; i < clanek.komentarji.length; i++) {
                               var komentar = clanek.komentarji[i];
                               if (uporabnik.vzdevek == komentar.avtor) {
                                    mojiKomentarji.push(komentar._id)
                               }
                          }
                          return res.status(200).json({
                               "clanek": clanek,
                               "mojiKomentarji": mojiKomentarji,
                          });
                     });
                })

         } else {
              console.log("TU SEM");
              return res.status(200).json({
                  "clanek": clanek,
                  "mojiKomentarji": [],
              });
         }

       });
};

dodajMedPriljubljene = (req, res) => {
  vrniUpId(req, res, (req, res, idUporabnika) => {
     const idClanka = req.params.idClanka;
     Uporabniki
          .findById(idUporabnika)
          .select('priljubljeniClanki')
          .exec((napaka, uporabnik) => {
               if (!uporabnik) {
                  return res.status(404).json({
                    "sporočilo":
                      "Ne najdem clanka s podanim enoličnim identifikatorjem idClanka."
                  });
               }
               else if (napaka) {
                    return res.status(500).json(napaka);
               }
               else {
                    uporabnik.priljubljeniClanki.push(idClanka);
                    uporabnik.save((napaka, uporabnik) => {
                          if (napaka) {
                            res.status(400).json(napaka);
                          } else {
                            const dodaniClanek = uporabnik.priljubljeniClanki.slice(-1).pop();
                            res.status(201).json(dodaniClanek);
                          }
                    });
               }
          });
    });
};

odstraniIzPriljubljenih = (req, res) => {
  vrniUpId(req, res, (req, res, idUporabnika) => {
     const idClanka = req.params.idClanka;

     Uporabniki
          .findById(idUporabnika)
          .select('priljubljeniClanki')
          .exec((napaka, uporabnik) => {
               if (!uporabnik) {
                  return res.status(404).json({
                    "sporočilo":
                      "Ne najdem clanka s podanim enoličnim identifikatorjem idClanka."
                  });
               }
               else if (napaka) {
                    return res.status(500).json(napaka);
               }
               if (uporabnik.priljubljeniClanki && uporabnik.priljubljeniClanki.length > 0) {
                  uporabnik.priljubljeniClanki.remove(idClanka);
                  uporabnik.save((napaka) => {
                    if (napaka) {
                      return res.status(500).json(napaka);
                    } else {
                      res.status(204).json(null);
                    }
                  });
                } else {
                  res.status(404).json({"sporočilo": "Ni clanka za odstranjevanje iz Priljubljenih."});
                }
          });
    });
};

const jePriljubljen = (req, res) => {
     const idClanka = req.params.idClanka;
     vrniUpId(req, res, (req, res, idUporabnika) => {

     Uporabniki
          .findById(idUporabnika)
          .select('priljubljeniClanki')
          .exec((napaka, uporabnik) => {
               if (!uporabnik) {
                  return res.status(404).json({
                    "sporočilo":
                      "Ne najdem clanka s podanim enoličnim identifikatorjem idClanka."
                  });
               }
               else if (napaka) {
                    return res.status(500).json(napaka);
               }
               else {
                    var indeks = uporabnik.priljubljeniClanki.indexOf(idClanka);
                    if (indeks >= 0) {
                         return res.status(200).json("priljubljen");
                    } else {
                         return res.status(200).json("nePriljubljen");
                    }
               }
          });
    });
}

const cakalnaVrsta = (req, res) => {
  vrniUpId(req, res, (req, res, idUporabnika) => {
  if (!idUporabnika) {
    return res.status(400).json({
      "sporočilo": "Id uporabnika je obvezen."
    });
  };


  Uporabniki
  .findById(idUporabnika)
  .exec((napaka, uporabnik) => {
    if (!uporabnik) {
      return res.status(404).json({
        "Napaka":
          "Ne najdem uporabnika z podanim IDjem"
      });
    } else if (napaka) {
      return res.status(500).json(napaka);
    }

    if (uporabnik.nivodostopa !="admin" && uporabnik.nivodostopa !="urednik") {
        return res.status(403).json([])
    };

     CakalnaVrsta
          .find()
          .exec((napaka, odobritevClanki) => {
          if (napaka) {
            res.status(500).json(napaka);
          } else {
            res.status(200).json(odobritevClanki);
          }
     });
  });
  });
};

const izbrisiClanekOdobritev = (req, res) => {
  vrniUpId(req, res, (req, res, idUporabnika) => {
  if (!idUporabnika) {
    return res.status(400).json({
      "sporočilo": "Id uporabnika je obvezen."
    });
  };


  Uporabniki
  .findById(idUporabnika)
  .exec((napaka, uporabnik) => {
    if (!uporabnik) {
      return res.status(404).json({
        "Napaka":
          "Ne najdem uporabnika z podanim IDjem"
      });
    } else if (napaka) {
      return res.status(500).json(napaka);
    }

    if (uporabnik.nivodostopa !="admin" && uporabnik.nivodostopa !="urednik") {
        return res.status(403).json([])
    };
  const idClanka = req.params.idClanka;
  console.log(idClanka)
  if (!idClanka) {
    return res.status(404).json({
      "sporočilo":
        "Ne najdem članka, " +
        "idClanka je obvezen parameter."
    });
  }
  CakalnaVrsta
    .findById(idClanka)
    .exec((napaka, clanek) => {
      if (!clanek) {
        return res.status(404).json({"sporočilo": "Ne najdem članka."});
      } else if (napaka) {
        return res.status(500).json(napaka);
      } else {
          clanek.remove()
          res.status(204).json(null);
      }
   });
  });
  });
};

const objaviCakajocClanek = (req, res) => {
  vrniUpId(req, res, (req, res, idUporabnika) => {
  if (!idUporabnika) {
    return res.status(400).json({
      "sporočilo": "Id uporabnika je obvezen."
    });
  };


  Uporabniki
  .findById(idUporabnika)
  .exec((napaka, uporabnik) => {
    if (!uporabnik) {
      return res.status(404).json({
        "Napaka":
          "Ne najdem uporabnika z podanim IDjem"
      });
    } else if (napaka) {
      return res.status(500).json(napaka);
    }

    if (uporabnik.nivodostopa !="admin" && uporabnik.nivodostopa !="urednik") {
        return res.status(403).json([])
    };

  const idClanka = req.params.idClanka;
  console.log(idClanka)
  if (!idClanka) {
    return res.status(404).json({
      "sporočilo":
        "Ne najdem članka, " +
        "idClanka je obvezen parameter."
    });
  }
  CakalnaVrsta
    .findById(idClanka)
    .exec((napaka, clanek) => {
      if (!clanek) {
        return res.status(404).json({"sporočilo": "Ne najdem članka."});
      } else if (napaka) {
        return res.status(500).json(napaka);
      } else {
        if (clanek.slika == '') {
             Clanek.create({
               naslov: clanek.naslov,
               kraj: clanek.kraj,
               caption: clanek.caption,
               besedilo: clanek.besedilo,
               kategorija: clanek.kategorija,
               avtor: clanek.avtor,
               avtorVzdevek: avtor.avtorVzdevek
            }, (napaka, clanek) => {
              if (napaka) {
                res.status(400).json(napaka);
              } else {
                res.status(200).json({"sporočilo":"Članek objavljen."});
              }
            });
      } else {
             Clanek.create({
                naslov: clanek.naslov,
                kraj: clanek.kraj,
                caption: clanek.caption,
                slika: clanek.slika,
                besedilo: clanek.besedilo,
                kategorija: clanek.kategorija,
                avtor: clanek.avtor,
                avtorVzdevek: clanek.avtorVzdevek
             }, (napaka, clanek) => {
               if (napaka) {
                 res.status(400).json(napaka);
               } else {
                 CakalnaVrsta
                   .findById(idClanka)
                   .exec((napaka, clanek) => {
                     if (!clanek) {
                       return res.status(404).json({"sporočilo": "Ne najdem članka."});
                     } else if (napaka) {
                       return res.status(500).json(napaka);
                     } else {
                         clanek.remove()
                         res.status(200).json({"sporočilo": "Članek objavljen."});
                     }
                  });
               }
             });
      }
   }});
  });
 });
};



module.exports = {
  clanekKreiraj,
  clanekPreberiIzbrano,
  dodajMedPriljubljene,
  odstraniIzPriljubljenih,
  jePriljubljen,
  clanekPosodobi,
  clanekIzbrisi,
  cakalnaVrsta,
  izbrisiClanekOdobritev,
  objaviCakajocClanek
};
