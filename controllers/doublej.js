var request = require('request');

/**
 * Handle multiple requests at once
 * @param urls [array]
 * @param callback [function]
 * @requires request module for node ( https://github.com/mikeal/request )
 */
var __request = function (urls, callback) {

	'use strict';

	var results = {}, t = urls.length, c = 0,
		handler = function (error, response, body) {

			var url = response.request.uri.href;

			results[url] = { error: error, response: response, body: body };

			if (++c === urls.length) { callback(results); }

		};

	while (t--) { request(urls[t], handler); }
}

var get_image = function(track) {
    var ep = track.broadcast_episode ? track.broadcast_episode : track,
        img_base = 'http://doublej.net.au/sites/default/files/styles/dj_home_featured_item/public/thumbnails/image/',
        default_img = img_base + 'defaultimage_900x500_0.jpg';

    return {
        alt: ep.dj_image ? ep.dj_image.title : '',
        src: ep.dj_image ? img_base + escape(ep.dj_image.base_entity.filename) : default_img
    }
}

var parse_tracks = function(tracks) {
    tracks = JSON.parse(tracks);

    for (var track in tracks) {
        var ep = tracks[track].broadcast_episode;

        // use the broadcast title (normal title includes id)
        tracks[track].title = ep.title;

        // put image in normal location
        tracks[track].image = get_image(tracks[track]);

        // add id for track, to be fetched on the client
        tracks[track].play = {
            href: tracks[track].dj_arid,
            api: '/api/doublej/track'
        };
    }

    return tracks;
}

var parse_articles = function(news) {
    news = JSON.parse(news);

    for (var i = 0; i < news.length; i++) {
        news[i].type = 'article';
        news[i].author = news[i].dj_author.title;
        news[i].image = get_image(news[i]);

        // parse url to get api
        news[i].url = news[i].url.replace(/(http:\/\/doublej\.net\.au\/)/ig, '');
        news[i].url = news[i].url.replace(/\//ig, ':');
    }

    return news;
}

var get_article_content = function(req, res, articles, tracks) {
    var article_api = 'http://doublej.net.au/api/v1/lookup/',
        urls = [];

    for (var i = 0; i < articles.length; i++) {
        urls.push(article_api + articles[i].url);
    }

    __request(urls, function(response) {
        for (var i = 0; i < articles.length; i++) {
            var article = JSON.parse( response[urls[i]].body );
            articles[i].content = '';

            if (article.dj_body.value) articles[i].content = article.dj_body.value;

            if (article.article_list_items) {
                for (var j = 0; j < article.article_list_items.length; j++) {
                    articles[i].content += article.article_list_items[j].dj_body.value;
                }
            }
        }

        var response = tracks;
        if (response) response = response.concat(articles);
        else response = articles;

        res.json(response);
    });
}

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
                tracks[i].type = 'played';
                tracks[i].artist = tracks[i].recording.artists[0].name;
                tracks[i].title = tracks[i].recording.title;
            }

            res.json(tracks);
        });
    },

    tracks: function(req, res) {
        var include_tracks = req.query.include_tracks,
            urls = [],
            tracks = false;

        urls.push('http://doublej.net.au/api/v1/search.json?limit=3&page=0&section=16,11,1,6');
        if (include_tracks == 'true') urls.push('http://doublej.net.au/api/v1/search.json?broadcast_type=2&limit=12&ondemand=true&page=0&sort=ondemand&type=broadcast');

        __request(urls, function(response) {
            var articles = parse_articles( response[urls[0]].body );
            if (include_tracks == 'true') {
                tracks = parse_tracks( response[urls[1]].body );
            }

            // res.json(response);
            get_article_content(req, res, articles, tracks);
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
    }
}
