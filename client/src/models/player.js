var Backbone = require('backbone');

module.exports = PlayerModel = Backbone.Model.extend({
    defaults: {
        is_playing: false,
        track_api: '/api/unearthed/track',
        track: new Audio()
    },

    initialize: function() {
        this.listenTo(App.core.vent, 'track:play', this.change_track);
        this.listenTo(App.core.vent, 'track:play', this.play);
    },

    change_track: function(src) {
        if ( this.get('track').getAttribute('src') === src ) return;

        this.get('track').setAttribute('src', src);
    },

    play: function(src) {
        this.get('track').play();
        this.set('is_playing', true);
    },

    stop: function() {
        this.get('track').pause();
        this.set('is_playing', false);
    }
});
