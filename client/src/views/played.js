var Marionette = require('backbone.marionette'),
    TracksView = require('../views/tracks'),
    TracksCollection = require('../collections/tracks');

module.exports = itemView = Marionette.ItemView.extend({
    className: 'played',
    tagName: 'section',
    template: require('../../templates/played.hbs'),

    events: {
        'click': 'get_tracks'
    },

    initialize: function() {
        var played = new TracksCollection();
        App.data.playedTracks = played;
    },

    onRender: function() {
        if (App.views.playedTracksView) this.$el.append(App.views.playedTracksView.render().el);
    },

    get_tracks: function() {
        var self = this,
            played = new TracksCollection();

        played.fetch({
            url: '/api/unearthed/recent',
            success: function() {
                played.forEach(function(val, i, tracks) {
                    var artist = tracks[i].attributes.artistname;
                    tracks[i].set('artist', { 'text': artist });
                });

                App.data.played = played;
                App.views.playedTracksView = new TracksView({ collection: played });

                self.render();
            }
        })
    }

});
