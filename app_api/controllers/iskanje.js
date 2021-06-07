const mongoose = require('mongoose');
const Clanek = mongoose.model('clanki', 'clanki');
const Uporabniki = mongoose.model('uporabniki');

var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
    apiParametri.streznik = 'YOUR PRODUCTION URL';
}

const preberiRezultate = (req, res) => {
    Clanek
        .aggregate([
            {
                "$match": { $or: [{"kategorija": {$regex: req.params.iskalniNiz, $options: 'i'}},
                        { "naslov": {$regex: req.params.iskalniNiz, $options: 'i' }},
                        { "caption": {$regex: req.params.iskalniNiz, $options: 'i' }}] }
            }
        ])
        .exec((napaka, prebraniClanki) => {
            if (napaka) {
                return res.status(500).json(napaka);
            } else {
                res.status(200).json(
                    prebraniClanki.map(clanek => {
                        return {
                            "_id": clanek._id,
                            "naslov": clanek.naslov,
                            "slika": clanek.slika,
                            "kategorija": clanek.kategorija,
                            "caption" : clanek.caption,
                            "kraj" : clanek.kraj,
                            "datum" : clanek.datum,
                        };
                    })
                );
            }
        });
};


module.exports = {
    preberiRezultate
};
