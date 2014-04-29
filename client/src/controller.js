var Marionette = require('backbone.marionette'),
    TracksView = require('./views/tracks'),
    PlayerModel = require('./models/player'),
    PlayerView = require('./views/player');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        // add the player to the page. only needs to be done once on initialization
        window.App.views.playerView = new PlayerView({ model: new PlayerModel() });
        $('header').prepend( window.App.views.playerView.render().el );
    },

    unearthed_new: function() {
        var self = this,
            tracks = new TracksCollection();

        window.App.router.navigate('unearthed/new');

        tracks.fetch({
            url: '/api/unearthed/new',
            success: function() {
                App.data.tracks = tracks;
                window.App.views.tracksView = new TracksView({ collection: window.App.data.tracks });
                var view = window.App.views.tracksView;
                self.renderView(view);
            }
        });
    },

    unearthed_featured: function() {
        var self = this,
            tracks = new TracksCollection();

        window.App.router.navigate('unearthed/featured');

        tracks.fetch({
            url: '/api/unearthed/featured',
            success: function() {
                App.data.featured = tracks;
                window.App.views.featuredView = new TracksView({ collection: window.App.data.featured });
                var view = window.App.views.featuredView;
                self.renderView(view);
            }
        });
    },

    // unearthed_featured: function() {
    //     window.App.views.featuredView = new TracksView({ collection: window.App.data.tracks });
    //
    //     var view = window.App.views.featuredView;
    //     this.renderView(view);
    //     window.App.router.navigate('unearthed/new');
    // },

    renderView: function(view) {
        this.destroyCurrentView(view);
        $('#content').html(view.render().el);
    },

    destroyCurrentView: function(view) {
        if (!_.isUndefined(window.App.views.currentView)) {
            window.App.views.currentView.close();
        }
        window.App.views.currentView = view;
    }
});
