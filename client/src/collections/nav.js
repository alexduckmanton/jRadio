var Backbone = require('backbone'),
    NavModel = require('../models/nav');

module.exports = NavCollection = Backbone.Collection.extend({
    model:  NavModel
});
