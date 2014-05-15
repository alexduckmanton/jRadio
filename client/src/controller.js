var Marionette = require('backbone.marionette'),
    TracksView = require('./views/tracks'),
    TracksCollection = require('./collections/tracks'),
    PlayerModel = require('./models/player'),
    PlayerView = require('./views/player'),
    NavModel = require('./models/nav'),
    NavView = require('./views/nav'),
    NavCollection = require('./collections/nav'),
    UnearthedLayout = require('./layouts/unearthed'),
    SiteModel = require('./models/site');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        // add the player to the page. only needs to be done once on initialization
        App.views.playerView = new PlayerView({ model: new PlayerModel() });
        $('#content').append( window.App.views.playerView.render().el );

        this.listenTo(App.core.vent, 'scroll:pos', this.scroll);
        this.listenTo(App.core.vent, 'scroll:elem', this.scroll_elem);

        // add footer navigation
        // var nav_collection = new NavCollection([
        //     new NavModel({ link: 'unearthed/new', label: 'new' }),
        //     new NavModel({ link: 'unearthed/featured', label: 'featured' })
        // ]);
        // window.App.views.navView = new NavView({ collection: nav_collection });
        // $('nav').append( window.App.views.navView.render().el );
    },

    scroll: function(options) {
        var pos = options.pos || 0,
            elem = options.elem || $('html,body'),
            timing;

        if (typeof(options.timing) === 'number') timing = options.timing;
        else timing = 300;

        if (typeof(options) === 'number') pos = options;

        elem.animate({
            scrollTop: pos
        }, timing);
    },

    scroll_elem: function(options) {
        var diff = options.diff || 0,
            animate = options.anim || false,
            elem = options.elem || options,
            pos = elem.offset().top;

        App.core.vent.trigger('scroll:pos', pos + diff, animate);
    },

    scroll_event: function(event, scroll_pos) {
        this.listenTo(App.core.vent, event, _.bind(this.scroll, this, scroll_pos));
    },

    unearthed: function() {
        App.views.unearthedLayout = new UnearthedLayout({ model: new SiteModel({
            logo: 'unearthedlogo',
            page_title: 'Unearthed',
            radio_title: 'Triple J Unearthed',
            src: 'http://shoutmedia.abc.net.au:10464/;*.mp3'
        }) });

        App.router.navigate('unearthed');
        $('#content').append( App.views.unearthedLayout.render().el );
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
