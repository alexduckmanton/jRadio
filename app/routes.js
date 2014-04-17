var home = require('../controllers/home');

module.exports.initialize = function(app) {
    app.get('/', home.index);
};
