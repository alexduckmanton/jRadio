var Marionette = require('backbone.marionette');

var itemView = Marionette.ItemView.extend({
    tagName: 'li',
    template: require('../../templates/nav.hbs'),

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    events: {

    }
});

module.exports = CollectionView = Marionette.CollectionView.extend({
    tagName: 'ul',
    
    initialize: function() {
        // this.listenTo(this.collection, 'change', this.render);
    },
    itemView: itemView
});
