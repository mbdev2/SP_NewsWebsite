const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * components:
 *  schemas:
 *   UporabnikPrijava:
 *    type: object
 *    description: Podatki uporabnika za prijavo
 *    properties:
 *     email:
 *      type: string
 *      description: elektronski naslov
 *      example: mark@ltfe.org
 *     geslo:
 *      type: string
 *      format: password
 *      example: Test1234
 *    required:
 *     - email
 *     - geslo
 *   UporabnikRegistracija:
 *    type: object
 *    description: Podatki uporabnika za registracijo
 *    properties:
 *     ime:
 *      type: string
 *      description: ime
 *      writeOnly: true
 *      example: Matjaž
 *     priimek:
 *      type: string
 *      description: priimek
 *      example: Bevc
 *     vzdevek:
 *      type: string
 *      description: vzdevek
 *      example: bevci
 *     email:
 *      type: string
 *      description: elektronski naslov
 *      example: mark@ltfe.org
 *     telstevilka:
 *      type: string
 *      description: telefonska stevilka
 *      example: 040 420 690
 *     geslo:
 *      type: string
 *      format: password
 *      example: Test1234
 *    required:
 *     - ime
 *     - priimek
 *     - vzdevek
 *     - email
 *     - telstevilka
 *     - geslo
 *   AvtentikacijaOdgovor:
 *    type: object
 *    description: Rezultat uspešne avtentikacije uporabnika
 *    properties:
 *     žeton:
 *      type: string
 *      description: JWT žeton
 *      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmMyYjc4ZjRiZTI1NjM4NmM2Yjk2ZWQiLCJlbWFpbCI6Im1hcmsuYnJlem5pa0BnbWFpbC5jb20iLCJpbWUiOiJNYXJrIiwiZXhwIjoxNjA5OTQzMDk1LCJpYXQiOjE2MDkzMzgyOTV9.rsZiAaY4-5RdWFIMbYsAODzkbqibm_nwWdgKV6ai4yk
 *    required:
 *     - žeton
 *   Napaka:
 *    type: object
 *    description: Podrobnosti napake
 *    required:
 *     - sporočilo
 *    properties:
 *     sporočilo:
 *      type: string
 *    example:
 *     sporočilo: Parametri so obvezni.
 *   Uporabnik:
 *    type: object
 *    description: Podatki uporabnika
 *    properties:
 *     _id:
 *      type: string
 *      description: Enoličen identifikator uporabnika
 *      example: 5fef8f232be4e2219c573ddc
 *     ime:
 *      type: string
 *      description: ime
 *      writeOnly: true
 *      example: Matjaž
 *     priimek:
 *      type: string
 *      description: priimek
 *      example: Bevc
 *     vzdevek:
 *      type: string
 *      description: vzdevek
 *      example: bevci
 *     email:
 *      type: string
 *      description: elektronski naslov
 *      example: mark@ltfe.org
 *     telstevilka:
 *      type: string
 *      description: telefonska stevilka
 *      example: 040 420 690
 *     nakljucnaVrednost:
 *      type: string
 *      description: naključna vrednost za gesla
 *      example: bb89982a552023e530c96629b2da3ff1
 *     zgoscenaVrednost:
 *      type: string
 *      description: zgoscena vrednost gesla
 *      example: cac87873bc00d828515ad9c38b426facd5aa5938022ee774ea2cad1ea58c64cddeb54903db329678e7f98d68cc4272a917f9c5c371ca47afc3c9486357b11ee8
 *     nivodostopa:
 *      type: string
 *      description: nivo dostopa
 *      example: avtor
 *     priljubljeniClanki:
 *      type: array
 *      description: tabela IDjev uporabnikovih priljubljenih clankov
 *      items:
 *        type: string
 *        example: "5fc2bfe0dbe30a09784b610f"
 *    required:
 *     - ime
 *     - priimek
 *     - vzdevek
 *     - email
 *     - telstevilka
 *     - nakljucnaVrednost
 *     - zgoscenaVrednost
 *     - nivodostopa
 *     - priljubljeniClanki
 *   UporabnikPosodobi:
 *    type: object
 *    description: Podatki uporabnika
 *    properties:
 *     ime:
 *      type: string
 *      description: ime
 *      writeOnly: true
 *      example: Matjaž
 *     priimek:
 *      type: string
 *      description: priimek
 *      example: Bevc
 *     telstevilka:
 *      type: string
 *      description: telefonska stevilka
 *      example: 040 420 690
 *    required:
 *     - ime
 *     - priimek
 *     - telstevilka
 */

const uporabnikiShema = new mongoose.Schema({
  ime: {type: String, required: true},
  priimek: {type: String, required: true},
  vzdevek: {type: String, required: true},
  email: {type: String, required: true},
  telstevilka: {type: String, required: true},
  nakljucnaVrednost: {type: String, required: true},
  zgoscenaVrednost: {type: String, required: true},
  nivodostopa: {type: String, "default": "avtor"},
  priljubljeniClanki: {type: Array}
});

uporabnikiShema.methods.nastaviGeslo = function (geslo) {
  this.nakljucnaVrednost = crypto.randomBytes(16).toString('hex');
  this.zgoscenaVrednost = crypto
    .pbkdf2Sync(geslo, this.nakljucnaVrednost, 1000, 64, 'sha512')
    .toString('hex');
};

uporabnikiShema.methods.preveriGeslo = function (geslo) {
  let zgoscenaVrednost = crypto
    .pbkdf2Sync(geslo, this.nakljucnaVrednost, 1000, 64, 'sha512')
    .toString('hex');
  return this.zgoscenaVrednost == zgoscenaVrednost;
};

uporabnikiShema.methods.generirajJwt = function () {
  const datumPoteka = new Date();
  datumPoteka.setDate(datumPoteka.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    ime: this.ime,
    exp: parseInt(datumPoteka.getTime() / 1000, 10)
  }, process.env.JWT_GESLO);
};

mongoose.model('uporabniki', uporabnikiShema, 'uporabniki');

/**
 * @swagger
 *  components:
 *   examples:
 *    NiZetona:
 *     summary: ni JWT žetona
 *     value:
 *      sporočilo: "UnauthorizedError: No authorization token was found."
 *    VsiPodatki:
 *     summary: zahtevani so vsi podatki
 *     value:
 *      sporočilo: Zahtevani so vsi podatki.
 *    EMailNiUstrezen:
 *     summary: elektronski naslov ni ustrezen
 *     value:
 *      sporočilo: Elektronski naslov ni ustrezen!
 */
