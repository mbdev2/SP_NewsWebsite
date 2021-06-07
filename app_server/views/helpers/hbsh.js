const hbs = require('hbs');

hbs.registerHelper('formatirajDatum', (nizDatum) => {
  const datum = new Date(nizDatum);
  const imenaMesecev = ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"];
  const d = datum.getDate();
  const m = imenaMesecev[datum.getMonth()];
  const l = datum.getFullYear();
  return `${d}. ${m}, ${l}`;
});

hbs.registerHelper('if_jeKajClankov', (seznam, options) => {
     if(seznam.length < 1) {
          return options.fn(this);
     } else {
          return options.inverse(this);
     }
});
hbs.registerHelper('if_jeKajClankovObratno', (seznam, options) => {
     if(seznam.length >= 1) {
          return options.fn(this);
     } else {
          return options.inverse(this);
     }
});
hbs.registerHelper('steviloMojih', (seznam) => {
     return seznam.length
});

hbs.registerHelper('primerjaj', (podatek1, podatek2, moznosti) => {
     return (podatek1 == podatek2) ? moznosti.fn(this) : moznosti.inverse(this);
});

hbs.registerHelper('if_jeMojKomentar', (tabela, komentar, moznosti) => {
     return (tabela.includes(komentar)) ? moznosti.fn(this) : moznosti.inverse(this);
});
