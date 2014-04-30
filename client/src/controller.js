var Marionette = require('backbone.marionette'),
    TracksView = require('./views/tracks'),
    TracksCollection = require('./collections/tracks'),
    PlayerModel = require('./models/player'),
    PlayerView = require('./views/player'),
    NavModel = require('./models/nav'),
    NavView = require('./views/nav'),
    NavCollection = require('./collections/nav');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        // add the player to the page. only needs to be done once on initialization
        window.App.views.playerView = new PlayerView({ model: new PlayerModel() });
        $('header').prepend( window.App.views.playerView.render().el );

        // add footer navigation
        var nav_collection = new NavCollection([
            new NavModel({ link: 'unearthed/new', label: 'new' }),
            new NavModel({ link: 'unearthed/featured', label: 'featured' })
        ]);
        window.App.views.navView = new NavView({ collection: nav_collection });
        $('nav').append( window.App.views.navView.render().el );
    },

    unearthed_new: function() {
        this.load_view({
            route: 'unearthed/new',
            collection: new TracksCollection(),
            data_url: '/api/unearthed/new',
            view: window.App.views.tracksView,
            ViewType: TracksView
        }, function(data, view) {
            window.App.data.tracks = data;
            window.App.views.tracksView = view;
        });
    },

    unearthed_featured: function() {
        this.load_view({
            route: 'unearthed/featured',
            collection: new TracksCollection(),
            data_url: '/api/unearthed/featured',
            view: window.App.views.featuredView,
            ViewType: TracksView
        }, function(data, view) {
            window.App.data.featured = data;
            window.App.views.featuredView = view;
        });
    },

    load_view: function(options, callback) {
        var self = this,
            data = options.collection;

        App.router.navigate(options.route);
        // console.log(App.router);

        // check if the view already exists. if so, render existing rather than loading again
        if (options.view) {
            console.log('cached');
            this.renderView( options.view );

        // view doesn't exist, so go get it with the supplied url
        } else {
            console.log('loading');
            data.fetch({
                url: options.data_url,
                success: function() {
                    // create the new view with fresh data
                    console.log(data);
                    var view = new options.ViewType({ collection: data });

                    // update App data
                    callback(data, view);

                    // render the view
                    self.renderView(view);
                }
            });
        }
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
