var Marionette = require('backbone.marionette'),
    TracksView = require('../views/tracks'),
    TracksCollection = require('../collections/tracks');

module.exports = layout = Marionette.Layout.extend({
    className: 'site',
    tagName: 'section',
    template: require('../../templates/site.hbs'),

    events: {
        'click .radio': 'play_radio',
        'click .toggle_played': 'toggle_played'
    },

    initialize: function() {
        this.get_tracks();

        this.listenTo(App.core.vent, 'track:play', this.update_ui_for_player);
        this.listenTo(App.core.vent, 'played:show', this.toggle_tray);
        this.listenTo(App.core.vent, 'played:hide', this.toggle_tray);
    },

    onRender: function() {
        this.$header = this.$el.children('header');
        this.init_played();
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
                self.show_tracks();
            }
        });
    },

    show_tracks: function() {
        var self = this,
            tracks = App.views.tracksView.render().el,
            loader = this.$el.find('.site_loading');

        loader.addClass('loaded');

        loader.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {
            self.$el.children('header').after(tracks);
            self.$el.find('.site_loading').remove();
        });
    },

    init_played: function() {
        App.views.playedView = new TracksView({
            collection: new TracksCollection(),
            className: 'played'
        });
        this.$el.prepend(App.views.playedView.render().el);
    },

    get_played: function() {
        var self = this,
            played = App.views.playedView.collection;

        this.toggle_played_loading();

        played.fetch({
            url: '/api/unearthed/recent',
            success: function() {
                played.type = 'played';
                played.models.reverse();

                // store data and views in the app
                App.data.played = played;
                App.views.playedView.collection = App.data.played;

                // render
                self.toggle_played_loading();
                App.views.playedView.render();
                self.bind_played_events();
                App.core.vent.trigger('played:show');
            }
        });
    },

    toggle_played: function() {
        var played = App.views.playedView;

        if (!played.collection.length) {
            this.get_played();
        } else if (played.collection.active) {
            App.core.vent.trigger('played:hide');
        } else if (!played.collection.active) {
            App.core.vent.trigger('played:show');
        }
    },

    toggle_tray: function() {
        this.$el.toggleClass('show_tray');
    },

    toggle_played_loading: function() {
        this.$el.find('.toggle_played').toggleClass('loading');
    },

    bind_played_events: function() {
        this.listenTo(App.core.vent, 'played:show', this.scroll_played);
    },

    scroll_played: function() {
        var $played = this.$el.children('.played'),
            $tracks = $played.children('.track'),
            track_height = $tracks.first().outerHeight(),
            played_height = $tracks.length * track_height;

        // snap scroll played tracks to bottom
        App.core.vent.trigger('scroll:pos', {
            pos: played_height,
            timing: 0,
            elem: $played
        });
    },

    play_radio: function() {
        App.core.vent.trigger('track:play', this.model.attributes);
    },

    update_ui_for_player: function(track) {
        if (App.views.playedView.collection.active) {
            this.toggle_played();
            App.views.playedView.$el.one('transitionend', function() {
                App.core.vent.trigger('player:play', track);
            });
        } else {
            App.core.vent.trigger('player:play', track);
        }
    }

});
