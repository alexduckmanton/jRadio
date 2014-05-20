var request = require('request');

module.exports = {
    recent: function(req, res) {
        request({
            uri: "http://triplejgizmo.abc.net.au/pav/plays/triplej.php",
        }, function(err, response, body) {
            res.json(JSON.parse(body));
        });
    },
}
