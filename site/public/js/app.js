// Create our global collection of **Restaurants**.
var Restaurants = new RestaurantList();

//---------------------------------------
// The Application
// ---------------
// Our overall **AppView** is the top-level piece of UI.
//---------------------------------------
var AppView = Backbone.View.extend({

    el: $("#hub"),

    //--------------------------------------
    // Event wiring (events and event handlers)
    //--------------------------------------
    events: {
      'click #btn_content' : 'show_restaurants',
      // 'click #btn_map' : 'show_map'
    },

    //--------------------------------------
    // Show content event: triggered when user wants the "content" mode
    //--------------------------------------
    show_description:function()
    {
      var speed = 600;
      var self = this;
      self.restaurants_holder.fadeOut();
       setTimeout(function(){
        self.map_controls.fadeIn();
      }, 2 * speed);

    },
    show_restaurants: function (){
      var self = this;
      var top = 20;
      var speed = 600;
      //set content position and fade in
      self.restaurants_holder.animate({top: (top) + 'px'}, speed, function(){
       self.restaurants_holder.fadeIn();
      });
      //controls to switch back to map
      self.controls.fadeOut();
      //resize map canvas
      self.map_canvas.animate({height: (top) + 'px'}, speed);
    },

    //--------------------------------------
    // Show map event: triggered when user wants the "map" mode
    //--------------------------------------
    // show_map: function (){
    //   var self = this;
    //   var speed = 800;

    //   //hide content
    //   //self.main.fadeOut();

    //   //hide controls
    //   self.controls.hide();

    //   self.restaurants_holder.fadeIn();

    //   //resize map canvas. make map 100%
    //   self.map_canvas.animate({height: '100%'}, speed);

    //   setTimeout(function(){
    //     //show map controls
    //     self.map_controls.css({top: '80%'});
    //     self.map_controls.fadeIn();
    //   }, speed);
    // },

    //--------------------------------------
    // Initialize map
    //--------------------------------------
    _initialize_map : function(){
      var center = new google.maps.LatLng(52.246066,-7.139858);
      var styles = [
        {
          elementType: "geometry",
          stylers: [
            { lightness: 33 },
            { saturation: -90 }
          ]
        }
      ];

      var mapOptions = {
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: center,
          styles: styles,
      };
      this.map = new google.maps.Map(document.getElementById('map_canvas'),
        mapOptions);
    },

    //--------------------------------------
    // App Initialization
    //--------------------------------------
    initialize: function() {
      var self = this;

      //--------------------------------------
      // Cache UI control references
      //--------------------------------------
     // self.main = $('#main');
      self.controls = $('.nav_controls');
      //self.content_controls = $('#content_controls');
      self.map_controls = $('#map_controls');
      self.map_canvas = $('#map_canvas');
      self.header = $('header');
      self.restaurants_holder = $('#restaurants_holder');

      //initialize map
      self._initialize_map();

      //--------------------------------------
      // Initial control positions
      // Move header up (out of window)
      //--------------------------------------
      self.header.css({top:'-1000px'});
      self.header.animate({top: '0px'}, 1500);

      //hide all controls
      self.controls.hide();
      self.controls.css({top: '80%'});

      //self.map_controls.fadeIn();
      // setTimeout(function(){
      //   self.map_controls.fadeIn();
      // }, 1000);

       initRestaurant(self.map);

      //--------------------------------------
      // Fetch (with delay)
      //--------------------------------------
      setTimeout(function(){ //delay markers popp
        Restaurants.fetch();
        //create views
        var list_view = new RestaurantListView({model: Restaurants, map: self.map});
      }, 2000);
    }
});

// Load the application once the DOM is ready, using `jQuery.ready`:
var App = null;
$(function(){
  App = new AppView();
});

/**
**
**
**main page to load nearby restaurants from google map api
**
*/
function initRestaurant(map)
{
  var callback=function(results, status){
          var list_view=$("#list");
            for (var i = 0; i < results.length; i++) {
              var temp=results[i];
              console.log("temp"+results[i]);
                var item=$("<li><a href='#map_canvas'>"+temp.name+"</a></li>");//<img src='"+temp.icon+"'>

                list_view.append(item);
            }
            list_view.listview('refresh');
      }
    getGoogleRestaurant(this, map,callback);
}

 function getGoogleRestaurant(self, map, callback)
 {
   //todo get current location
    var request = {
      location: new google.maps.LatLng(52.246066,-7.139858),
      radius: 5000,
      types: ['restaurant']
    };
    var service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, $.proxy(callback,self));

 }