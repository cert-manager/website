// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', initMap);
var allOffices = {}
var allMapLocations = {}

function addOfficeLocation(obj) {
    allOffices[obj.name] = obj
}

function getDefaultLocation() {
    return Object.keys(allOffices).filter(function(id) {
        return (allOffices[id] || {}).default
    })[0]
}

function getOfficeLocation(location) {
    return allOffices[location]
}

function getMapCenter(info) {
    return new google.maps.LatLng(parseFloat(info.lat), parseFloat(info.lon))
}

function initMap() {
    createMap()
    focusMap(getDefaultLocation())
}

function createMapOptions() {
    var officeInfo = getOfficeLocation(getDefaultLocation())
    if (typeof styles == 'undefined') {
        styles = [{
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#e9e9e9"}, {"lightness": 17}]
        }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{"color": "#f5f5f5"}, {"lightness": 20}]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#ffffff"}, {"lightness": 17}]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#ffffff"}, {"lightness": 29}, {"weight": 0.2}]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{"color": "#ffffff"}, {"lightness": 18}]
        }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{"color": "#ffffff"}, {"lightness": 16}]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{"color": "#f5f5f5"}, {"lightness": 21}]
        }, {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{"color": "#dedede"}, {"lightness": 21}]
        }, {
            "elementType": "labels.text.stroke",
            "stylers": [{"visibility": "on"}, {"color": "#ffffff"}, {"lightness": 16}]
        }, {
            "elementType": "labels.text.fill",
            "stylers": [{"saturation": 36}, {"color": "#333333"}, {"lightness": 40}]
        }, {"elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{"color": "#f2f2f2"}, {"lightness": 19}]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#fefefe"}, {"lightness": 20}]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#fefefe"}, {"lightness": 17}, {"weight": 1.2}]
        }];
    }

    return {
        zoom: 16,
        center: getMapCenter(officeInfo),
        styles: styles,
        scrollwheel: false
    };
}

var theMap = null

function createMap() {
    var mapElement = document.getElementById('map');
    theMap = new google.maps.Map(mapElement, createMapOptions());

    var markerIcon = {
        url: "/img/png/map-marker.png",
        size: new google.maps.Size(28, 28),
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(14, 14)
    };

    Object.keys(allOffices || {}).forEach(function(key){
        var officeInfo = allOffices[key]

        var marker = new google.maps.Marker({
            position: getMapCenter(officeInfo),
            map: theMap,
            title: key,
            icon: markerIcon,
        });

        var content = '' + 
            '<img src="/img/png/newlogoblack.png" class="contact-map-logo">' +
            '<address class="contact-map-address">' +
            officeInfo.name + '<br /><br />' +
            officeInfo.address.join('<br />') +
            '</address>';

        var infoWindow = new google.maps.InfoWindow({
            content: content
        });

        allMapLocations[key] = {
            marker: marker,
            infoWindow: infoWindow
        }
    })
}

function focusMap(location) {

    // highlight the button
    var officeInfo = getOfficeLocation(location)
    if(!officeInfo) {
        console.error('no location found for: ' + location)
        return
    }
    Object.keys(allOffices || {}).forEach(function(key){
        if(key == officeInfo.name) {
            $('#' + key).addClass('current')
        }
        else {
            $('#' + key).removeClass('current')   
        }
    })

    var mapItems = allMapLocations[location]
    if(!officeInfo) {
        console.error('no mapItems found for: ' + location)
        return
    }
    var center = getMapCenter(officeInfo)
    // center the map
    theMap.setCenter(center)

    var infoWindow = mapItems.infoWindow
    infoWindow.open(theMap, mapItems.marker)
}
