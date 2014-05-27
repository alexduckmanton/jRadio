var Handlebars = require('hbsfy/runtime');

module.exports = Helpers = function Helpers() {
    Handlebars.registerHelper('track_info', require('../templates/info.hbs'));
    Handlebars.registerHelper('loading', require('../templates/loading.hbs'));
    Handlebars.registerHelper('clock', require('../templates/clock.hbs'));

    Handlebars.registerHelper('time', function(options) {
        var current = new Date(),
            text = 'mins ago';

        // get the track timestamp, and update for the timezone differences
        var track = options.hash.time.split(/[- :T+]/); // needs to be split for ios
        track = new Date(track[0], track[1]-1, track[2], track[3], track[4], track[5]);
        track = new Date(track.getTime() - track.getTimezoneOffset()*60*1000);

        // find the difference and change it into minutes
        var diff = current.getTime() - track.getTime();
        diff = Math.floor( diff / 1000 / 60 );

        // don't show "1 mins ago" like an idiot
        if (diff == 1) text = 'min ago';

        return new Handlebars.SafeString('<strong>' + diff + '</strong>' + ' ' + text);
    });
};
