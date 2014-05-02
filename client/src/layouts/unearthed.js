var Marionette = require('backbone.marionette'),
    TracksView = require('../views/tracks'),
    TracksCollection = require('../collections/tracks');

module.exports = layout = Marionette.Layout.extend({
    className: 'site',
    tagName: 'section',
    template: require('../../templates/site.hbs'),

    events: {
        'click .toggle_played': 'toggle_played'
    },

    initialize: function() {
        this.get_tracks();
    },

    get_tracks: function() {
        var self = this,
            tracks = new TracksCollection();

        tracks.fetch({
            url: '/api/unearthed',
            success: function() {
                // create the new view with fresh data
                App.data.tracks = tracks;
                App.views.tracksView = new TracksView({ collection: tracks });

                // render
                self.$el.append(App.views.tracksView.render().el);
            }
        });
    },

    get_played: function() {
        var self = this,
            played = new TracksCollection();

        played.fetch({
            url: '/api/unearthed/recent',
            success: function() {
                console.log(played);

                // set initial active value
                played.active = true;
                played.type = 'played';

                // store data and views in the app
                App.data.played = played;
                App.views.playedView = new TracksView({
                    collection: played,
                    className: 'played'
                });

                // render
                self.$el.prepend(App.views.playedView.render().el);
            }
        });
    },

    toggle_played: function() {
        var played = App.views.playedView;

        if (!played) {
            this.get_played();
        } else if (played) {
            App.core.vent.trigger('played:toggle');
        }
    }

});
