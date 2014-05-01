var Marionette = require('backbone.marionette'),
    TracksView = require('./tracks'),
    TracksCollection = require('../collections/tracks');

module.exports = itemView = Marionette.ItemView.extend({
    className: 'site',
    tagName: 'section',
    template: require('../../templates/site.hbs'),

    events: {

    },

    initialize: function() {
        var self = this,
            tracks = new TracksCollection();

        tracks.fetch({
            url: '/api/unearthed',
            success: function() {
                // create the new view with fresh data
                App.data.tracks = tracks;
                App.views.tracksView = new TracksView({ collection: tracks });;

                // render
                self.$el.append(App.views.tracksView.render().el);
            }
        });
    }

});
