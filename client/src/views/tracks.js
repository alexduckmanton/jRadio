var Marionette = require('backbone.marionette');

var itemView = Marionette.ItemView.extend({
    className: 'track',

    events: {
        'click a': 'toggle_playing'
    },

    getTemplate: function() {
        var type = this.model.collection.type;

        if (type == 'played') {
            return require('../../templates/played.hbs');
        } else {
            return require('../../templates/track.hbs');
        }
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.toggle_classes);
        this.listenTo(this.model, 'change:is_playing', this.trigger_playing);

        this.$el.toggleClass('featured', this.model.get('featured'));
    },

    toggle_classes: function() {
        this.$el.toggleClass('playing', this.model.get('is_playing'));
        this.$el.toggleClass('loading', (this.model.get('track_loading') || this.model.get('img_loading')));
    },

    toggle_playing: function(e) {
        e.preventDefault();
        if (this.model.get('is_loading')) return;

        var is_playing = this.model.get('is_playing');

        if (is_playing) this.model.stop();
        else this.model.play();
    },

    trigger_playing: function() {
        var is_playing = this.model.get('is_playing');

        if (is_playing) this.play();
        else this.stop();
    },

    play: function() {
        App.core.vent.trigger('track:play', this.model.attributes);
    },

    stop: function() {
        App.core.vent.trigger('track:stop');
    }
});

module.exports = CollectionView = Marionette.CollectionView.extend({
    tagName: 'section',
    className: 'tracks',
    itemView: itemView,

    initialize: function() {
        this.listenTo(this.collection, 'change:is_playing', this.stop_previous);
        this.listenTo(App.core.vent, 'tracks:stop', this.stop);

        if (this.className == 'played') {
            this.listenTo(App.core.vent, 'played:show', this.toggle_active);
            this.listenTo(App.core.vent, 'played:hide', this.toggle_active);
        }
    },

    toggle_active: function() {
        this.collection.active = !this.collection.active;
        this.$el.toggleClass('active', this.collection.active);
    },

    stop_previous: function(new_track) {
        var playing = this.collection.where({is_playing: true}),
            old_track = _.without(playing, new_track);

        if (playing.length > 1) old_track[0].stop();
        else if (playing.length < 1) App.core.vent.trigger('tracks:stop');
    },

    stop: function() {
        var playing = this.collection.findWhere({is_playing: true});

        if (playing) playing.stop();
    }
});
