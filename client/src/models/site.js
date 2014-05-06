var Backbone = require('backbone');

module.exports = SiteModel = Backbone.Model.extend({
    defaults: {
        active: true,
        title: 'Live Radio',
        src: ''
    },

    initialize: function() {
        // match model for tracks so player can interpret
        this.set('artist', {
            text: this.get('radio_title')
        });
    }

});
