var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlOstalo = require('../controllers/ostalo');
var ctrlClanki = require('../controllers/clanki');
var ctrlPodstrani =  require('../controllers/podstrani');
var ctrlZunanji =  require('../controllers/zunanji');
var ctrlIskanje = require('../controllers/iskanje');
/* GET home page. */
router.get('/', ctrlMain.pridobiAktualno);
/* GET db page. */
router.get('/db', ctrlOstalo.db);
/* stran za prikaz napake */
router.get('/napaka', ctrlMain.prikaziNapako);
/* GET ostalo page. */
router.get('/ostalo', ctrlOstalo.ostalo);
router.get('/registracija', ctrlOstalo.registracija);

router.get('/profile', ctrlOstalo.profile);
router.get('/profile/uredi', ctrlOstalo.urediProfile);
router.post('/profile/posodobiProfil', ctrlOstalo.posodobiProfile);
router.get('/profile/izbrisi', ctrlOstalo.izbrisiProfile);
router.get('/prikaziVseMoje', ctrlOstalo.pridobiVseMoje);
router.get('/prikaziVsePriljubljene', ctrlOstalo.pridobiVsePriljubljene);

router.get('/mediainput', ctrlClanki.mediainput);
router.post('/mediainput', ctrlClanki.mediainputPost);
router.post('/mediainput/put/:idClanka', ctrlClanki.mediainputPut);

router.get('/article/:idClanka', ctrlClanki.article);
router.get('/dodajMedPriljubljene/:idClanka', ctrlClanki.dodajMedPriljubljene);
router.get('/odstraniIzPriljubljenih/:idClanka', ctrlClanki.odstraniIzPriljubljenih);
router.post('/article/:idClanka/komentarji', ctrlClanki.shraniKomentar);
router.get('/article/:idClanka/izbrisKomentarja/:idKomentarja', ctrlClanki.izbrisiKomentar);
router.get('/article/uredi/:idClanka', ctrlClanki.urediClanek);
router.get('/article/izbrisi/:idClanka', ctrlClanki.izbrisiClanek);

/* Usmerjanje za podstrani*/
router.get('/danes', ctrlPodstrani.pridobiAktualno);
router.get('/ekonomija', ctrlPodstrani.pridobiEkonomijo);
router.get('/izobrazba', ctrlPodstrani.pridobiIzobraževanje);
router.get('/covid', ctrlPodstrani.pridobiCovid);
router.get('/kultura', ctrlPodstrani.pridobiKultura);
router.get('/sport', ctrlPodstrani.pridobiŠport);

router.get('/admin', ctrlOstalo.admin);
router.get('/admin/delete/:userID', ctrlOstalo.izbrisiUporabnika);
router.post('/admin/novNivoDostopa/:userID', ctrlOstalo.novNivoDostopa);

router.get('/videoteka',ctrlZunanji.videoteka);

router.get('/approval', ctrlClanki.pridobiVseOdobritev);
router.get('/overview/delete/:idClanka', ctrlClanki.izbrisiClanekOdobritev);
router.get('/overview/post/:idClanka', ctrlClanki.objaviClanekOdobritev);


router.get('/rezultatiIskanja', ctrlIskanje.pridobiRezultate);

router.get('/live', ctrlZunanji.pridobiLive);


module.exports = router;
