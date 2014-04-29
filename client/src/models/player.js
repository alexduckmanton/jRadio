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

    change_track: function(track) {
        // don't update if it's the same track
        if ( this.get('track').getAttribute('src') === track.src ) return;

        // mp3 source for the track
        this.get('track').setAttribute('src', track.src);

        // set info to be displayed in the player
        this.set({
            'title': track.title,
            'artist': track.artist
        });
    },

    play: function() {
        this.get('track').play();
        this.set('is_playing', true);
    },

    stop: function() {
        this.get('track').pause();
        this.set('is_playing', false);
    }
});
