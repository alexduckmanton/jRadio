var Marionette = require('backbone.marionette');

var itemView = Marionette.ItemView.extend({
    tagName: 'li',
    template: require('../../templates/nav.hbs'),

    events: {
        'touchstart a': 'on_tap'
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    onRender: function() {
        this.$el.toggleClass('active', this.model.get('active'));
    },

    on_tap: function(e) {
        e.preventDefault();
        var route = this.model.get('link');

        location.href = '#' + route;
    }
});

module.exports = CollectionView = Marionette.CollectionView.extend({
    tagName: 'ul',

    initialize: function() {
        // this.listenTo(this.collection, 'change', this.render);
        this.listenTo(App.core.vent, 'route', this.update_active);
    },
    itemView: itemView,

    get_active: function() {
        return this.collection.findWhere({active: true});
    },

    update_active: function(path) {
        var active = this.get_active();
        if (active) active.deactivate();

        var new_active = this.collection.findWhere({link: path});
        new_active.activate();
    }
});
