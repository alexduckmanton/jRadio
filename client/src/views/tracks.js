var Marionette = require('backbone.marionette');

var itemView = Marionette.ItemView.extend({
    className: 'track',
    template: require('../../templates/track.hbs'),

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {

    }
});

module.exports = CollectionView = Marionette.CollectionView.extend({
    className: 'tracks',
    
    initialize: function() {
        this.listenTo(this.collection, 'change', this.render);
    },
    itemView: itemView
});
