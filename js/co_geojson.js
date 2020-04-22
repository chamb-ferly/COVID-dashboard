// ---------------PANEL BODY---------------------

var geoUrl = "https://opendata.arcgis.com/datasets/fbae539746324ca69ff34f086286845b_0.geojson";
var geojson;

d3.json(geoUrl, function(data) {
  console.log(data);
  var properties = data.features.map(x => x.properties);

  var coPopulation = properties[0].State_Population;
  var coPosunknown = properties[0].State_Pos_Unknown;
  var coPoscases = properties[0].State_Pos_Cases;
  var coTested = properties[0].State_Number_Tested;
  var coHospital = properties[0].State_Number_Hospitalizations;
  var coDeaths = properties[0].State_Deaths;
  var coNumCounty = properties[0].State_Number_of_Counties_Pos;
  var coRate = properties[0].State_Rate_Per_100000;
  var dataDate = properties[0].Date_Data_Last_Updated;
  var dataSource = properties[0].Data_Source;

  
  // Select HTML element
  var coSummary = d3.select("#co-summary")
  // Clear demographic data
  coSummary.html('');
// onEachFeature: function(feature, data) {
  // Fill demographic data for metadata section
  coSummary.append('tr').text(`State Population: ${coPopulation}`);
  coSummary.append('tr').text(`Positive Cases: ${coPoscases}`);
  coSummary.append('tr').text(`Positives Unknown: ${coPosunknown}`);
  coSummary.append('tr').text(`Number Tested: ${coTested}`);
  coSummary.append('tr').text(`Total Hospitalizations: ${coHospital}`);
  coSummary.append('tr').text(`Total Deaths: ${coDeaths}`);
  coSummary.append('tr').text(`Number of Positive Counties: ${coNumCounty}`);
  coSummary.append('tr').text(`State Rate Per 100,000: ${coRate}`);
  coSummary.append('tr').text(`Data Last Updated: ${dataDate}`);
  coSummary.append('tr').text(`Data Source: ${dataSource}`);

  // County data table
  d3.select("#county-summary")
  .selectAll("tr")
  .data(properties)
  .enter()
  .append("tr")
  .html(function(p) {
    return `<td>${p.LABEL}</td><td>${p.County_Population}</td><td>${p.County_Pos_Cases}</td><td>${p.County_Rate_Per_100_000}</td><td>${((p.County_Pos_Cases /= coPoscases)*100).toFixed(5)}%</td>`;
  });

  
});



// ----------------- CO MAP ----------------------
var mymap = L.map('mapid').setView([39.079166, -105.49379], 7);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "pk.eyJ1IjoiY2hhbWItZmVybHkiLCJhIjoiY2s4Z2xnbmc1MDJ2YjNlcnVncWg4bWM4eiJ9.oRkZ3-0VtnzAvvgo2flEcQ"
}).addTo(mymap);


// CHLORAPLETH LAYER
d3.json(geoUrl, function(data) {
  // console.log(data);
  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "County_Pos_Cases",

    // Set color scale
    scale: ["#fffab5", "#4a9e86", "#06005c"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.6
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.6
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          mymap.fitBounds(event.target.getBounds());
        },
      });
      layer.bindPopup("<h10>" + feature.properties.LABEL + " County" + "</h10> <hr> <h11>" + "Population: " + feature.properties.County_Population + 
      "<br>Positive Cases: " + feature.properties.County_Pos_Cases + "</h11>");
    }
  }).addTo(mymap);

// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = geojson.options.limits;
  var colors = geojson.options.colors;
  var labels = [];

  // Add min & max
  var legendInfo = "<h11>Positive COVID Cases Reported</h11>" +
    "<div class=\"labels\">" +
      "<div class=\"min\">" + limits[0] + "</div>" +
      "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    "</div>";

  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

// Adding legend to the map
legend.addTo(mymap);

});

