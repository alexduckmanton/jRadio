var home = require('../controllers/home'),
    api = require('../controllers/api');

module.exports.initialize = function(app) {
    app.get('/', home.index);
    app.get('/api/unearthed', api.unearthed);
};
