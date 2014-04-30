var Backbone = require('backbone');

module.exports = TrackModel = Backbone.Model.extend({
    defaults: {
        active: false,
        link: '#',
        label: 'hello'
    },

    initialize: function() {
    },

    activate: function() {
        this.set('active', true);
    },

    deactivate: function() {
        this.set('active', false);
    }
});
