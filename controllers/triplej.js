var request = require('request');

module.exports = {
    recent: function(req, res) {
        request({
            uri: "http://triplejgizmo.abc.net.au/pav/plays/triplej.php",
        }, function(err, response, body) {
            res.json(JSON.parse(body));
        });
    },

    tracks: function(req, res) {
        request("http://www.kimonolabs.com/api/7m6g34pw?apikey=01269db6385d23351cd7f152819e9550", function(err, response, body) {
            res.json(JSON.parse(body).results.tracks);
        });
    }
}
