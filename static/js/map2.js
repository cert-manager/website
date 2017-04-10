// When the window has finished loading create our google map below
//google.maps.event.addDomListener(window, 'load', initMap);

var allOffices = {}

function addOfficeLocation(obj) {
    allOffices[obj.name] = obj
}

function getDefaultMap() {
    return Object.keys(allOffices).filter(function(id) {
        return (allOffices[id] || {}).default
    })[0]
}

function initMap() {
    var defaultMapName = getDefaultMap()
    
}

function createMapOptions(center, styles) {
    if (typeof center == 'undefined') {
        center = new google.maps.LatLng(51.5241062, -0.1132942);
    }

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
        center: center,
        styles: styles,
        scrollwheel: false
    };
}

function defineMap(location) {

    switch (location) {
        case 'london':
            $('#london').addClass('current');
            $('#bristol').removeClass('current');
            center = new google.maps.LatLng(51.5241062, -0.1132942);
            break;
        case 'bristol':
            $('#london').removeClass('current');
            $('#bristol').addClass('current');
            center = new google.maps.LatLng(51.454722, -2.5849547);
            break;
        default:
            $('#london').addClass('current');
            $('#bristol').removeClass('current');
            center = new google.maps.LatLng(51.5241062, -0.1132942);
            break;
    }

    var mapElement = document.getElementById('map');
    var map = new google.maps.Map(mapElement, createMapOptions(center));

    var markerIcon = {
        url: "/img/png/map-marker.png",
        size: new google.maps.Size(28, 28),
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(14, 14)
    };

    var marker_bristol = new google.maps.Marker({
        position: new google.maps.LatLng(51.454935, -2.582713),
        map: map,
        title: 'Bristol',
        icon: markerIcon,
    });

    var content = '<img src="/img/png/logo-black.png" class="contact-map-logo">'

    var bristolInfoContent = content +
        '<address class="contact-map-address">' +
        'Bristol' +
        '<br />' +
        '<br />' +
        '1, Temple Way,' +
        '<br />' +
        'Bristol, BS2 0BY' +
        '<br />' +
        'UK' +
        '<br />' +
        '+44 (0) 7793 231 093' +
        '<br />' +
        '</address>';

    var bristolInfo = new google.maps.InfoWindow({
        content: bristolInfoContent
    });

    marker_bristol.addListener('click', function () {
        bristolInfo.open(map, marker_bristol);
    });

    var marker_london = new google.maps.Marker({
        position: new google.maps.LatLng(51.5241062, -0.1132942),
        map: map,
        title: 'London',
        icon: markerIcon,
    });

    var londonInfoContent = content +
        '<address class="contact-map-address">' +
        'London' +
        '<br />' +
        '<br />' +
        '14 Rosebery Ave,' +
        '<br />' +
        'London' +
        '<br />' +
        'EC1R 4TD' +
        '</address>';

    var londonInfo = new google.maps.InfoWindow({
        content: londonInfoContent
    });

    marker_london.addListener('click', function () {
        londonInfo.open(map, marker_london);
    });
}
