var request = require('request');

module.exports = {
    recent: function(req, res) {
        request({
            uri: "http://music.abcradio.net.au/api/v1/plays/search.json",
            qs: {
                limit: 10,
                station: 'triplej'
            }
        }, function(err, response, body) {
            var tracks = JSON.parse(body).items;
            for (var i = 0; i < tracks.length; i++) {
                tracks[i].type = 'played';
                tracks[i].artist = tracks[i].recording.artists[0].name;
                tracks[i].title = tracks[i].recording.title;
            }

            res.json(tracks);
        });
    },

    tracks: function(req, res) {
        request("http://www.kimonolabs.com/api/7m6g34pw?apikey=01269db6385d23351cd7f152819e9550", function(err, response, body) {
            res.json(JSON.parse(body).results.tracks);
        });
    }
}
