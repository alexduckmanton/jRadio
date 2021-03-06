var request = require('request');

module.exports = {

    // wow this is ugly
    tracks: function(req, res) {
        var new_tracks,
            featured_tracks,
            combined,
            num_new = 12,
            num_featured = 3;

        // get new
        request("http://www.kimonolabs.com/api/4i2op28c?apikey=01269db6385d23351cd7f152819e9550", function(err, response, body) {
            new_tracks = JSON.parse(body).results.tracks;
            new_tracks = new_tracks.slice(0,num_new);

            // get featured
            request("http://www.kimonolabs.com/api/2kgevg1u?apikey=01269db6385d23351cd7f152819e9550", function(err, response, body) {
                featured_tracks = JSON.parse(body).results.featured;
                featured_tracks = featured_tracks.slice(0,num_featured);
                featured_tracks.forEach(function(val, i, tracks) {
                    tracks[i].featured = 'true';
                });

                combined = new_tracks.concat(featured_tracks);
                for (var track in combined) {
                    combined[track].play.api = '/api/unearthed/track';
                    combined[track].play.href = /[0-9]+/.exec(combined[track].play.href)[0];
                }

                res.json(combined);
            });
        });
    },

    new: function(req, res) {
        request("http://www.kimonolabs.com/api/4i2op28c?apikey=01269db6385d23351cd7f152819e9550", function(err, response, body) {
            res.json(JSON.parse(body).results.tracks);
        });
    },
    artist: function(req, res) {
        var artist_name = req.query.name;
        request({
            uri: "http://www.kimonolabs.com/api/67czbtsm?apikey=01269db6385d23351cd7f152819e9550",
            qs: { 'kimpath2': artist_name }
        }, function(err, response, body) {
            res.json(JSON.parse(body));
        });
    },
    track: function(req, res) {
        var id = req.query.id;
        request({
            uri: "https://www.triplejunearthed.com/api/jukebox/rest/views/jukebox_track",
            qs: { 'args': id }
        }, function(err, response, body) {
            res.json(JSON.parse(body)[0]);
        });
    },
    featured: function(req, res) {
        request("http://www.kimonolabs.com/api/2kgevg1u?apikey=01269db6385d23351cd7f152819e9550", function(err, response, body) {
            res.json(JSON.parse(body).results.featured);
        });
    },
    recent: function(req, res) {
        request({
            uri: "http://music.abcradio.net.au/api/v1/plays/search.json",
            qs: {
                limit: 10,
                station: 'unearthed'
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
    }
}
