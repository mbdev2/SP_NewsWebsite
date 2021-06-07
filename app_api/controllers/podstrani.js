const mongoose = require('mongoose');
const Clanek = mongoose.model('clanki');

var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
    apiParametri.streznik = 'YOUR PRODUCTION URL';
}

const pridobiSteviloClankovVKategoriji = (req,  res) => {
    let kategorijaIsci = req.params.kategorija;
    if (kategorijaIsci[0] == 'S'){
        kategorijaIsci = 'Š' + kategorijaIsci.slice(1);
    }
    Clanek
        .aggregate([
            {
                "$match" : { "kategorija": kategorijaIsci }
            }
        ])
        .exec((napaka, prebraniClanki) => {
            if (napaka) {
                res.status(500).json(napaka);
            } else {
                res.status(200).json(
                    prebraniClanki.length
                );
            }
        });
}


//funkcija ki iz baze prebere tiste članke ki so v podani kategoriji in jih shrani v seznam
const preberiClankeKategorije = (req, res) => {
    //pridobim zadnjo besedo v url, ki bo string in bom po njej iskala članke v bazi
    const zadnjaBeseda = req.path.split('/');
    let kategorijaIsci = zadnjaBeseda[1];
    if (kategorijaIsci[0] == 'S'){
        kategorijaIsci = 'Š' + kategorijaIsci.slice(1);
    }
    let clankiZacetek = (req.params.page -1)*10 || 0;
    console.log(kategorijaIsci)

    Clanek
        .aggregate([
            {
                "$match" : { "kategorija": kategorijaIsci }
            },
            {
                "$skip": clankiZacetek
            },
            {
                "$limit": 10
            }
        ])
        .exec((napaka, prebraniClanki) => {
            if (napaka) {
                res.status(500).json(napaka);
            } else {
                res.status(200).json(
                    prebraniClanki.map(clanek => {
                        return {
                            "_id": clanek._id,
                            "naslov": clanek.naslov,
                            "slika": clanek.slika,
                            "kategorija": clanek.kategorija
                        };
                    })
                );
            }
        });
};



module.exports = {
    preberiClankeKategorije,
    pridobiSteviloClankovVKategoriji
}
