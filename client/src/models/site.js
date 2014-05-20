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

        this.listenTo(App.core.vent, 'route', this.toggle_active);
    },

    toggle_active: function(route) {
        if (route == this.get('name')) this.set('active', true);
        else this.set('active', false);
    }

});
