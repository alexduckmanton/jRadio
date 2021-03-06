var Backbone = require('backbone');

module.exports = TrackModel = Backbone.Model.extend({
    defaults: {
        is_playing: false,
        track_loading: true,
        img_loading: true,
        featured: false
    },

    initialize: function() {
        var type = this.get('type');
        if (type == 'played') return;

        this.set_title();

        if (this.collection.site == 'unearthed' && App.data.window.width > 700) this.get_high_res_img();
        else this.load_img();

        if (type == 'article') {
            var self = this;
            _.defer(function() { self.set('track_loading', false); });
        } else {
            this.listenTo(this, 'change:src', this.loaded);
            this.set_track();
        }
    },

    set_title: function() {
        var artist = this.get('artist'),
            title = this.get('title'),
            info;

        if (artist) this.set('artist', artist.text);
        else {
            info = title.split(/( - )|( for )/g);
            if (info.length != 4) return;

            if (info[1]) {
                this.set('artist', info[0]);
                this.set('title', info[3]);
            } else if (info[2]) {
                this.set('title', info[0]);
                this.set('artist', info[3]);
            }
        }
    },

    set_track: function() {
        var src = this.get('play').href,
            is_mp3 = new RegExp('mp3', 'ig');

        if (is_mp3.test(src)) this.set('src', src);
        else this.fetch_track(this.get('play').href);
    },

    fetch_track: function(track_id) {
        var self = this,
            api = this.get('play').api;

        $.getJSON(api, {'id': track_id}, function(data) {
            if (data) self.set('src', data.track_url);
        });
    },

    get_high_res_img: function() {
        var self = this,
            artist = this.get('artist').replace(/\.|\(|\)/g,''), // remove any periods or parens which break regex later
            title = this.get('title').replace(/\.|\(|\)/g,'');

        $.ajax({
            url: 'http://api.soundcloud.com/tracks.json',
            data: {
                client_id: '3dea5f796277d33d7a3cfaf0536a65ef',
                q: artist + ' ' + title,
                limit: 5
            },
            timeout: 500,
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
                    if (!artwork) artwork = found_artists[0].user.avatar_url;

                } else if (found_tracks.length === 0 && found_artists.length > 0) {
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
