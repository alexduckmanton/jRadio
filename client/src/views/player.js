var Marionette = require('backbone.marionette');

module.exports = itemView = Marionette.ItemView.extend({
    className: 'player',
    template: require('../../templates/player.hbs'),

    initialize: function() {
        this.listenTo(this.model, 'change', this.update_content);
        this.listenTo(this.model, 'change', this.toggle_classes);
        this.listenTo(App.core.vent, 'tracks:stop', this.on_stop);
        this.listenTo(App.core.vent, 'tracks:stop', this.loaded);
        this.listenTo(App.core.vent, 'track:loaded', this.loaded);


        if (App.data.window.width > 700) {
            var self = this;
            window.setTimeout(function() {
                self.listenTo(App.core.vent, 'route', self.hide);
            }, 100);
        }
    },

    events: {
        'click': 'stop'
    },

    onRender: function() {
        this.$text = this.$el.find('.text');
    },

    hide: function() {
        if (this.model.get('is_playing')) return;

        this.$el.addClass('hide');

        var self = this,
            active = $('.site.active .tracks');
        active.one('webkitTransitionEnd oTransitionEnd msTransitionEnd transitionend', function() {
            window.setTimeout(function() { self.show(); }, 200);
        });
    },

    show: function() {
        this.$el.removeClass('hide');
    },

    update_content: function(e) {
        var title = this.model.get('title'),
            artist = this.model.get('artist');

        this.$text.toggleClass('empty_artist', !artist);

        artist = artist ? artist.text : '';

        this.$el.find('.title').html(title);
        this.$el.find('.artist').html(artist);
    },

    toggle_classes: function() {
        this.$el.toggleClass('playing', this.model.get('is_playing'));

        if ( this.model.get('is_playing') ) this.$el.addClass('loading');
    },

    on_stop: function() {
        var playing = App.data.tracks.where({is_playing: true});
        if (playing.length) return;

        this.model.stop();
    },

    stop: function() {
        App.core.vent.trigger('tracks:stop');
    },

    loaded: function() {
        this.$el.removeClass('loading');
    }
});
