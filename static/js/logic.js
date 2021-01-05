// Creating map object
var myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 2,
});

// Adding tile layer to the map
var streetmap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY,
  }
).addTo(myMap);

const url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function getColor(d) {
  return d > 6
    ? "#800026"
    : d > 5
    ? "#BD0026"
    : d > 4
    ? "#E31A1C"
    : d > 3
    ? "#FC4E2A"
    : d > 2
    ? "#FD8D3C"
    : d > 1
    ? "#FEB24C"
    : d > 0
    ? "#FED976"
    : "#FFEDA0";
}

// Grab the data with d3
d3.json(url, function (data) {
  //   console.log(data.features);
  var features = data.features;
  markers = [];
  magnitude = [];
  //   // Loop through data
  for (var i = 0; i < features.length; i++) {
    // Set the data location property to a variable
    var location = features[i].geometry;
    var properties = features[i].properties;
    // console.log(features);
    magnitude.push(properties.mag);

    var geojsonMarkerOptions = {
      radius: properties.mag + 2,
      fillColor: getColor(properties.mag),
      color: "000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    };

    L.geoJson(features[i], {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
    })
      .bindPopup(
        "<h4>" + properties.place + "</h4> Magnitude: " + properties.mag
      )
      .addTo(myMap);
  }
  console.log(d3.extent(magnitude));
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0, 1, 2, 3, 4, 5, 6];
    var legendInfo = "<div><h2>Magnitudes</h2>";

    div.innerHTML = legendInfo;

    for (var i = 0; i < limits.length; i++) {
      div.innerHTML +=
        "<ul>" +
        '<li style="background:' +
        getColor(limits[i]) +
        '"></li> ' +
        '<span class="limit">' +
        limits[i] +
        (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+") +
        "</span>" +
        "</ul>";
    }
    return div;
  };
  legend.addTo(myMap);

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);
});
