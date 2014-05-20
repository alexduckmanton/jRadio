var Marionette = require('backbone.marionette');

module.exports = Router = Marionette.AppRouter.extend({
    appRoutes: {
        '': 'unearthed',
        'unearthed': 'unearthed',
        'triplej': 'triplej'
    },

    onRoute: function(name, path, options) {
        App.core.vent.trigger('route', path);
    }
});
