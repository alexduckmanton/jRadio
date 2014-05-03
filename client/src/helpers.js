var Handlebars = require('hbsfy/runtime');

module.exports = Helpers = function Helpers() {
    Handlebars.registerHelper('track_info', require('../templates/info.hbs'));

    Handlebars.registerHelper('time', function(options) {
        var current = new Date(),
            track = new Date(options.hash.timestamp),
            diff = current.getTime() - track.getTime(),
            text = 'mins ago';

        // time returned by jjj is in a bizarre timezone, and then assumed as local by js
        diff -= 10*60*60*1000;

        // get whole minutes
        diff = Math.floor( diff / 1000 / 60 );

        // don't show "1 mins ago" like an idiot
        if (diff == 1) text = 'min ago';

        return new Handlebars.SafeString('<strong>' + diff + '</strong>' + ' ' + text);
    });
};
