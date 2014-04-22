var Marionette = require('backbone.marionette'),
    Controller = require('./controller'),
    Router = require('./router');

module.exports = App = function App() {};

App.prototype.start = function(){
    App.core = new Marionette.Application();

    App.core.on("initialize:before", function (options) {

        App.views = {};
        App.data = {};

        // load up some initial data:
        $.getJSON('/api/unearthed')
            .success(function(data) {
                App.data.unearthed = data;
                App.core.vent.trigger('app:start');
            });
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
