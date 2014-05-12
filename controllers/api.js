var request = require('request');

module.exports = {

    // wow this is ugly
    unearthed: function(req, res) {
        var new_tracks,
            featured_tracks,
            combined,
            num_new = 16,
            num_featured = 4;

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
                res.json(combined);
            });
        });
    },

    unearthed_new: function(req, res) {
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
    },
    unearthed_recent: function(req, res) {
        var count = req.query.count || 10;
        request({
            uri: "https://triplejgizmo.abc.net.au/unearthed/pav-proxy/unearthed-tracks.php",
            qs: { 'count': count }
        }, function(err, response, body) {
            res.json(JSON.parse(body));
        });
    },
}
