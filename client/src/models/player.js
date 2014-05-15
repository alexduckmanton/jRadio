var Backbone = require('backbone');

module.exports = PlayerModel = Backbone.Model.extend({
    defaults: {
        is_playing: false,
        track_api: '/api/unearthed/track',
        track: new Audio()
    },

    initialize: function() {
        this.listenTo(App.core.vent, 'track:play', this.change_track);
        this.listenTo(App.core.vent, 'track:play', this.update_info);
        this.listenTo(App.core.vent, 'track:play', this.play);
    },

    change_track: function(new_track) {
        var track = this.get('track');

        // add event listener to remove loading class
        $(track).one('playing', function() { App.core.vent.trigger('track:loaded'); });

        // add event listener to remove loading class
        $(track).one('ended', function() { App.core.vent.trigger('tracks:stop'); });

        // don't update if it's the same track
        if ( track.getAttribute('src') === new_track.src ) return;

        // mp3 source for the track
        track.setAttribute('src', new_track.src);

    },

    update_info: function(track) {
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
