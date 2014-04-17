var Marionette = require('backbone.marionette');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        // window.App.views.contactsView = new ContactsView({ collection: window.App.data.contacts });
        console.log('init');
    },

    home: function() {
        // var view = window.App.views.contactsView;
        // this.renderView(view);
        // window.App.router.navigate('#');
        console.log('at home');
    },

    renderView: function(view) {
        this.destroyCurrentView(view);
        $('#content').html(view.render().el);
    },

    destroyCurrentView: function(view) {
        if (!_.isUndefined(window.App.views.currentView)) {
            window.App.views.currentView.close();
        }
        window.App.views.currentView = view;
    }
});
