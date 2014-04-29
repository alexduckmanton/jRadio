var request = require('request');

module.exports = {
    unearthed: function(req, res) {
        request("http://www.kimonolabs.com/api/4i2op28c?apikey=01269db6385d23351cd7f152819e9550", function(err, response, body) {
            res.json(JSON.parse(body).results.tracks);
        });
    },
    unearthed_artist: function(req, res) {
        var artist_name = req.query.name;
        request({
            uri: "http://www.kimonolabs.com/api/67czbtsm?apikey=01269db6385d23351cd7f152819e9550",
            qs: { 'kimpath2': artist_name }
        }, function(err, response, body) {
            res.json(JSON.parse(body));
        });
    },
    unearthed_track: function(req, res) {
        var id = req.query.id;
        request({
            uri: "https://www.triplejunearthed.com/api/jukebox/rest/views/jukebox_track",
            qs: { 'args': id }
        }, function(err, response, body) {
            res.json(JSON.parse(body));
        });
    },
    unearthed_featured: function(req, res) {
        request("http://www.kimonolabs.com/api/2kgevg1u?apikey=01269db6385d23351cd7f152819e9550", function(err, response, body) {
            res.json(JSON.parse(body).results.featured);
        });
    }
}
