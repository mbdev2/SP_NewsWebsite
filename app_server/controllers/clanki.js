const axios = require('axios');
var apiParametri = {
  streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'YOUR PRODUCTION URL';
}

/*============= DODAJ CLANEK =========================*/
const mediainput = (req, res) => {
     axios
          .get(apiParametri.streznik + '/api/profile',  {
            headers: {cookies: req.cookies.token}
          })
          .then((odgovor) => {
            if (!odgovor) {
                 res.redirect("/napaka")
            } else {
                 if (odgovor.data.nivodostopa == "uporabnik") {
                      res.redirect("/profile");
                 } else {
                      res.render('mediainput');
                 }
            }
          })
          .catch((napaka) => {
               res.redirect("/");
          });
};

const mediainputPost = (req, res) => {
     if (!req.body.naslov || !req.body.kraj || !req.body.caption || !req.body.clanektext || !req.body.kategorija) {
          res.render('error', {
               message: "Prišlo je do napake.",
               error: {
                    status: "Niste izpolnili vseh zahtevanih polj!",
                    stack: "Pri dodajanju članka niste izpolnili enega izmed polj: kategoorija, naslov, kraj, opis članka, besedilo članka. Prosimo izpolnite manjkajoča polja."
               }
          });
     } else {
          axios({
               method: 'post',
               url: apiParametri.streznik + '/api/mediainput',
               headers: {cookies: req.cookies.token},
               data: {
                   naslov: req.body.naslov,
                   kraj: req.body.kraj,
                   caption: req.body.caption,
                   slika: req.body.slika,
                   clanektext: req.body.clanektext,
                   kategorija: req.body.kategorija
                }
           })
          .then((odgovor) => {
               res.redirect('/');
          }).catch((napaka) => {
           prikaziNapako(req, res, napaka);
         });
    }
};

/*============= POSODOBI CLANEK =========================*/
const urediClanek = (req, res) => {
     console.log(req.params.idClanka);
     axios
          .get(apiParametri.streznik + '/api/article/' + req.params.idClanka, {
               headers: {cookies: req.cookies.token},
          })
          .then((odgovor) => {
               res.render('article_edit', {
                 clanek: odgovor.data.clanek
               });
          })
          .catch((napaka) => {
               prikaziNapako(req, res, napaka);
          });
}

const mediainputPut = (req, res) => {
     if (!req.body.naslov || !req.body.kraj || !req.body.caption || !req.body.clanektext || !req.body.kategorija) {
          res.render('error', {
               message: "Prišlo je do napake.",
               error: {
                    status: "Niste izpolnili vseh zahtevanih polj!",
                    stack: "Pri urejanju članka niste izpolnili enega izmed polj: kategoorija, naslov, kraj, opis članka, besedilo članka. Prosimo izpolnite manjkajoča polja."
               }
          });
     } else {
          axios({
               method: 'put',
               url: apiParametri.streznik + '/api/mediainput/' + req.params.idClanka,
               data: {
                   naslov: req.body.naslov,
                   kraj: req.body.kraj,
                   caption: req.body.caption,
                   slika: req.body.slika,
                   clanektext: req.body.clanektext,
                   kategorija: req.body.kategorija
                }
           })
          .then((odgovor) => {
               res.redirect('/');
          }).catch((napaka) => {
           prikaziNapako(req, res, napaka);
         });
    }
};

/*============= IZBRIŠI CLANEK =======================*/
const izbrisiClanek = (req, res) => {
     axios
          .delete(apiParametri.streznik + '/api/article/' + req.params.idClanka)
          .then(() => {
               res.redirect('/profile');
          })
          .catch((napaka) => {
               prikaziNapako(req, res, napaka);
          });
}

/*============= PRIKAZI CLANEK =======================*/
const article = ((req, res) => {
     pridobiPodrobnostiClanka(req, res);
});
const pridobiPodrobnostiClanka = (req, res) => {
  if(typeof req.cookies.token!=='undefined'){
     axios
          .get(apiParametri.streznik + '/api/article/' + req.params.idClanka, {
               headers: {cookies: req.cookies.token}
          })
          .then((odgovor) => {
               jePriljubljen(req, res, odgovor.data)
          })
          .catch((napaka) => {
               prikaziNapako(req, res, napaka);
          });
    }
    else{
      axios
           .get(apiParametri.streznik + '/api/article/' + req.params.idClanka, {
                headers: {cookies: 'undefined'}
           })
           .then((odgovor) => {
                jePriljubljen(req, res, odgovor.data)
           })
           .catch((napaka) => {
                prikaziNapako(req, res, napaka);
           });
     }
};
const prikaziPodrobnostiClanka = (req, res, podrobnostiClanka, priljubljen) => {
     res.render('article', {
       clanek: podrobnostiClanka.clanek,
       priljubljen: priljubljen,
       mojiKomentarji: podrobnostiClanka.mojiKomentarji
     });
};
const jePriljubljen = (req, res, podrobnostiClanka) => {
     if(typeof req.cookies.token!=='undefined'){
          axios
               .get(apiParametri.streznik + '/api/jePriljubljen', {
                    headers: {cookies: req.cookies.token, clanek: req.params.idClanka}
               })
               .then((odgovor) => {
                    prikaziPodrobnostiClanka(req, res, podrobnostiClanka, odgovor.data)
               })
               .catch((napaka) => {
                    prikaziNapako(req, res, napaka);
               });
     } else {
          prikaziPodrobnostiClanka(req, res, podrobnostiClanka, "nePrijavljen")
     }
};

/*============= FUNKICJI ZA DODAJANJE/BRISANJE KOMENTARJA ======================*/
const shraniKomentar = (req, res) => {
  const idClanka = req.params.idClanka;
  if (!req.body.komentar) {
       res.render('error', {
            message: "Prišlo je do napake.",
            error: {
                 status: "Niste izpolnili vseh zahtevanih polj!",
                 stack: "Pri objavljanju komentarja niste izpolnili polja za besedilo komentarja. Prosimo izpolnite manjkajoča polja."
            }
       });
  } else {
    axios({
      method: 'post',
      url: apiParametri.streznik + '/api/article/' + idClanka + '/komentarji',
      headers: {cookies: req.cookies.token},
      data: {komentar: req.body.komentar}
    }).then(() => {
      res.redirect('/article/' + idClanka);
    }).catch((napaka) => {
      prikaziNapako(req, res, napaka);
    });
  }
};

const izbrisiKomentar = (req, res) => {
  const idClanka = req.params.idClanka;
  const idKomentarja = req.params.idKomentarja;
  axios({
     method: 'delete',
     url: apiParametri.streznik + '/api/article/' + idClanka + '/izbrisKomentarja/' + idKomentarja,
  }).then(() => {
     res.redirect('/article/' + idClanka);
  }).catch((napaka) => {
     prikaziNapako(req, res, napaka);
  });
};
/*============= FUNKICJI ZA DODAJANJE/ODSTRANJEVANJE PRILJUBLJENIH ======================*/
const dodajMedPriljubljene = (req, res) => {
     const idClanka = req.params.idClanka;
     axios
          .get(apiParametri.streznik + '/api/dodajMedPriljubljene', {
               headers: {cookies: req.cookies.token, clanek: idClanka}
          })
          .then(() => {
               res.redirect('/article/' + idClanka)
          })
          .catch((napaka) => {
               prikaziNapako(req, res, napaka);
          });
};
const odstraniIzPriljubljenih = (req, res) => {
     const idClanka = req.params.idClanka;
     axios
          .get(apiParametri.streznik + '/api/odstraniIzPriljubljenih', {
               headers: {cookies: req.cookies.token, clanek: idClanka}
          })
          .then(() => {
               res.redirect('/article/' + idClanka)
          })
          .catch((napaka) => {
               prikaziNapako(req, res, napaka);
          });
}

/*============= FUNKICJA ZA PRIKAZ NAPAKE ======================*/
const prikaziNapako = (req, res, napaka) => {
  let naslov = "Nekaj je šlo narobe!";
  let vsebina = napaka.response.data["sporočilo"] ?
    napaka.response.data["sporočilo"] : (napaka.response.data["message"] ?
        napaka.response.data["message"] : "Nekaj nekje očitno ne deluje.");
  if (napaka.response.data["_message"] == "Lokacija validation failed") {
    res.redirect(
      '/lokacija/' + req.params.idLokacije +
      '/komentar/nov?napaka=vrednost'
    );
  } else {
    res.render('index', {
      title: naslov,
      vsebina: vsebina
    });
  }
};

/*============= CONTROLLER ZA PRIDOBITEV CLANKOV, KI CAKAJO NA ODOBRITEV ======================*/

const pridobiVseOdobritev = (req, res) => {
     axios
          .get(apiParametri.streznik + '/api/cakalnaVrsta',  {
            headers: {cookies: req.cookies.token}
          })
          .then((odgovor) => {
               res.render('overview', {
                 odobritevClanki: odgovor.data
               })
          })
          .catch((napaka) => {
               console.log(napaka);
               res.redirect('/profile')
          });
};

const izbrisiClanekOdobritev = (req, res) => {
  axios
       .delete(apiParametri.streznik + '/api/overview/' + req.params.idClanka)
       .then(() => {
            res.redirect('/approval');
       })
       .catch((napaka) => {
            prikaziNapako(req, res, napaka);
       });
};

const objaviClanekOdobritev = (req, res) => {
  axios
       .get(apiParametri.streznik + '/api/cakalnaVrsta/' + req.params.idClanka,  {
         headers: {cookies: req.cookies.token}
       })
       .then((odgovor) => {
            res.redirect('/approval');
       })
       .catch((napaka) => {
            console.log(napaka);
            res.redirect('/approval');
       });
};
/*aaaaaaaa existance is pain*/

module.exports = {
  mediainput,
  mediainputPost,
  mediainputPut,
  article,
  shraniKomentar,
  izbrisiKomentar,
  dodajMedPriljubljene,
  odstraniIzPriljubljenih,
  urediClanek,
  izbrisiClanek,
  pridobiVseOdobritev,
  izbrisiClanekOdobritev,
  objaviClanekOdobritev
};
