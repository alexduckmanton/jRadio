var Backbone = require('backbone');

module.exports = TrackModel = Backbone.Model.extend({
    urlRoot: '/api/unearthed',

    defaults: {
        is_playing: false,
        is_loading: true
    },

    initialize: function() {
        var id = this.parse_url(this.get('play').href);
        this.get_track(id);

        this.listenTo(this, 'change:src', this.loaded);
    },

    parse_url: function(url) {
        var regex = /[0-9]+/;
        return regex.exec(url)[0];
    },

    get_track: function(track_id) {
        var self = this,
            api = '/api/unearthed/track';

        $.getJSON(api, {'id': track_id}, function(data) {
            self.set('src', data[0].track_url);
        });
    },

    loaded: function() {
        this.set('is_loading', false);
    },

    play: function() {
        this.set('is_playing', true);
    },

    stop: function() {
        this.set('is_playing', false);
    }
});
