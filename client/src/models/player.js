var Backbone = require('backbone');

module.exports = PlayerModel = Backbone.Model.extend({
    defaults: {
        is_playing: false,
        track_api: '/api/unearthed/track',
        track: new Audio()
    },

    initialize: function() {
        // ios keeps streaming data in the background even after a pause and removing the src. need to completely kill audio element
        this.hook_audio_pause();

        this.listenTo(App.core.vent, 'track:play', this.change_track);
        this.listenTo(App.core.vent, 'track:play', this.update_info);
        this.listenTo(App.core.vent, 'track:play', this.play);
    },

    hook_audio_pause: function() {
        // var track = this.get('track');

        $(this.get('track')).one('pause', '', {context: this}, this.destroy_audio);
    },

    destroy_audio: function(e) {
        var self = e.data.context;

        self.update_src();
        self.unset('track');
        self.set('track', new Audio());

        self.hook_audio_pause();
    },

    update_src: function(src) {
        if (!src) src = '/';

        this.get('track').setAttribute('src', src);
        this.get('track').load();
    },

    change_track: function(new_track) {
        var track = this.get('track');

        // add event listener to remove loading class
        $(track).one('playing', function() { App.core.vent.trigger('track:loaded'); });

        // don't update if it's the same track
        if ( track.getAttribute('src') === new_track.src ) return;

        // add event listener to remove loading class
        $(track).one('ended', function() { App.core.vent.trigger('tracks:stop'); });

        // mp3 source for the track
        this.update_src(new_track.src);
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
