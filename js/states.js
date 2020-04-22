// ---------------PANEL BODY---------------------

// Populate dropdown menu
var url = "https://covidtracking.com/api/v1/states/current.json";

// d3.json(url, function(data) {
//     console.log(data);
// });


// Populate dropdown menu
d3.json(url, function(data) {
        
    var data = data;
    console.log(data);
    
    // Isolate patient IDs to add to dropdown
    var stateIDs = data.map(x => x.state);
    console.log(stateIDs);

    // Append options to the dropdownmenu with patientIDs
    for (var i = 0; i < stateIDs.length; i++) {
        dropdownMenu = d3.select("#selState");
        dropdownMenu.append("option").text(stateIDs[i]);
    };
});


// // Event handler
function optionChanged (stateSel) {
    console.log(stateSel);
    plotCurrent(stateSel);
    plotHistorical(stateSel)
}


function plotCurrent (stateSel) {

    // Tracking when the function changes
    console.log(`Selection:${stateSel}`);


    // Read data in json and create variables for data and patientIDs
    // Creating a promise to work with data - so all other manipulation must be within this function
    d3.json(url, function(data) {

        // var recentData = data.filter(x => x.date === "2020-04-06")

        var selectionData = data.filter(x => x.state === stateSel);
        console.log(selectionData);


        // Select HTML element
        var casesWindow = d3.select('#cases');
        var deathsWindow = d3.select('#deaths');
        var hospitalizationsWindow = d3.select('#hospitalizations');
        var testsWindow = d3.select('#tests');

        // Clear windows
        casesWindow.html('');
        deathsWindow.html('');
        hospitalizationsWindow.html('');
        testsWindow.html('');
  
        // casesWindow.append('p').text(`${selectionData[0].state}`);
        casesWindow.append('p').text(`${selectionData[0].positive}`);

        // deathsWindow.append('p').text(`${selectionData[0].state}`);
        deathsWindow.append('p').text(`${selectionData[0].death}`);

        // hospitalizationsWindow.append('p').text(`${selectionData[0].state}`);
        hospitalizationsWindow.append('p').text(`${selectionData[0].hospitalized}`);

        // testsWindow.append('p').text(`${selectionData[0].state}`);
        testsWindow.append('p').text(`${selectionData[0].totalTestResults}`);


        // Chart - combined tests cases, hospitalized by state
        var currentStates = data.map(x => x.state);
        var totalTests = data.map(x => x.totalTestResults);
        var totalCases = data.map(x => x.positive);
        var totalHospitalized = data.map(x => x.hospitalized);

        var combinedData = [{
            x: currentStates,
            y: totalTests,
            type: "bar",
            name: "Total Tests",
            marker: {
                color: "##27608a"
              }
        },
        {
            x: currentStates,
            y: totalCases,
            type: "bar",
            name: "Total Cases",
            marker: {
                color: "#5cc19e"
              }
        },
        {
            x: currentStates,
            y: totalHospitalized,
            type: "bar",
            name: "Total Hospitalized",
            marker: {
                color: "#f49439"
              }
        }];   

        var combinedLayout = {
            title: "Tests, Cases, and Hospitalizations by State", 
            yaxis: {title: ""},
            height: 400,
            width: 1200
        };

        Plotly.newPlot("combineddata", combinedData, combinedLayout);

        // Map attempt

        var stateList = []
        var caseList = []

        for (i = 0; i < currentStates.length; i++) {
            state = currentStates[i];
            stateList.push(state);
        };

        for (i = 0; i < totalCases.length; i++) {
            cases = totalCases[i] / 800;
            caseList.push(cases);
        }

        var mapData = [{
            type: 'scattergeo',
            locationmode: 'USA-states',
            locations: stateList ,
            hoverinfo: 'text',
            text: stateList,
            marker: {
                size: caseList,
                line: {
                    color: 'black',
                    width: 2
                },
            }
        }];
    
        var mapLayout = {
            title: 'US Cases Bubble',
            showlegend: false,
            geo: {
                scope: 'usa',
                projection: {
                    type: 'albers usa'
                },
                showland: true,
                landcolor: 'rgb(217, 217, 217)',
                subunitwidth: 1,
                countrywidth: 1,
                subunitcolor: 'rgb(255,255,255)',
                countrycolor: 'rgb(255,255,255)'
            },
            height: 1000,
            width: 1000
        }
    
        Plotly.newPlot("bubblemap", mapData, mapLayout, {showLink: false});

                
        var cloroData = [{
            type: 'choropleth',
            locationmode: 'USA-states',
            locations: stateList,
            z: totalCases,
            text: stateList,
            autocolorscale: true
        }];

        var cloroLayout = {
        title: 'Cloro Cases',
            geo:{
                scope: 'usa',
                countrycolor: 'rgb(255, 255, 255)',
                showland: true,
                landcolor: '#27608a',
                showlakes: true,
                lakecolor: 'rgb(255, 255, 255)',
                subunitcolor: 'rgb(255, 255, 255)',
                lonaxis: {},
                lataxis: {}
            },
            height: 1000,
            width: 1000
        };
        Plotly.newPlot("colormap", cloroData, cloroLayout, {showLink: false})

})
}


function plotHistorical (stateSel) {
    url = "https://covidtracking.com/api/v1/states/daily.json"
    d3.json(url, function(data) {

        console.log(data)

        // Isolating data to just the selected State
        var selData = data.filter(x => x.state === stateSel);

        // Isolate and reformat date data
        var selDates = selData.map(x => x.date);
        var reformattedDates = []

        for (i=0; i < selDates.length; i++) {
            adate = selDates[i];
            newdate = adate.toString().replace(/(\d{4})(\d{2})(\d+)/, '$1-$2-$3');
            reformattedDates.push(newdate);
            console.log(newdate);
        };

        var selCases = selData.map(x => x.positive);
        var selDeaths = selData.map(x => x.death);

        var stateData = [{
            x: reformattedDates,
            y: selCases,
            name: "Cases",
            type: "bar",
            marker: {
                color: "#5cc19e"
              }
        },
        {
            x: reformattedDates,
            y: selDeaths,
            name: "Deaths",
            type: "bar",
            marker: {
                color: "#f49439"
              }
        }]

        var stateLayout = {
            title: `${stateSel}`, 
            yaxis: {title: "Total Cases"},
            height: 300,
            width: 1200
        };

        Plotly.newPlot("historicalstate", stateData, stateLayout);
    })
}

function graphjs(stateSel) {

    var url = "https://covidtracking.com/api/v1/states/current.json";

    d3.json(url, function(data) {

        var currentStates = data.map(x => x.state);
        var totalTests = data.map(x => x.totalTestResults);
        var totalCases = data.map(x => x.positive);
        var totalHospitalized = data.map(x => x.hospitalized);

        var ctx = document.getElementById('mychart');

        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'bar',

            // The data for our dataset
            data: {
                labels: currentStates,
                datasets: [{
                    label: 'Playing with Chart.js',
                    backgroundColor: '#5cc19e',
                    borderColor: 'rgb(255, 99, 132)',
                    data: totalCases, totalTests, totalHospitalized
                }]
        },

        // Configuration options go here
        options: {}
    })
});
}

// Default plot: Colorado
plotCurrent ('AK')
plotHistorical ('AK')
graphjs('AK')