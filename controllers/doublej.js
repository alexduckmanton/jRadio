var request = require('request');

module.exports = {
    recent: function(req, res) {
        request({
            uri: "http://music.abcradio.net.au/api/v1/plays/search.json",
            qs: {
                limit: 10,
                station: 'doublej'
            }
        }, function(err, response, body) {
            var tracks = JSON.parse(body).items;
            for (var i = 0; i < tracks.length; i++) {
                tracks[i].artist = tracks[i].recording.artists[0].name;
                tracks[i].title = tracks[i].recording.title;
            }

            res.json(tracks);
        });
    },

    tracks: function(req, res) {
        request({
            uri: "http://doublej.net.au/api/v1/search.json",
            qs: {
                broadcast_type: 2,
                limit: 9,
                ondemand: true,
                page: 0,
                sort: 'ondemand',
                type: 'broadcast'
            }
        }, function(err, response, body) {
            var tracks = JSON.parse(body);

            for (var track in tracks) {
                var ep = tracks[track].broadcast_episode,
                    img_base = 'http://doublej.net.au/sites/default/files/styles/dj_home_featured_item/public/thumbnails/image/',
                    default_img = img_base + 'defaultimage_900x500_0.jpg';

                // use the broadcast title (normal title includes id)
                tracks[track].title = ep.title;

                // put image in normal location
                tracks[track].image = {
                    alt: ep.dj_image ? ep.dj_image.title : '',
                    src: ep.dj_image ? img_base + ep.dj_image.base_entity.filename : default_img
                }

                // add id for track, to be fetched on the client
                tracks[track].play = {
                    href: tracks[track].dj_arid,
                    api: '/api/doublej/track'
                };
            }

            res.json(tracks);
        });
    },

    track: function(req, res) {
        var id = req.query.id;
        request({
            uri: 'http://program.abcradio.net.au/api/v1/on_demand/'+ id +'.json',
        }, function(err, response, body) {
            var track = JSON.parse(body);

            track.track_url = track.audio_streams[0].url;

            res.json(track);
        });
    },
}
