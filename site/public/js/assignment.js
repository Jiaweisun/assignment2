//---------------------------------------
// Restaurant Model
//---------------------------------------
var Restaurant = Backbone.Model.extend({
  defaults:{

          company_id : 'init',
          name: 'init name',
          address: 'init address',
          pos: 'init position',
  },
  initialize: function() { },
  url: '/api/rest/todo',

  clear: function() {
    this.destroy();
  }
});

//---------------------------------------
// Restaurant Collection
// ---------------
// The collection of companies is backed by *localStorage* instead of a remote
// server.
//---------------------------------------
var RestaurantList = Backbone.Collection.extend({
  // Reference to this collection's model.
  model: Restaurant,

  // localStorage: new Store("company-cachirulo"),
  url: '/api/rest/todo',

  add_new: function(restaurant){
    this.create(restaurant);
  },

  // Companies are sorted by their name
  comparator: function(restaurant) {
    return restaurant.get('name');
  },
  remove_all: function (){
    var model;
    while (model = this.pop()){
      model.destroy();
    }
  }
});


//---------------------------------------
// Company List View(ADD/DELETE)
// --------------
// The DOM element for a list of company items...
//---------------------------------------
var RestaurantListView = Backbone.View.extend({

    el:  $("#restaurants_holder"),

    initialize: function(options) {
      this.map = options.map;
      this.model.on('add', this.added_restaurant, this);

      //initialize position
      this.$el.css({display: 'none', right:'20px', top: '120px'}, 2000);
      this.$el.fadeIn('500');

      this.list_container = $('#restaurants_list_holder ul', this.$el);
      // alert("hello list view");
      this.render();
    },

    //----------------------------------
    // Events and event handlers
    //----------------------------------
    events: {
      'click #btn_pop_new_restaurant': 'popup_new_restaurant',
      'click #btn_delete_all_restaurants' : 'delete_all_restaurants'
    },

    //event handler for "new company" action
    popup_new_restaurant: function (map){
      if (Restaurants.length>15){
        alert('limited to 15!');
        return;
      }
      var restaurant= dummy_data_generator.get_dummy_restaurant(this.map);
      this.model.add_new(restaurant);
    },

    //event handler for "delete all companies" action
    delete_all_restaurants: function (){
      Restaurants.remove_all();
    },
    //----------------------------------
    // END Events and event handlers
    //----------------------------------

    //---------------------------------------
    // If a new company is added, create the proper views and render
    //---------------------------------------
    added_restaurant : function (restaurant){
      var marker_view = new RestaurantMarkerView({ model: restaurant, map: this.map });
      var item_view = new RestaurantListItemView({ model: restaurant, marker_view : marker_view });
      $(this.list_container).append(item_view.render().el);
    },

    //---------------------------------------
    // Render all
    //---------------------------------------
    render: function() {
      // alert("list view render method");
      this.model.each (this.added_restaurant, this);
    }
});


//---------------------------------------
// Company List Item View(list item)
// --------------
// The DOM element for an item in a list of company items...
//---------------------------------------
var RestaurantListItemView = Backbone.View.extend({

  initialize: function(options) {
    this.marker_view = options.marker_view; //retain instance of google marker
    this.model.on('remove', this.remove, this); //subscribe to remove events on model
    this.render();
  },

  //----------------------------------
  // Events and event handlers
  //----------------------------------
  events: {
    'mouseover a': 'show_restaurant_info',
    'mouseout a': 'hide_restaurant_info',
    'click button': 'ask_delete_restaurant',
    'click a.delete': 'delete_restaurant',
    'click a.detail': 'show_restaurant_detail'
  },

  show_restaurant_detail : function(){
    App.show_content();
  },

  //show marker bubble
  show_restaurant_info : function(){
    this.marker_view.show_restaurant_info.call(this.marker_view.marker);
  },

  //hide marker bubble
  hide_restaurant_info : function(){
    this.marker_view.hide_restaurant_info.call(this.marker_view.marker);
  },

  //clicked on "delete". show confirm button.
  ask_delete_restaurant : function(){
    $('button', this.$el).hide();
    $('a.delete', this.$el).fadeIn();
  },

  //delte Restaurant
  delete_restaurant : function(){
    this.model.clear();
  },
  //----------------------------------
  // END Events and event handlers
  //----------------------------------

  render: function() {
    this.$el.html('<li><a class="detail" href="#" company_id="' + this.model.get('company_id') + '">' + this.model.get('name') + '</a> <button class="close">x</button> <a href="#" style="display:none" class="close delete">confirm</a></li>');
    return this;
  },

  remove: function() {
    this.$el.html('');
  }
});



//---------------------------------------
// Restaurant Marker View
// --------------
// The DOM element for a restaurant marker...
//---------------------------------------
var RestaurantMarkerView = Backbone.View.extend({

    tagName:  "li",

    initialize: function(options) {
      var self = this;

      self.model = options.model;
      self.model.on('remove', self.remove, self);

      self.map = options.map;

      var pos = self.model.get('pos');

      // alert("restaurant.pos.lat  :::::"+pos);
      self.marker = new google.maps.Marker({
          map: self.map,
          position: new google.maps.LatLng(pos.lat, pos.lng),
          animation: google.maps.Animation.DROP,
          icon : './img/restaurant-blue-icon.png',
          title: self.model.name,
          descr : self.model.get('descr'),
          id : self.model.get('company_id')
      });

      self.marker.infowindow = new google.maps.InfoWindow({
        content: self.marker.descr
      });

      google.maps.event.addListener(self.marker, 'mouseover', self.show_restaurant_info);
      google.maps.event.addListener(self.marker, 'mouseout', self.hide_restaurant_info);
      google.maps.event.addListener(self.marker, 'click', self.show_restaurant_detail);
    },

    //---------------------------------------
    // Event handlers for marker events
    //---------------------------------------
    show_restaurant_detail : function(){
      this.hide_restaurant_info();
      App.show_content();
    },

    hide_restaurant_info : function(){
      this.setIcon('./img/restaurant-blue-icon.png');
      this.infowindow.close();
    },

    show_restaurant_info : function(){
      this.setIcon('./img/restaurant-blue-icon.png');
      this.infowindow.open(this.map, this);
    },

    render: function() { },

    remove : function(){
      this.marker.setMap(null);
      this.marker = null;
    }
});


/*****
*data-generate
*
*****/


// var dummy_data_generator = {

//   'reset' : function (){
//     Restaurants.remove_all();
//   },

//   'get_dummy_restaurant': function(){
//     var rnd_id = (new Date).getTime();
//     var restaurant = {
//       company_id : rnd_id,
//       name : Faker.Company.companyName(),
//       address: Faker.Address.streetAddress(),
//       pos: {lat: 41 + Math.random(), lon: -1.3 + Math.random()}
//     };

//     restaurant.descr = '<div>'+
//     '<div>'+
//     '</div>'+
//     '<h2>' + restaurant.name + ' <small>' + restaurant.address +  '</small></h2>'+
//     '<div>'+
//     '<img style="width:200px;height:200px;float:left;margin:5px 10px 5px 0px" src="http://lorempixel.com/200/200/" />' +
//     '<p>' + Faker.Lorem.paragraph() + '</p>' +
//     '<p>' + Faker.Lorem.paragraph() + '</p>' +
//     '<p>' + Faker.Lorem.paragraph() + '</p>' +
//     '</div>'+
//     '</div>';

//     return restaurant;
//   },

//   'repopulate' : function(){
//     Restaurants.remove_all();
//     for (var i = 0, l = 10; i < l ;  i++) {
//       Restaurants.add_new(this.get_dummy_restaurant());
//     }
//   }
// };

// dummy_data_generator.repopulate();

/**
**
*
**
**/
 var restaurant= new Restaurant();

var dummy_data_generator = {

  'reset' : function (){
    Restaurants.remove_all();
  },

  'get_dummy_restaurant': function(map){
    // alert("mapmapmapmapmapmapmap::::"+map);
   
  // alert("begin..... restaurant model.....");


  var request = {
      location: new google.maps.LatLng(52.246066,-7.139858,17),
      radius: 5000,
      types: ['restaurant']
    };
    var service = new google.maps.places.PlacesService(map);
    // alert("service or not:: : "+service);
     service.nearbySearch(request, function(results, status)
      {
        // alert("status"+status);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          // alert("result.length"+results.length);
            for (var i = 0; i < results.length; i++) {
       restaurant= results[i];
         }
       }
      });
     // alert("restaurant.name"+restaurant.name);
      restaurant.descr = '<div>'+
    '<div>'+
    '</div>'+
    '<h2>' + restaurant.name + ' <small>' + restaurant.address +  '</small></h2>'+
    '<div>'+
    '<img style="width:200px;height:200px;float:left;margin:5px 10px 5px 0px" src="http://lorempixel.com/200/200/" />' +
    '<p>' + Faker.Lorem.paragraph() + '</p>' +
    '<p>' + Faker.Lorem.paragraph() + '</p>' +
    '<p>' + Faker.Lorem.paragraph() + '</p>' +
    '</div>'+
    '</div>';
    // alert(" result mmmmmmmmmmmmmmmmm...."+restaurant+",,,,,name: "+restaurant.name);
    return restaurant;
      

   // alert("restaurant:"+restaurant);
    // var restaurant = {
    //   company_id : rnd_id,
    //   name : Faker.Company.companyName(),
    //   address: Faker.Address.streetAddress(),
    //   pos: {lat: 41 + Math.random(), lon: -1.3 + Math.random()}
    // };

    
  },

  'repopulate' : function(map){
    // Restaurants.remove_all();
   // for (var i = 0, l = 10; i < l ;  i++) {
      RestaurantList.add_new(this.get_dummy_restaurant(map));
    //}
  }
};

//dummy_data_generator.repopulate();

var Restaurants = new RestaurantList();


