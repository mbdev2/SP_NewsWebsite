const express = require('express');
const router = express.Router();
/* Preberi Token */
const jwt = require('express-jwt');
const avtentikacija = jwt({
  secret: process.env.JWT_GESLO,
  userProperty: 'payload',
  algorithms: ['HS256']
});
const ctrlOstalo = require('../controllers/ostalo');
const ctrlClanki = require('../controllers/clanki');
const ctrlKomentarji = require('../controllers/komentarji');
const ctrlUporabniki = require('../controllers/uporabniki');
const ctrlPodstrani =  require('../controllers/podstrani');
const ctrlIskanje = require('../controllers/iskanje');
const ctrlAvtentikacija = require('../controllers/avtentikacija');

/**
 * Kategorije dostopnih točk
 * @swagger
 * tags:
 *  - name: Ostalo
 *    description: Obladovanje stvari, ki niso pokrite v drugih kategorijah
 *  - name: Clanki
 *    description: Obvladovanje prikazovanja člankov
 *  - name: Komentarji
 *    description: Obvladovanje komentarjev v okviru člankov
 *  - name: Uporabniki
 *    description: Obvladovanje uporabnika in profilov
 *  - name: Podstrani
 *    description: Obvladovanje vsebine za prikaz na podstraneh
 *  - name: Iskanje
 *    description: Obvladovanje iskalnih nizov
 *  - name: Avtentikacija
 *    description: Obvladovanje uporabnikov
 */

/**
 * Varnostna shema dostopa
 * @swagger
 * components:
 *  securitySchemes:
 *   jwt:
 *    type: http
 *    scheme: bearer
 *    bearerFormat: JWT
 */


/* Profile po ID */
/**
 * @swagger
 *   /profile:
 *     get:
 *       summary: Prikazovanje uporabnikovega profila.
 *       description: Uporabniku prikaze njegove informacije - vzdevek, ime, priimek, vloga, in mu daje dostop do vseh funkcionalnosti, ki sodijo k njihovem nivoju Uporabnik (urejanje profila, odjava), Avtor (nov članek, urejanje profila, odjava), Novinar (nov članek, urejanje profila, odjava), Urednik (nov članek, urejanje profila, odobravanje člankov, odjava), Admin (nov članek, urejanje profila, odobravanje člankov, admin panel - pregled nad uporabniki, odjava).
 *       tags: [Uporabniki]
 *       security:
 *        - jwt: []
 *       responses:
 *         "200":
 *           description: Uspešna pridobitev podatkov o uporabniku preko JWT žetona.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Uporabnik"
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "404":
 *           description: Iskanega uporabnika nismo našli.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem uporabnika s podanim enoličnim identifikatorjem idUporabnika.
 *         "500":
 *           description: Napaka na strežniku pri registraciji uporabnika.
 */
router.get('/profile', avtentikacija, ctrlOstalo.uporabnikPreberiIzbrano);
/**
 * @swagger
 *   /profile/moji:
 *     get:
 *       summary: Uporabnikovi napisani članki.
 *       description: Pridobitev uporabnikovih lastnih člankov za pregled in urejanje.
 *       tags: [Uporabniki]
 *       security:
 *        - jwt: []
 *       parameters:
 *        - in: header
 *          name: limita
 *          description: Pove koliko člankov želimo da vrne (3 ali vse)
 *          schema:
 *           type: string
 *          required: true
 *          example: 3
 *       responses:
 *         "200":
 *           description: Uspešna pridobitev uporabnikovih člankov.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Clanek"
 *         "400":
 *           description: Iskanega uporabnika nismo našli.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Id uporabnika je obvezen.
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "500":
 *           description: Napaka na strežniku pri registraciji uporabnika.
 */
router.get('/profile/moji', avtentikacija, ctrlOstalo.seznamMojihClankov);
/**
 * @swagger
 *   /profile/priljubljeni:
 *     get:
 *       summary: Uporabnikovi priljubljeni članki.
 *       description: Pridobitev uporabnikovih lastnih člankov za pregled in urejanje.
 *       tags: [Uporabniki]
 *       security:
 *        - jwt: []
 *       parameters:
 *        - in: header
 *          name: limita
 *          description: Pove koliko člankov želimo da vrne (3 ali vse)
 *          schema:
 *           type: string
 *          required: true
 *          example: 3
 *       responses:
 *         "200":
 *           description: Uspešna pridobitev uporabnikovih priljubljenih člankov.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Clanek"
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "404":
 *           description: Iskanega uporabnika nismo našli.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem uporabnika s podanim enoličnim identifikatorjem idUporabnika.
 *         "400":
 *           description: Iskanega uporabnika nismo našli.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Id uporabnika je obvezen.
 *         "500":
 *           description: Napaka na strežniku pri registraciji uporabnika.
 */
router.get('/profile/priljubljeni', avtentikacija, ctrlOstalo.seznamPriljubljenihClankov);

/* Najdi clanek po ID */
/**
 * @swagger
 *   /article/{idClanka}:
 *     get:
 *       summary: Vrnitev članka.
 *       description: Pridobitev podatkov o članku glede na enoličen identifikator člankov za prijavljenega uporabnika.
 *       tags: [Clanki]
 *       security:
 *        - jwt: []
 *       parameters:
 *        - in: path
 *          name: idClanka
 *          description: Enolični identifikator članka.
 *          schema:
 *           type: string
 *          required: true
 *          example: 5feb1b709d89e8138b539e57
 *        - in: header
 *          name: prijavljen
 *          description: Podatek o tem če je uporabnik prijavljen.
 *          schema:
 *           type: string
 *          required: true
 *          example: defined
 *       responses:
 *         "200":
 *           description: Uspešna pridobitev podatkov članka.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/ClanekPrikaz"
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "404":
 *           description: Iskanega uporabnika nismo našli.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem clanka s podanim enoličnim identifikatorjem idClanka.
 *         "500":
 *           description: Napaka na strežniku pri registraciji uporabnika.
 *     delete:
 *       summary: Brisanje članka.
 *       description: Izbris članka.
 *       tags: [Clanki]
 *       security:
 *        - jwt: []
 *       parameters:
 *        - in: path
 *          name: idClanka
 *          description: Enolični identifikator članka.
 *          schema:
 *           type: string
 *          required: true
 *          example: 5fc2c471dbe30a09784b6115
 *       responses:
 *         "204":
 *           description: Uspešno izbrisan članek.
 *         "404":
 *           description: Ne najdem članka.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem clanka s podanim enoličnim identifikatorjem idClanka.
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "500":
 *           description: Napaka na strežniku pri registraciji uporabnika.
 */
router.get('/article/:idClanka', avtentikacija, ctrlClanki.clanekPreberiIzbrano);
/* Izbrisi clanek po ID */

router.delete('/article/:idClanka', avtentikacija, ctrlClanki.clanekIzbrisi);
/**
 * @swagger
 *   /article/{idClanka}/nePrijavljen:
 *     get:
 *       summary: Vrnitev članka.
 *       description: Pridobitev podatkov o članku glede na enoličen identifikator člankov za neprijavljenega uporabnika.
 *       tags: [Clanki]
 *       parameters:
 *        - in: path
 *          name: idClanka
 *          description: Enolični identifikator članka.
 *          schema:
 *           type: string
 *          required: true
 *          example: 5feb1b709d89e8138b539e57
 *        - in: header
 *          name: prijavljen
 *          description: Podatek o tem če je uporabnik prijavljen.
 *          schema:
 *           type: string
 *          required: true
 *          example: undefined
 *       responses:
 *         "200":
 *           description: Uspešna pridobitev podatkov članka.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/ClanekPrikazNePrijavljen"
 *         "404":
 *           description: Iskanega uporabnika nismo našli.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem clanka s podanim enoličnim identifikatorjem idClanka.
 *         "500":
 *           description: Napaka na strežniku pri registraciji uporabnika.
 */
router.get('/article/:idClanka/nePrijavljen', ctrlClanki.clanekPreberiIzbrano);

/* Izbrisi bazo */
/**
 * @swagger
 *   /brisidb:
 *     get:
 *       summary: Brisanje vsebine baze
 *       description: Brisanje vsebine baze MongoDB za app eTV - mora biti avtenticiran
 *       tags: [Ostalo]
 *       security:
 *        - jwt: []
 *       responses:
 *         "200":
 *           description: Uspešna izbrisana baza..
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 */
router.get('/brisidb', avtentikacija, ctrlOstalo.brisiDB);
/* Napolni bazo */
/**
 * @swagger
 *   /polnidb:
 *     get:
 *       summary: Polnjene vsebine baze
 *       description: Poljenje vsebine baze MongoDB za app eTV
 *       tags: [Ostalo]
 *       responses:
 *         "201":
 *           description: Uspešna napolnjena baza..
 *         "500":
 *           description: Prišlo je do napake pri polnjenju.
 */
router.get('/polnidb', ctrlOstalo.polniDB);


/* Vnos Komentarja  v bazo */
/**
 * @swagger
 *   /article/{idClanka}/komentarji:
 *     post:
 *       summary: Dodajanje novega komentarja izbranemu članku.
 *       description: Dodajanje **novega komentarja** s podatki o besedilu komentarja **izbranemu članku** s podanim enoličnim identifikatorjem.
 *       tags: [Komentarji]
 *       security:
 *        - jwt: []
 *       parameters:
 *        - in: path
 *          name: idClanka
 *          description: Enolični identifikator članka.
 *          schema:
 *           type: string
 *          required: true
 *          example: 5fc2c609dbe30a09784b6117
 *       requestBody:
 *        description: Podatki o komentarju
 *        required: true
 *        content:
 *         application/x-www-form-urlencoded:
 *          schema:
 *           $ref: "#/components/schemas/KomentarObjava"
 *       responses:
 *         "201":
 *           description: Uspešno dodan komentar, ki se vrne v rezultatu.
 *           content:
 *            application/json:
 *             schema:
 *              $ref: "#/components/schemas/KomentarBranje"
 *         "400":
 *           description: Napaka pri shranjevanju komentarja.
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "404":
 *           description: Ne najdem članka.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem clanka s podanim enoličnim identifikatorjem idClanka.
 *         "500":
 *           description: Napaka na strežniku pri registraciji uporabnika.
 */
router.route('/article/:idClanka/komentarji').post(avtentikacija, ctrlKomentarji.komentarjiKreiraj);
/**
 * @swagger
 *   /article/{idClanka}/izbrisKomentarja/{idKomentarja}:
 *     delete:
 *       summary: Brisanje komentarja.
 *       description: Brisanje **izbranega komentarja**.
 *       tags: [Komentarji]
 *       security:
 *        - jwt: []
 *       parameters:
 *        - in: path
 *          name: idClanka
 *          description: Enolični identifikator članka.
 *          schema:
 *           type: string
 *          required: true
 *          example: 5fc2c609dbe30a09784b6117
 *        - in: path
 *          name: idKomentarja
 *          description: Enolični identifikator komentarja.
 *          schema:
 *           type: string
 *          required: true
 *          example: 5fc2c976dbe30a09784b611f
 *       responses:
 *         "204":
 *           description: Uspešno izbrisan komentar.
 *         "404":
 *           description: Ne najdem članka oziroma komentarja.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem clanka oz. komentarja, idClanka in idKomentarja sta obvezna parametra.
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "500":
 *           description: Napaka na strežniku pri registraciji uporabnika.
 */
router.delete('/article/:idClanka/izbrisKomentarja/:idKomentarja', avtentikacija, ctrlKomentarji.komentarjiBrisi);

/* Avtentikacija */
/**
 * @swagger
 *   /registracija:
 *     post:
 *       summary: Registracija novega uporabnika
 *       description: Registracija **novega uporabnika** s podatki o imenu, priimku, vzdevku, elektronskem naslovu, telefomski stevilki in geslu.
 *       tags: [Avtentikacija]
 *       requestBody:
 *         description: Podatki za registracijo
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               $ref: "#/components/schemas/UporabnikRegistracija"
 *       responses:
 *         "200":
 *           description: Uspešna registracija uporabnika z JWT žetonom v rezultatu.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/AvtentikacijaOdgovor"
 *         "400":
 *           description: Napaka zahteve, pri registraciji so obvezni ime, elektronski naslov in geslo.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *             examples:
 *               schema:
 *                oneOf:
 *                 - $ref: "#/components/examples/VsiPodatki"
 *                 - $ref: "#/components/examples/EMailNiUstrezen"
 *         "409":
 *           description: Napaka zahteve, uporabnik že obstaja.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Uporabnik s tem elektronskim naslovom je že registriran.
 *
 *         "500":
 *           description: Napaka na strežniku pri registraciji uporabnika.
*/
router.post('/registracija', ctrlAvtentikacija.registracija);
/**
 * @swagger
 *   /prijava:
 *     post:
 *       summary: Prijava obstoječega uporabnika
 *       description: Prijava **obstoječega uporabnika** z elektronskim naslovom in geslom.
 *       tags: [Avtentikacija]
 *       requestBody:
 *         description: Prijavni podatki
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               $ref: "#/components/schemas/UporabnikPrijava"
 *       responses:
 *         "200":
 *           description: Uspešna prijava uporabnika z JWT žetonom v rezultatu.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/AvtentikacijaOdgovor"
 *         "400":
 *           description: Napaka zahteve, pri prijavi sta obvezna elektronski naslov in geslo.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Zahtevani so vsi podatki.
 *         "401":
 *           description: Napaka pri prijavi uporabnika.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               examples:
 *                 uporabniško ime:
 *                   value:
 *                     sporočilo: Napačno uporabniško ime.
 *                   summary: napačno uporabniško ime
 *                 geslo:
 *                   value:
 *                     sporočilo: Napačno geslo.
 *                   summary: napačno geslo
 *         "500":
 *           description: Napaka na strežniku pri preverjanju uporabnika.
*/
router.post('/prijava', ctrlAvtentikacija.prijava);


// router.put('/auth/posodobiProfil', ctrlAuth.posodobiProfil); // treba ponovno implementirat

/* Izbrisi uporabnika po ID */
// router.delete('/profile', avtentikacija, ctrlAuth.izbrisiProfil); // treba ponovno impleemntirat

/* Vnos Clanka v bazo */
/**
 * @swagger
 *   /mediainput:
 *     post:
 *       summary: Kreiranje novega članka.
 *       description: kreiranje **novega članka** s podatki o kategoriji, naslovu, sliki, opisom in besedilom članka.
 *       tags: [Clanki]
 *       security:
 *        - jwt: []
 *       requestBody:
 *         description: Podatki za kreiranje članka.
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               $ref: "#/components/schemas/ClanekObjava"
 *       responses:
 *         "200":
 *           description: Uspešno kreiran nov članek.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/ClanekNovi"
 *         "400":
 *           description: Napaka pri kreiranju članka.
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               examples:
 *                 uporabniško ime:
 *                   value:
 *                     sporočilo: Napačno uporabniško ime.
 *                   summary: napačno uporabniško ime
 *                 geslo:
 *                   value:
 *                     sporočilo: Napačno geslo.
 *                   summary: napačno geslo
 *         "500":
 *           description: Napaka na strežniku pri preverjanju uporabnika.
*/
router.route('/mediainput').post(avtentikacija, ctrlClanki.clanekKreiraj);

/* Posodobitev Clanka v bazi */
/**
 * @swagger
 *   /mediainput/{idClanka}:
 *     put:
 *       summary: Posodabljanje članka.
 *       description: Posodabljanje **izbranega članka** s podatki o kategoriji, naslovu, sliki, opisom in besedilom članka.
 *       tags: [Clanki]
 *       security:
 *        - jwt: []
 *       requestBody:
 *         description: Podatki za posodabljanje članka.
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               $ref: "#/components/schemas/ClanekObjava"
 *       parameters:
 *        - in: path
 *          name: idClanka
 *          description: Enolični identifikator članka.
 *          schema:
 *           type: string
 *          required: true
 *          example: 5fc2c609dbe30a09784b6117
 *       responses:
 *         "200":
 *           description: Uspešna posodobljen članek.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Clanek"
 *         "400":
 *           description: Napaka pri posodabljanju članka.
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "500":
 *           description: Napaka na strežniku.
*/
router.put('/mediainput/:idClanka', avtentikacija, ctrlClanki.clanekPosodobi);



/**
 * @swagger
 *  /Danes/{page}:
 *   get:
 *    summary: Vrnitev člankov, ki spadajo v kategorijo danes. Pregledovanje je možno po straneh, če je člankov več kot 10.
 *    description: Pridobitev **seznama člankov v kategoriji danes** s podatki o idju, naslovu, sliki in kategoriji.
 *    tags: [Podstrani]
 *    parameters:
 *     - in: path
 *       name: page
 *       description: številka, ki pove na kateri strani se uporabnik nahaja med pregledovanjem člankov kategorije. Kjer je člankov manj ali enako 10, je vedno stran enaka 1.
 *       schema:
 *        type: number
 *       required: true
 *       example: 1
 *    responses:
 *     "200":
 *      description: Uspešna zahteva s seznamom člankov kategorije danes v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: "#/components/schemas/ClanekKategorije"
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.
 */
/* Pridobi članke v isti kategoriji */
router.get('/Danes/:page', ctrlPodstrani.preberiClankeKategorije);
/**
 * @swagger
 *  /Ekonomija/{page}:
 *   get:
 *    summary: Vrnitev člankov, ki spadajo v kategorijo ekonomija. Pregledovanje je možno po straneh, če je člankov več kot 10.
 *    description: Pridobitev **seznama člankov v kategoriji ekonomija** s podatki o idju, naslovu, sliki in kategoriji.
 *    tags: [Podstrani]
 *    parameters:
 *     - in: path
 *       name: page
 *       description: številka, ki pove na kateri strani se uporabnik nahaja med pregledovanjem člankov kategorije. Kjer je člankov manj ali enako 10, je vedno stran enaka 1.
 *       schema:
 *        type: number
 *       required: true
 *       example: 1
 *    responses:
 *     "200":
 *      description: Uspešna zahteva s seznamom člankov kategorije ekonomija v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: "#/components/schemas/ClanekKategorije"
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.
 */
router.get('/Ekonomija/:page', ctrlPodstrani.preberiClankeKategorije);
/**
 * @swagger
 *  /Izobrazba/{page}:
 *   get:
 *    summary: Vrnitev člankov, ki spadajo v kategorijo izobrazba. Pregledovanje je možno po straneh, če je člankov več kot 10.
 *    description: Pridobitev **seznama člankov v kategoriji izobrazba** s podatki o idju, naslovu, sliki in kategoriji.
 *    tags: [Podstrani]
 *    parameters:
 *     - in: path
 *       name: page
 *       description: številka, ki pove na kateri strani se uporabnik nahaja med pregledovanjem člankov kategorije. Kjer je člankov manj ali enako 10, je vedno stran enaka 1.
 *       schema:
 *        type: number
 *       required: true
 *       example: 1
 *    responses:
 *     "200":
 *      description: Uspešna zahteva s seznamom člankov kategorije izobrazba v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: "#/components/schemas/ClanekKategorije"
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.
 */
router.get('/Izobrazba/:page', ctrlPodstrani.preberiClankeKategorije);
/**
 * @swagger
 *  /Covid/{page}:
 *   get:
 *    summary: Vrnitev člankov, ki spadajo v kategorijo covid. Pregledovanje je možno po straneh, če je člankov več kot 10.
 *    description: Pridobitev **seznama člankov v kategoriji covid** s podatki o idju, naslovu, sliki in kategoriji.
 *    tags: [Podstrani]
 *    parameters:
 *     - in: path
 *       name: page
 *       description: številka, ki pove na kateri strani se uporabnik nahaja med pregledovanjem člankov kategorije. Kjer je člankov manj ali enako 10, je vedno stran enaka 1.
 *       schema:
 *        type: number
 *       required: true
 *       example: 1
 *    responses:
 *     "200":
 *      description: Uspešna zahteva s seznamom člankov kategorije covid v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: "#/components/schemas/ClanekKategorije"
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.
 */
router.get('/Covid/:page', ctrlPodstrani.preberiClankeKategorije);
/**
 * @swagger
 *  /Kultura/{page}:
 *   get:
 *    summary: Vrnitev člankov, ki spadajo v kategorijo kultura. Pregledovanje je možno po straneh, če je člankov več kot 10.
 *    description: Pridobitev **seznama člankov v kategoriji kultura** s podatki o idju, naslovu, sliki in kategoriji.
 *    tags: [Podstrani]
 *    parameters:
 *     - in: path
 *       name: page
 *       description: številka, ki pove na kateri strani se uporabnik nahaja med pregledovanjem člankov kategorije. Kjer je člankov manj ali enako 10, je vedno stran enaka 1.
 *       schema:
 *        type: number
 *       required: true
 *       example: 1
 *    responses:
 *     "200":
 *      description: Uspešna zahteva s seznamom člankov kategorije kultura v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: "#/components/schemas/ClanekKategorije"
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.
 */
router.get('/Kultura/:page', ctrlPodstrani.preberiClankeKategorije);
/**
 * @swagger
 *  /Sport/{page}:
 *   get:
 *    summary: Vrnitev člankov, ki spadajo v kategorijo šport. Pregledovanje je možno po straneh, če je člankov več kot 10.
 *    description: Pridobitev **seznama člankov v kategoriji šport** s podatki o idju, naslovu, sliki in kategoriji.
 *    tags: [Podstrani]
 *    parameters:
 *     - in: path
 *       name: page
 *       description: številka, ki pove na kateri strani se uporabnik nahaja med pregledovanjem člankov kategorije. Kjer je člankov manj ali enako 10, je vedno stran enaka 1.
 *       schema:
 *        type: number
 *       required: true
 *       example: 1
 *    responses:
 *     "200":
 *      description: Uspešna zahteva s seznamom člankov kategorije šport v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: "#/components/schemas/ClanekKategorije"
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.
 */
router.get('/Sport/:page', ctrlPodstrani.preberiClankeKategorije);
/**
 * @swagger
 *  /steviloClankov/{kategorija}:
 *   get:
 *    summary: Vrnitev števila člankov, ki spadajo v določeno kategorijo.
 *    description: Pridobitev **števila člankov v eni kategoriji**.
 *    tags: [Podstrani]
 *    parameters:
 *     - in: path
 *       name: kategorija
 *       description: Kategorija po kateri iščemo število člankov ene kategorije. Mora biti z veliko začetnico in brez šumnikov.
 *       schema:
 *        type: string
 *       required: true
 *       example: Ekonomija
 *    responses:
 *     "200":
 *      description: Uspešna zahteva s številom člankov ene kategorije v rezultatu.
 *      content:
 *       application/json:
 *        example: 4
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.
 */
router.get('/steviloClankov/:kategorija', ctrlPodstrani.pridobiSteviloClankovVKategoriji);

/* Pridobi vse uporabnike*/
/**
 * @swagger
 *   /users:
 *     get:
 *       summary: Pridobitev vseh uporabnikov
 *       description: Pridobi json tabelo vseh uporabnikov.
 *       tags: [Uporabniki]
 *       security:
 *        - jwt: []
 *       responses:
 *         "200":
 *           description: Uspešna poizvedba na APIju
 *           content:
 *             application/json:
 *               schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Uporabnik"
 *         "404":
 *           description: Nismo našli uporabnikov.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem nobenega uporabnika.
 *         "500":
 *           description: Napaka na strežniku.
 */
router.get('/users', avtentikacija, ctrlUporabniki.pridobiVseUporabnike);
/**
 * @swagger
 *   /users/izbrisi:
 *     delete:
 *       summary: Brisanje uporabniki.
 *       description: Brisanje **izbranega uporabnika**.
 *       tags: [Uporabniki]
 *       security:
 *        - jwt: []
 *       parameters:
 *        - in: header
 *          name: uporabnik
 *          description: Enolični identifikator uporabnika, če uporabnika briše admin (sicer se oridobi iz žetona).
 *          schema:
 *           type: string
 *          required: true
 *          example: 5fc2b7e34be256386c6b96ef
 *       responses:
 *         "204":
 *           description: Uspešno izbrisan uporabnik.
 *         "404":
 *           description: Ne najdem uporabnika.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem uporabnika.
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "500":
 *           description: Napaka na strežniku.
 */
router.delete('/users/izbrisi', avtentikacija, ctrlUporabniki.izbrisiUporabnika);
/**
 * @swagger
 *   /users/novNivoDostopa:
 *     put:
 *       summary: Posodabljanje uporabnikovega nivoja dostopa.
 *       description: Posodabljanje **izbranega uporabnika** s podatki o imenu, priimku, telefonski številki in po želji geslu.
 *       tags: [Uporabniki]
 *       security:
 *        - jwt: []
 *       parameters:
 *        - in: header
 *          name: novNivo
 *          description: Nivo na katerega želimo izbranega uporabnika posodobiti.
 *          schema:
 *           type: string
 *          required: true
 *          example: urednik
 *        - in: header
 *          name: uporabnik
 *          description: Enolični identifikator uporabnika ki ga posodabljamo.
 *          schema:
 *           type: string
 *          required: true
 *          example: 5fc2b7e34be256386c6b96ef
 *       responses:
 *         "200":
 *           description: Uspešna posodobitev profila izbranega uporabnika.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Uporabnik"
 *         "400":
 *           description: Napaka pri posodabljanju profila.
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "404":
 *           description: Iskanega uporabnika nismo našli.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem uporabnika.
 *         "500":
 *           description: Napaka na strežniku.
 */
router.put('/users/novNivoDostopa', avtentikacija, ctrlUporabniki.posodobiUporabnika);
/**
 * @swagger
 *   /profile/posodobi:
 *     put:
 *       summary: Posodabljanje profila.
 *       description: Posodabljanje **izbranega uporabnika** s podatki o imenu, priimku, telefonski številki in po želji geslu.
 *       tags: [Uporabniki]
 *       security:
 *        - jwt: []
 *       requestBody:
 *         description: Podatki za posodabljanje profila.
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               $ref: "#/components/schemas/UporabnikPosodobi"
 *       parameters:
 *        - in: header
 *          name: geslo
 *          description: Novo geslo uporabnika.
 *          schema:
 *           type: string
 *           format: password
 *          example: Nekajvarnega5
 *       responses:
 *         "200":
 *           description: Uspešna posodobitev profila izbranega uporabnika.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Uporabnik"
 *         "400":
 *           description: Napaka pri posodabljanju profila.
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "404":
 *           description: Iskanega uporabnika nismo našli.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem uporabnika s podanim enoličnim identifikatorjem idUporabnika.
 *         "500":
 *           description: Napaka na strežniku.
 */
router.put('/profile/posodobi', avtentikacija, ctrlUporabniki.posodobiProfil);

/**
 * @swagger
 *   /jePriljubljen/{idClanka}:
 *     get:
 *       summary: Pridobitev podatka o priljubljenosti.
 *       description: Pridobimo podatek o tem če je **izbran članek** za **prijavljenega uporabnika** priljubljen ali ne.
 *       tags: [Clanki]
 *       security:
 *        - jwt: []
 *       parameters:
 *        - in: path
 *          name: idClanka
 *          description: Enolični identifikator članka.
 *          schema:
 *           type: string
 *          required: true
 *          example: 5fc2c609dbe30a09784b6117
 *       responses:
 *         "200":
 *           description: Uspešna poizvedba na APIju
 *           content:
 *             application/json:
 *              example:
 *               oneOf:
 *                - priljubljen
 *                - nePriljubljen
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "404":
 *           description: Nismo našli uporabnikov.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem clanka s podanim enoličnim identifikatorjem idClanka.
 *         "500":
 *           description: Napaka na strežniku.
 */
router.get('/jePriljubljen/:idClanka', avtentikacija, ctrlClanki.jePriljubljen);
/**
 * @swagger
 *   /dodajMedPriljubljene/{idClanka}:
 *     get:
 *       summary: Dodajanje članka med priljubljene.
 *       description: Za **prijavljenega uporabnika** dodamo **izbran članek** med priljubljene.
 *       tags: [Clanki]
 *       security:
 *        - jwt: []
 *       parameters:
 *        - in: path
 *          name: idClanka
 *          description: Enolični identifikator članka.
 *          schema:
 *           type: string
 *          required: true
 *          example: 5fc2c609dbe30a09784b6117
 *       responses:
 *         "201":
 *           description: Uspešna dodaja članka med uporabnikove priljubljene članke.
 *           content:
 *             application/json:
 *              example: 5fc2c609dbe30a09784b6117
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "404":
 *           description: Nismo našli uporabnikov.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem clanka s podanim enoličnim identifikatorjem idClanka.
 *         "500":
 *           description: Napaka na strežniku.
 */
router.get('/dodajMedPriljubljene/:idClanka', avtentikacija, ctrlClanki.dodajMedPriljubljene);
/**
 * @swagger
 *   /odstraniIzPriljubljenih/{idClanka}:
 *     get:
 *       summary: Odstranitev članka med priljubljene.
 *       description: Za **prijavljenega uporabnika** odstranimo **izbran članek** med priljubljene.
 *       tags: [Clanki]
 *       security:
 *        - jwt: []
 *       parameters:
 *        - in: path
 *          name: idClanka
 *          description: Enolični identifikator članka.
 *          schema:
 *           type: string
 *          required: true
 *          example: 5fc2c609dbe30a09784b6117
 *       responses:
 *         "204":
 *           description: Uspešen izbris članka iz uporabnikovih priljubljenih člankov.
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             examples:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "404":
 *           description: Nismo našli uporabnikov.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem clanka s podanim enoličnim identifikatorjem idClanka.
 *         "500":
 *           description: Napaka na strežniku.
 */
router.get('/odstraniIzPriljubljenih/:idClanka', avtentikacija, ctrlClanki.odstraniIzPriljubljenih);


/**
 * @swagger
 *   /cakalnaVrsta:
 *     get:
 *       summary: Pridobitev vseh člankov v čakalni vrsti
 *       description: Pridobi json tabelo vseh člankov v čakalni vrsti
 *       tags: [Clanki]
 *       security:
 *        - jwt: []
 *       responses:
 *         "200":
 *           description: Uspešna poizvedba na APIju
 *           content:
 *             application/json:
 *               schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/ClanekCakalnaVrsta"
 *         "404":
 *           description: Ne najdem članka s podanim IDjem.
 *         "401":
 *           description: Nimate pravic za ogled.
 *         "500":
 *           description: Napaka na strežniku.
 */
router.get('/cakalnaVrsta', avtentikacija, ctrlClanki.cakalnaVrsta);
/**
 * @swagger
 *   /overview/{idClanka}:
 *     delete:
 *       summary: Brisanje članka iz čakalne vrste.
 *       description: Članek izbrišemo iz čakalne vrste in ga zavržemo.
 *       tags: [Clanki]
 *       security:
 *        - jwt: []
 *       parameters:
 *        - in: path
 *          name: idClanka
 *          description: Enolični identifikator članka.
 *          schema:
 *           type: string
 *          required: true
 *          example: 5fc2b9ce4be256386c6b96f0
 *       responses:
 *         "204":
 *           description: Uspešno izbrisan članek.
 *         "404":
 *           description: Ne najdem članka.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem clanka s podanim enoličnim identifikatorjem idClanka.
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *         "500":
 *           description: Napaka na strežniku.
 */
router.delete('/overview/:idClanka', avtentikacija, ctrlClanki.izbrisiClanekOdobritev);
/**
 * @swagger
 *   /cakalnaVrsta/{idClanka}:
 *     get:
 *       summary: Objava čakajočega članka.
 *       description: Javno objavi članek s podanim identifikatorjem idClanka iz čakalne vrste.
 *       tags: [Clanki]
 *       security:
 *        - jwt: []
 *       parameters:
 *        - in: path
 *          name: idClanka
 *          description: Enolični identifikator članka.
 *          schema:
 *           type: string
 *          required: true
 *          example: 5fc2bab84be256386c6b96f1
 *       responses:
 *         "200":
 *           description: Uspešna objava članka.
 *         "401":
 *           description: Napaka pri dostopu.
 *           content:
 *             application/json:
 *              schema:
 *               $ref: "#/components/schemas/Napaka"
 *             example:
 *              schema:
 *                $ref: "#/components/examples/NiZetona"
 *         "404":
 *           description: Iskanega clanka nismo našli.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Napaka"
 *               example:
 *                 sporočilo: Ne najdem clanka s podanim enoličnim identifikatorjem idClanka.
 *         "500":
 *           description: Napaka na strežniku.
 */
router.get('/cakalnaVrsta/:idClanka', avtentikacija, ctrlClanki.objaviCakajocClanek);

/**
 * @swagger
 *  /rezultati/{iskalniNiz}:
 *   get:
 *    summary: Vrnitev člankov, ki se ujemajo z iskalnim nizom
 *    description: Pridobitev **rezultatov iskanja** s podatki o naslovu, sliki, kategoriji, captionu, kraju in datumu iskanih člankov.
 *    tags: [Iskanje]
 *    parameters:
 *     - in: path
 *       name: iskalniNiz
 *       description: iskalni niz, ki ga uporabnik vnese v vnosno poljo za iskanje
 *       schema:
 *        type: string
 *       required: true
 *       example: danes
 *    responses:
 *     "200":
 *      description: Uspešna zahteva s seznamom najdenih člankov v rezultatu.
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: "#/components/schemas/ClanekRezultatIskanja"
 *     "500":
 *      description: Napaka na strežniku pri dostopu do podatkovne baze.
 */

/* Preberi rezultate iskanja*/
router.get('/rezultati/:iskalniNiz', ctrlIskanje.preberiRezultate);

/* PridobiVideoteko */
router.get('/videoteka', ctrlOstalo.videoteka);

/**
 * @swagger
 *   /videoteka:
 *     get:
 *       summary: Pridobitev videoposnetkov iz YouTube kanala
 *       description: Pošlje get zahtevo za pridobitev informacij o zadnjih videih na YouTube kanalu Televizija ETV
 *       tags: [Podstrani]
 *       responses:
 *         "200":
 *           description: Uspešna poizvedba na YouTubu
 *           content:
 *             application/json:
 *               schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/VideoEntry"
 *         "500":
 *           description: Napaka na strežniku.
*/

module.exports = router;
