var Backbone = require('backbone');

module.exports = PlayerModel = Backbone.Model.extend({
    defaults: {
        is_playing: false
    }
});
