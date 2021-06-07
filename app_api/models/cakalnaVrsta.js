const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *   VideoEntry:
 *    description: Podatki o posameznem videu
 *    type: object
 *    properties:
 *     id:
 *       type: string
 *       description: ID videa
 *       example: "XIJNGDSRJwU"
 *     title:
 *       type: string
 *       description: Naslov videa
 *       example: "Dogodki tedna 1. 1. 2021"
 *     link:
 *       type: string
 *       description: Povezava do videa
 *       example: "https://www.youtube.com/watch?v=XIJNGDSRJwU"
 *     author:
 *       type: string
 *       description: Naslov kanala, ki je objavil video
 *       example: "Televizija ETV HD"
 *     published:
 *       type: string
 *       description: Čas objave videa
 *       example: 	"2021-01-01T19:45:00+00:00"
 */

 /**
  * @swagger
  * components:
  *  schemas:
  *   ClanekCakalnaVrsta:
  *    type: object
  *    description: Podatki o clanku v cakalni vrsti
  *    properties:
  *     slika:
  *      type: string
  *      description: Slika zapisana v obliki BASE64.
  *      example: data:image/jpeg;base64,/9j/4AAQJ...indqbUMobRRRSuOx//9k=
  *     _id:
  *      type: string
  *      description: Enličen identifikator članka.
  *      example: 5ff09278c4c33933cc96941d
  *     naslov:
  *      type: string
  *      description: naslov članka
  *      example: Drugi tir državna revizijska komisija prvega od sedmih zahtevkov zavrnila
  *     kraj:
  *      type: string
  *      description: Kraj objave
  *      example: Maribor
  *     caption:
  *      type: string
  *      description: Opis vsebine članka
  *      example: Državna revizijska komisija je kot neutemeljenega zavrnila zahtevek za revizijo, ki sta ga v postopku pravnega varstva pri oddaji posla za glavna dela na drugem tiru med Divačo in Koprom skupaj vložili družba Euro-Asfalt iz Sarajeva in turška družba IC Ictas Insaat. Na državni revizijski komisiji je v tej fazi postopka še šest revizijskih zahtevkov.
  *     besedilo:
  *      type: string
  *      description: Vsebina članka
  *      example: Državna revizijska komisija za revizijo postopkov oddaje javnih naročil je na podlagi zahtevka za revizijo, ki sta ga skupaj vložili sarajevska družba Euro-Asfalt in turška družba IC Ictas Insaat Sanayi ve Ticaret, v postopku pravnega varstva pri oddaji javnega naročila Gradnja objektov drugega tira železniške proge - odsek 1 Divača–Črni Kal in Gradnja objektov drugega tira železniške proge - odsek 2 Črni Kal–Koper, naročnika družbe 2TDK, sprejela odločitev, da zahtevek zavrne.\r\n\r\nOmenjeni družbi sta naročniku - projektnemu podjetju 2TDK - očitali kršitve, ker gradbincema ni priznal sposobnosti in ju posledično ne bo povabil k sodelovanju v drugi fazi postopka oziroma k oddaji ponudbe. Z Državne revizijske komisije so danes sporočili, da niso ugotovili zatrjevanih naročnikovih kršitev, saj je ta upravičeno zaključil, da vlagatelja Euroasfalt in IC Ictas Insaat na podlagi naročnikovega poziva nista predložila vseh zahtevanih dokazil o nekaznovanosti za osebe, relevantne v smislu zakona o javnem naročanju (prvi odstavek 75. člena Zakona o javnem naročanju - ZJN-3).\r\n\r\nDržavna revizijska komisija je v postopku pravnega varstva pri oddaji javnega naročila za gradnjo objektov drugega tira železniške proge Divača–Črni Kal in Črni Kal–Koper, naročnika družbe 2TDK, prejela sedem zahtevkov za revizijo. Vlagatelji izpodbijajo odločitev naročnika o priznanju sposobnosti. Komisija je najprej odločala o zahtevku za revizijo, ki sta ga skupaj vložili družbi Euro-Asfalt in IC Ictas Insaat.\r\n\"Naročnik je v pozivu predvidel, da bo zavrnil prijavo, če vlagatelj ne bo predložil vseh zahtevanih dokazil. Ker vlagatelj ni predložil vseh zahtevanih dokazil, je nastopila pravna posledica, predvidena v pozivu - zavrnitev vlagateljeve prijave,\" so pojasnili na komisiji.\r\n\r\nKot so dodali, družbi 2TDK kot naročniku zato ni bilo mogoče očitati kršitev, ko vlagatelju, torej turški in sarajevski družbi, ni priznal sposobnosti za sodelovanje v drugi fazi postopka in ga posledično ne bo povabil k oddaji ponudbe. Državna revizijska komisija je zato (na podlagi prve alineje prvega odstavka 39. člena Zakona o pravnem varstvu v postopkih javnega naročanja - ZPVPJN) zahtevek za revizijo omenjenih vlagateljev kot neutemeljenega zavrnila.\r\n\r\nDržavna revizijska komisija je tako rešila prvega od skupaj sedmih prejetih zahtevkov. Družba 2TDK je medtem prejšnji teden podjetja, ki ostajajo v igri za glavna dela, pozvala k predložitvi ponudbe. Za to imajo čas do 4. januarja.\r\n\r\nSposobnost je 2TDK v prvi fazi razpisa priznal Gorenjski gradbeni družbi v sodelovanju s CGP in češkim Metrostavom ter avstrijskemu Strabagu, ki se je povezal z nemškim podjetjem Ed Züblin in turškim Gülermak Agirom. Prav tako v igri ostajata ponudbi Kolektorja CPG v sodelovanju z Yapi Merkezijem in Özaltinom ter turškega gradbinca Cengiz.
  *     kategorija:
  *      type: string
  *      description: kategorija članka
  *      example: Ekonomija
  *     avtor:
  *      type: string
  *      description: Avtor članka
  *      example: 5fc2bebd885f8c33cc35d534
  *     avtorVzdevek:
  *      type: string
  *      description: Vzdevek avtorja članka
  *      example: blazek26
  *     datum:
  *      type: string
  *      format: date-time
  *      description: Datum objave
  *      example: 2020-11-28T22:04:38.464Z
  *    required:
  *     - naslov
  *     - kraj
  *     - caption
  *     - besedilo
  *     - kategorija
  *     - avtor
  *     - avtorVzdevek
  *     - datum
  *     - _id
  *     - slika
  */

const cakalnaVrstaShema = new mongoose.Schema({
  naslov: {type: String, required: true},
  kraj: {type: String, required: true},
  datum: {type: Date, "default": Date.now},
  caption: {type: String, required: true},
  slika: {type: String, "default": "/assets/images/default-slika.png"},
  besedilo: {type: String, required: true},
  avtor: {type: String, required: true},
  avtorVzdevek: {type: String, required: true},
  kategorija: {type: String, required: true}
});

mongoose.model('cakalnaVrsta', cakalnaVrstaShema, 'cakalnaVrsta');
