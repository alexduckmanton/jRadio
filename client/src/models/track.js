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

        if (App.data.window.width > 700) this.get_high_res_img();
        else this.load_img();

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

    get_high_res_img: function() {
        var self = this,
            artist = this.get('artist').text,
            title = this.get('title');

        $.ajax({
            url: 'http://api.soundcloud.com/tracks.json',
            data: {
                client_id: '3dea5f796277d33d7a3cfaf0536a65ef',
                q: artist + ' ' + title,
                limit: 5
            },
            success: function(tracks) {
                var found_artists = {},
                    found_tracks = {},
                    artwork = false,
                    artist_regex = new RegExp(artist, 'ig'),
                    title_regex = new RegExp(title, 'ig');

                // get a list of matching artists
                found_artists = _.filter(tracks, function(track) {
                    if (track.user.username.match(artist_regex)) return true;
                    else return false;
                });

                // get a separate list of matching tracks, as a subset of found_artists
                found_tracks = _.filter(found_artists, function(track) {
                    if (track.title.match(title_regex)) return true;
                    else return false;
                });

                // get the track artwork, or the artist avatar if no exact match
                if (found_tracks.length == 1) {
                    artwork = found_tracks[0].artwork_url;

                    // if there isn't any track artwork, use the avatar
                    artwork = found_artists[0].user.avatar_url;

                } else if (found_tracks.length == 0 && found_artists.length > 0) {
                    artwork = found_artists[0].user.avatar_url;
                }

                // if artwork has been found, chuck it in
                if (artwork) {
                    artwork = artwork.replace(/large/g, 't500x500');
                    self.new_img(artwork);
                }
            },
            error: function() {
                // maybe do something I dunno
            },
            complete: function() {
                // load whatever artwork we've got
                self.load_img();
            }
        });
    },

    load_img: function() {
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

    new_img: function(new_src) {
        this.set('image', {src: new_src});
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
