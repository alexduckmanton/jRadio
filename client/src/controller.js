var Marionette = require('backbone.marionette'),
    TracksView = require('./views/tracks'),
    PlayerModel = require('./models/player'),
    PlayerView = require('./views/player');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        // add the player to the page. only needs to be done once on initialization
        window.App.views.playerView = new PlayerView({ model: new PlayerModel() });
        $('header').append( window.App.views.playerView.render().el );

        window.App.views.tracksView = new TracksView({ collection: window.App.data.tracks });
        console.log(App.data.tracks);
    },

    home: function() {
        var view = window.App.views.tracksView;
        this.renderView(view);
        window.App.router.navigate('#');
        console.log('at home');
    },

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
