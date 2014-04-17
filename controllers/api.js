var request = require('request');

module.exports = {
  unearthed: function(req, res) {
    request("http://www.kimonolabs.com/api/4pxdn10g?apikey=01269db6385d23351cd7f152819e9550", function(err, response, body) {
      res.json(response);
    });
  }
}
