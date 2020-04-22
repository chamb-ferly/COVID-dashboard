// ----------------- STRINGENCY DATA ------------------------
// var url = "https://covidtrackerapi.bsg.ox.ac.uk/api/stringency/date-range/2020-01-02/2020-12-31";

// d3.json(url, function(stringencyData) {
//     objectDate = stringencyData.data;
//     objectCode = stringencyData.data.objectDate;
//     console.log(objectCode)    
// });

d3.csv("./data/stringency_country.csv", function(csvData) {
    // console.log(csvData);

    // function optionChanged(countrySel_1) {
    //     plotChartjs(countrySel_1)
    // }

    // for (let [key,value] of Object.entries(csvData)) {
    //     objectData = (`${key}: ${value}`);
    //     // console.log(objectData);
    // }

    for (i=0; i < csvData.length; i++) {
        aData = csvData[i];
        bData = aData[i].CountryName;
        console.log(bData[i]);

    }
    // assign variables
    var countryMap = csvData.map(x => x.CountryName);
    // console.log(countryMap);
    var dateValue = csvData.map(x => x.Date);
    // console.log(dateValue);
    var schoolClosed = csvData.map(x => x.S1_Schoolclosing);
        // console.log(schoolClosed);
    var workClosed = csvData.map(x => x.S2_Workplaceclosing);
    var eventCancel = csvData.map(x => x.S3_Cancelpuplicevents);
    var publicTransport = csvData.map(x => x.S4_Closepublictransport);
    var infoCampaign = csvData.map(x => x.S5_Publicinformationcampaigns);
    var intTravel = csvData.map(x => x.S7_Internationaltravelcontrols);
    var fiscal = csvData.map(x => x.S8_Fiscallmeasures);
    var monetary = csvData.map(x => x.S9_Monetarymeasures);
    var healthcareInvest = csvData.map(x => x.S10_Emergencyinvestmentinhealthcare);
    var vaccineInvest = csvData.map(x => x.S11_InvestmentinVaccines);
    var testing = csvData.map(x => x.S12_Testingframework);
    var contactTrace = csvData.map(x => x.S13_Contacttracing);
    var posCases = csvData.map(x => x.ConfirmedCases);
    var deaths = csvData.map(x => x.ConfirmedDeaths);
    var indexDisplay = csvData.map(x => x.StringencyIndexForDisplay);

    // define date format
    dateFormat = "YYYYMMDD";
    // remove duplicates from country name
    var countryList = countryMap.filter(function(item, pos) {
        return countryMap.indexOf(item) == pos;
    })

    // Append options to the dropdownmenu with countryList
    for (var i = 0; i < countryList.length; i++) {
        dropdownMenu = d3.select("#selCountry1");
        dropdownMenu.append("option").text(countryList[i]);
    }
        // function chartJs(countrySel_1) {
    


// function plotChartjs(countrySel_1) {
//     console.log(`Selection: ${countrySel_1}`);

        var csv = "./data/stringency_country.csv"

        d3.csv(csv, function(csvData) {
        // console.log(csvData);

        selectionData = csvData.filter(x => x.CountryName === countrySel_1)

        // latestDate = dataValue[dateValue.length - 1]
         
        // Select HTML element
        var dateCard = d3.select('#date')
        var schoolCard = d3.select('#school');
        var workCard = d3.select('#work');
        var eventCard = d3.select('#events');
        var caseCard = d3.select('#cases');
        var deathCard = d3.select('#deaths');

        // Clear windows
        dateCard.html('');
        schoolCard.html('');
        workCard.html('');
        eventCard.html('');
        caseCard.html('');
        deathCard.html('');

        // Append Values
        // dateCard.append('p').text(`${selectionData[-1].latestDate}`);
        schoolCard.append('p').text(`${selectionData[-1].S1_Schoolclosing}`);
        workCard.append('p').text(`${selectionData[-1].S2_Workplaceclosing}`);
        eventCard.append('p').text(`${selectionData[-1].S3_Cancelpuplicevents}`);
        caseCard.append('p').text(`${selectionData[-1].ConfirmedCases}`);
        deathCard.append('p').text(`${selectionData[-1].ConfirmedDeaths}`);


        // Build Table
        // County data table
        d3.select("#stringency_index")
        .selectAll("tr")
        .data(csvData)
        .enter()
        .append("tr")
        .html(function(x) {
            return `<td>${x.CountryName}</td>
            <td>${x.Date}</td>
            <td>${x.S1_Schoolclosing}</td>
            <td>${x.S2_Workplaceclosing}</td>
            <td>${x.S3_Cancelpuplicevents}</td>
            <td>${x.S4_Closepublictransport}</td>
            <td>${x.ConfirmedCases}</td>
            <td>${x.ConfirmedDeaths}</td>
            <td>${x.StringencyIndexForDisplay}</td>`
        });

  
        // var schoolLine = [{
        //     x: dateValue,
        //     y: schoolClosed,
        // }]
        
        // default country
        var countrySel_1='Aruba';

        var ctx = document.getElementById('canvas');
        // var color = Chart.helpers.color;
        
        var config = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                // labels,
                
                datasets: [{
                    label: 'School Closure Response',
                    // backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                    data: [{selectionData,
                        x: dateValue,
                        y: schoolClosed
                    }]
                }]
        },

        // Configuration options go here
        options: {
            title: {
                text: 'Economic Response to COVID-19 by Country'
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'series',
                    bounds: 'ticks',
                    time: {
                        parser: dateFormat,
                        displayFormats: {
                            day: 'MMM D'
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'value'
                    }
                }]
            },
        },
    },
        )
    window.onload = function() {
            var ctx = document.getElementById('canvas').getContext('2d');
            window.myLine = new Chart(ctx, config);
        };
    
        document.getElementById('selCountry1').addEventListener('click', function() {
            config.data.datasets.forEach(function(dataset) {
                dataset.data.forEach(function(selectionData) {
                    selectionData = csvData.filter(x => x.CountryName === countrySel_1)
                });
            });
    
            window.myLine.update();
        });
    });
});
// plotChartjs('Aruba');
