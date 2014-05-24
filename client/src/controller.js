var Marionette = require('backbone.marionette'),
    TracksView = require('./views/tracks'),
    TracksCollection = require('./collections/tracks'),
    PlayerModel = require('./models/player'),
    PlayerView = require('./views/player'),
    SiteLayout = require('./layouts/site'),
    SiteModel = require('./models/site');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        this.listenTo(App.core.vent, 'scroll:pos', this.scroll);
        this.listenTo(App.core.vent, 'scroll:elem', this.scroll_elem);
        this.listenTo(App.core.vent, 'route', this.on_route);

        // add the player to the page. only needs to be done once on initialization
        App.views.playerView = new PlayerView({ model: new PlayerModel() });
        $('#content').prepend( window.App.views.playerView.render().el );

        // create site views, to be populated when navigated to
        App.views.unearthed = {};
        App.views.unearthed.layout = new SiteLayout({ model: new SiteModel({
            name: 'unearthed',
            page_title: 'Unearthed',
            radio_title: 'Triple J Unearthed',
            src: 'http://shoutmedia.abc.net.au:10464/;*.mp3',
            tracks_api: '/api/unearthed',
            played_api: '/api/unearthed/recent'
        }) });
        this.renderView( App.views.unearthed.layout );

        App.views.triplej = {};
        App.views.triplej.layout = new SiteLayout({ model: new SiteModel({
            name: 'triplej',
            page_title: 'Triple J',
            radio_title: 'Triple J',
            src: 'http://shoutmedia.abc.net.au:10426/;*.mp3',
            tracks_api: '/api/triplej',
            played_api: '/api/triplej/recent'
        }) });
        this.renderView( App.views.triplej.layout );

        App.views.doublej = {};
        App.views.doublej.layout = new SiteLayout({ model: new SiteModel({
            name: 'doublej',
            page_title: 'Double J',
            radio_title: 'Double J',
            src: 'http://shoutmedia.abc.net.au:10428/;*.mp3',
            tracks_api: '/api/triplej',
            played_api: '/api/triplej/recent'
        }) });
        this.renderView( App.views.doublej.layout );
    },

    on_route: function(path) {
        App.router.navigate(path);
        $('body').removeClass().addClass(path);
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
    },

    triplej: function() {
    },

    doublej: function() {
    },

    renderView: function(view) {
        // this.destroyCurrentView(view);
        $('#content').append(view.render().el);
    },

    destroyCurrentView: function(view) {
        if (!_.isUndefined(window.App.views.currentView)) {
            window.App.views.currentView.close();
        }
        window.App.views.currentView = view;
    }
});
