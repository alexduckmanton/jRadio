var Handlebars = require('hbsfy/runtime');

module.exports = Helpers = function Helpers() {
    Handlebars.registerHelper('track_info', require('../templates/info.hbs'));

    Handlebars.registerHelper('time', function(options) {
        var current = new Date();
        var track = new Date(options.hash.timestamp);
        var diff = current.getTime() - track.getTime() - 10*60*60*1000;
        diff = diff / 1000 / 60;

        return Math.floor(diff) + ' minutes ago';
    });
};
