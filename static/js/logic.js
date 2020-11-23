// Url 
var url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get geoJSON data
d3.json(url, function(data) {
    create_features(data.features);
});

function create_features(earthquakeData) {

    // Earthquake info
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: create_marker,
        onEachFeature: onEachFeature
    });

    // Marker Size
    function marker_size(magnitude) {
        return magnitude * 3;
    }

    // Marker Color
    function marker_color(depth) {
        if (depth > 10 && depth <= 30) {
            return "blue";
        }
        else if (depth > 30 && depth <= 50) {
            return "green";
        }
        else if (depth > 50 && depth <= 70) {
            return "yellow";
        }
        else if (depth > 70 && depth <= 90) {
            return "orange";
        }        
        else if (depth > 90) {
            return "red";
        }
        else {
            return "purple";
        }
    }

    // Set pop-up for each marker
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h2>" + feature.properties.place +
        "</h2><hr><p>Magnitude: " + feature.properties.mag + "<br>Date :" + new Date(feature.properties.time) + "</p>");
    }

    // Style for each marker
    function create_marker(feature, latlng) {
        var style = {
            radius: marker_size(feature.properties.mag),
            fillOpacity: 0.5,
            color: marker_color(feature.geometry.coordinates[2]),
            weight: 1
        }
        return new L.CircleMarker(latlng, style)
    }

    create_map(earthquakes);
}

function create_map(earthquakes) {
    
    // Layers radio buttons
    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });
 
    var maps_layers = {
        "Grayscale": grayscale,
        "Satellite": satellite
    };

    // Earthquakes checkbox
    var maps_overlay = {
        "Earthquakes": earthquakes
    };

    // Map creation
    var myMap = L.map("map", {
        layers: [satellite, earthquakes],
        center: [15.5994, -28.6731],
        zoom: 1.5
    });
    
// Legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
 
var mapColors = ["blue", "green", "yellow", "orange", "red", "purple"];
 
    // Label range
    var labels = ["-10 to 10 km", "10 to 30 km", "30 to 50 km", "50 to 70 km", "70 to 90 km", "90+ km"];
    var list = '<ul style="list-style-type:none;"><li><b>Earthquake Depth</b></li>';
    var div = L.DomUtil.create("div");
 
    // Add li
    labels.forEach(function(x, i) {
        list += '<li>' + '<span style="color:' + mapColors[i] + '; background-color:' + mapColors[i] + '">box</span>' +
        '<span style="color:black">' + '&nbsp&nbsp&nbsp' + labels[i] + '</span></li>';
    });
 
    div.innerHTML += list + "</ul>";
    return div;
  };

  // Add legend
  legend.addTo(myMap);

  // Add layer control
  L.control.layers(maps_layers, maps_overlay, {collapsed: false}).addTo(myMap);


}