var Handlebars = require('hbsfy/runtime');

module.exports = Helpers = function Helpers() {
    Handlebars.registerHelper('track_info', require('../templates/info.hbs'));

    Handlebars.registerHelper('time', function(options) {
        var timestamp = options.hash.timestamp;
        var regex = /\d+:\d+/g;
        return regex.exec(timestamp)[0];
    });
};
