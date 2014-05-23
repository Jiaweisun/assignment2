var map;
var infowindow;
var  pyrmont;

function showPosition(position){
  pyrmont = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);  
}

function initialize() {
  if(navigator.geolocation)
  {
     navigator.geolocation.getCurrentPosition(showPosition);
     pyrmont = new google.maps.LatLng(52.246066,-7.139858,17);
    
  }

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: pyrmont,
    zoom: 13,
    mapTypeControlOptions: { 
    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    }, 
    zoomControl: true, 
    zoomControlOptions: { 
      style: google.maps.ZoomControlStyle.SMALL
    }
  });

  var request = {
    location: pyrmont,
    radius: 5000,
    types: ['restaurant']
  };

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  // alert(place);
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    animation: google.maps.Animation.DROP,
    icon : './img/restaurant-blue-icon.png'
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);