const axios = require('axios');

var apiParametri = {
  streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'YOUR PRODUCTION URL';
}


const ostalo = (req, res) => {
  res.render('index', { title: 'Informacije o aplikaciji' });
};

const registracija = (req, res) => {
  res.render('registracija');
};

const db = (req, res) => {
  res.render('db');
};

const admin = (req, res) => {
  axios
       .get(apiParametri.streznik + '/api/profile',  {
         headers: {cookies: req.cookies.token}
       })
       .then((odgovor) => {
         if(!odgovor){res.redirect("/napaka")}
         else {prikaziAdmin(req, res, odgovor.data);}
       })
       .catch((napaka) => {
            res.redirect("/");
       });
}

const prikaziAdmin = (req, res, uporabnik) => {
  if(uporabnik.nivodostopa == "admin") {
    axios
       .get(apiParametri.streznik + '/api/users')
       .then((odgovor) => {
         console.log(odgovor.data)
         res.render('admin', {
           uporabniki: odgovor.data
         });
       })
       .catch((napaka) => {
            prikaziNapako(req, res, napaka);
     });
   } else {
     res.redirect("/");
   }
};


const izbrisiUporabnika = (req, res) => {
  axios
       .delete(apiParametri.streznik + '/api/users/' + req.params.userID)
       .then(() => {
            res.redirect('/admin');
       })
       .catch((napaka) => {
            prikaziNapako(req, res, napaka);
       });
};

/*================  PRIKAZI PROFILE  =================*/
const profile = ((req, res) => {
    if(typeof req.cookies.token==='undefined'){
      res.redirect('/registracija');
    }
    else{
     pridobiPodrobnostiUporabnika(req, res);
   }
});

const pridobiPodrobnostiUporabnika = (req, res) => {
     axios
          .get(apiParametri.streznik + '/api/profile',  {
            headers: {cookies: req.cookies.token}
          })
          .then((odgovor) => {
                pridobiMojeClanke(req, res, odgovor.data);
          })
          .catch((napaka) => {
               console.log('Error', napaka);
          });
};

const pridobiMojeClanke = (req, res, podrobnostiUporabnika) => {
     axios
          .get(apiParametri.streznik + '/api/profile/moji',  {
            headers: {cookies: req.cookies.token, limita: "3"}
          })
          .then((odgovor) => {
               pridobiPriljubljeneClanke(req, res, podrobnostiUporabnika, odgovor.data)
          })
          .catch((napaka) => {
               prikaziNapako(req, res, napaka);
          });
};

const pridobiPriljubljeneClanke = (req, res, podrobnostiUporabnika, mojiClanki) => {
     axios
          .get(apiParametri.streznik + '/api/profile/priljubljeni',  {
            headers: {cookies: req.cookies.token, limita: "3"}
          })
          .then((odgovor) => {
               prikaziPodrobnostiUporabnika(req, res, podrobnostiUporabnika, mojiClanki, odgovor.data)
          })
          .catch((napaka) => {
               prikaziNapako(req, res, napaka);
          });
};


const pridobiVseMoje = (req, res) => {
     axios
          .get(apiParametri.streznik + '/api/profile/moji',  {
            headers: {cookies: req.cookies.token, limita: "vsi"}
          })
          .then((odgovor) => {
               prikaziVse(req, res, odgovor.data)
          })
          .catch((napaka) => {
               prikaziNapako(req, res, napaka);
          });
};
const pridobiVsePriljubljene = (req, res) => {
     axios
          .get(apiParametri.streznik + '/api/profile/priljubljeni',  {
            headers: {cookies: req.cookies.token, limita: "vsi"}
          })
          .then((odgovor) => {
               prikaziVse(req, res, odgovor.data)
          })
          .catch((napaka) => {
               prikaziNapako(req, res, napaka);
          });
};

const pridobiVseUporabnike = (req, res) => {
     axios
          .get(apiParametri.streznik + '/api/users')
          .then((odgovor) => {
               prikaziVse(req, res, odgovor.data)
          })
          .catch((napaka) => {
               prikaziNapako(req, res, napaka);
          });
};

const novNivoDostopa = (req, res) => {
     axios({
          method: 'put',
          url: apiParametri.streznik + '/api/users/novNivoDostopa/' + req.params.userID+ "/",
          data: {
               novNivo: req.body[req.params.userID],
           }
      })
     .then((odgovor) => {
          res.redirect('/admin');
     }).catch((napaka) => {
      console.log(napaka);
    });
};

const prikaziVse = (req, res, seznamClankov) => {
     var sporocilo = "";
     var moji;
     switch (req.path) {
        case '/prikaziVseMoje':
            console.log(req.path)
            sporocilo = 'objavljenih';
            moji = true;
            break;
        case '/prikaziVsePriljubljene':
            sporocilo = 'priljubljenih';
            moji = false;
            break;
        default:
            sporocilo = 'Kako pa si do sem prišel!?';
            moji = null;
            break;
    };
     res.render('prikaziVse', {
          clanki: seznamClankov,
          stran: sporocilo,
          moji: moji
    });
}

const prikaziPodrobnostiUporabnika = (req, res, podrobnostiUporabnika, seznamMojiClanki, seznamPriljubljeniClanki) => {
  res.render('profile', {
       uporabnik: podrobnostiUporabnika,
       mojiClanki:  seznamMojiClanki,
       priljubljeniClanki: seznamPriljubljeniClanki
 });
};

/*============= FUNKICJA ZA UREJANJE PROFILA ======================*/
const urediProfile = (req, res) => {
     axios
          .get(apiParametri.streznik + '/api/profile',  {
            headers: {cookies: req.cookies.token}
          })
          .then((odgovor) => {
               res.render('profile_edit', {
                 uporabnik: odgovor.data
               });
          })
          .catch((napaka) => {
               prikaziNapako(req, res, napaka);
          });
}

const posodobiProfile = (req, res) => {
     if (!req.body.ime || !req.body.priimek || !req.body.telstevilka) {
          res.render('error', {
               message: "Prišlo je do napake.",
               error: {
                    status: "Niste izpolnili vseh zahtevanih polj!",
                    stack: "Pri urejanju svojega profila ste eno izmed polj ime, priimek, telefonska številka ste pustili prazno. Prosimo izpolnite manjkajoča polja."
               }
          });
     } else {
          axios({
               method: 'put',
               url: apiParametri.streznik + '/api/auth/posodobiProfil',
               headers: {cookies: req.cookies.token},
               data: {
                    ime: req.body.ime,
                    priimek: req.body.priimek,
                    telstevilka: req.body.telstevilka,
                    geslo: req.body.geslo
                }
           })
          .then((odgovor) => {
               res.redirect('/api/signout');
          }).catch((napaka) => {
           prikaziNapako(req, res, napaka);
         });
    }
};

/*============= IZBRIŠI UPORABNIKA =======================*/
const izbrisiProfile = (req, res) => {
     axios
          .delete(apiParametri.streznik + '/api/profile', {
               headers: {cookies: req.cookies.token}
          })
          .then(() => {
               res.redirect('/api/signout');
          })
          .catch((napaka) => {
               prikaziNapako(req, res, napaka);
          });
};


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





module.exports = {
  ostalo,
  db,
  registracija,
  profile,
  pridobiVseMoje,
  pridobiVsePriljubljene,
  admin,
  izbrisiUporabnika,
  novNivoDostopa,
  urediProfile,
  posodobiProfile,
  izbrisiProfile
};
