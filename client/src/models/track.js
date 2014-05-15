var Backbone = require('backbone');

module.exports = TrackModel = Backbone.Model.extend({
    defaults: {
        is_playing: false,
        track_loading: true,
        img_loading: true,
        featured: false
    },

    initialize: function() {
        if (!this.get('play')) return;

        var id = this.parse_url(this.get('play').href);
        this.get_track(id);
        this.get_img();

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
            if (!data.length) return;
            self.set('src', data[0].track_url);
        });
    },

    get_img: function() {
        var self = this,
            src = this.get('image').src,
            img = new Image();

        img.src = src;
		$(img).load(function() {
            self.set('img_loading', false);
		}).error(function (){
            self.set('img_loading', false);
            self.set('image', {src: ''});
        });
    },

    loaded: function() {
        this.set('track_loading', false);
    },

    play: function() {
        this.set('is_playing', true);
    },

    stop: function() {
        this.set('is_playing', false);
    }
});
