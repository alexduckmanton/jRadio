var Backbone = require('backbone'),
    TrackModel = require('../models/track');

module.exports = TracksCollection = Backbone.Collection.extend({
    model:  TrackModel
});
