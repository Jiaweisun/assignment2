

var MyModel = Kinvey.Backbone.Model.extend({ url: 'collection-name' });
var model = new MyModel({});
model.set({
    _geoloc: [-71, 42]// longitude: -71, latitude: 42.
});



var Restaurants = Kinvey.Backbone.Collection.extend({ url: 'restaurants' });
// Get users current position.
navigator.geolocation.getCurrentPosition(function(loc) {
    var coord = [loc.coords.longitude, loc.coords.latitude];
    // Query for buildings close by.
    var query = new Kinvey.Query();
    query.near('_geoloc', coord, 10);
    var collection = new Restaurants([]);
    var promise = collection.fetch({
        query   : query,
        success : function(collection, response, options) {
            ...
        }
    });
});













//regular expression
_.templateSettings = {
	interpolate : /\{\{(.+?)\}\}/g,
	escape : /\{\{-(.+?)\}\}/g,
	evaluate : /\{\{=(.+?)\}\}/g
};