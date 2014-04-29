var Marionette = require('backbone.marionette');

module.exports = Router = Marionette.AppRouter.extend({
    appRoutes: {
        '': 'unearthed_new',
        'unearthed': 'unearthed_new',
        // 'unearthed/': 'unearthed_new',
        'unearthed/new': 'unearthed_new',
        // 'unearthed/new/': 'unearthed_new',
        'unearthed/featured': 'unearthed_featured'
        // 'unearthed/featured/': 'unearthed_featured'
    }
});
