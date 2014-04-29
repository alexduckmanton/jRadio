var Marionette = require('backbone.marionette'),
    Helpers = require('./helpers'),
    Controller = require('./controller'),
    Router = require('./router');

module.exports = App = function App() {};

App.prototype.start = function(){
    App.core = new Marionette.Application();

    App.helpers = new Helpers();

    App.core.on("initialize:before", function (options) {

        App.views = {};
        App.data = {};

        App.core.vent.trigger('app:start');

    });

    App.core.vent.bind('app:start', function(options){
        if (Backbone.history) {
            App.controller = new Controller();
            App.router = new Router({ controller: App.controller });
            Backbone.history.start();
        }
    });

    App.core.start();
};
