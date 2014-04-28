var Backbone = require('backbone');

module.exports = TrackModel = Backbone.Model.extend({
    urlRoot: '/api/unearthed',

    defaults: {
        is_playing: false
    },

    play: function() {
        this.set('is_playing', true);
    },

    stop: function() {
        this.set('is_playing', false);
    }
});
