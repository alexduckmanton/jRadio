var Marionette = require('backbone.marionette');

module.exports = itemView = Marionette.ItemView.extend({
    className: 'player',
    template: require('../../templates/player.hbs'),

    initialize: function() {
        this.listenTo(this.model, 'change', this.update_content);
        this.listenTo(this.model, 'change:is_playing', this.toggle_classes);
        this.listenTo(App.core.vent, 'tracks:stop', this.on_stop);
    },

    events: {
        'click': 'stop'
    },

    update_content: function(e) {
        var title = this.model.get('title'),
            artist = this.model.get('artist').text;

        this.$el.find('.title').html(title);
        this.$el.find('.artist').html(artist);
    },

    toggle_classes: function() {
        this.$el.toggleClass('playing', this.model.get('is_playing'));
    },

    on_stop: function() {
        var playing = App.data.tracks.where({is_playing: true});
        if (playing.length) return;

        this.model.stop();
    },

    stop: function() {
        App.core.vent.trigger('tracks:stop');
        App.core.vent.trigger('radio:stop');
    }
});
