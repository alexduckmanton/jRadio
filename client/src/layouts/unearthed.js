var Marionette = require('backbone.marionette'),
    TracksView = require('../views/tracks'),
    TracksCollection = require('../collections/tracks'),
    PlayedView = require('../views/played');

module.exports = layout = Marionette.Layout.extend({
    className: 'site',
    tagName: 'section',
    template: require('../../templates/site.hbs'),

    initialize: function() {
        this.get_tracks();
        this.init_played();
    },

    onRender: function() {
        this.$el.prepend(App.views.playedView.render().el);
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

    init_played: function() {
        App.views.playedView = new PlayedView();
    }

});
