dataLoc = "../data/samples.json";

function getMetaData() {
    // import data using d3
    d3.json(dataLoc).then((importedData) => {
        // console.log(importedData);

        // populates the drop down menu with the subject IDs
        d3.select("#selDataset").selectAll("option")
            .data(importedData.names)
            .enter()
            .append("option")
            .html(function(names) {
                return `<option> ${names} </option>`
            });

        firstID = importedData.names[0];

        buildTable(firstID);
        buildCharts(firstID);
    });
};

function optionChanged(sampleID) {
    buildTable(sampleID);
    buildCharts(sampleID);
};

function buildTable(sampleID) {
    // import data
    d3.json(dataLoc).then((importedData) => {

        var metaData = importedData.metadata;

        var filteredMetaData = metaData.filter(data => data.id == sampleID);
        
        var demographicInfo = filteredMetaData[0]
        
        var demographicPanel = d3.select("#sample-metadata");

        demographicPanel.html("");

        Object.entries(demographicInfo).forEach(([key, value]) => {
            demographicPanel.append("h5").text(`${key}:${value}`);
        });

        var washFrequency = demographicInfo.wfreq;

        var gaugePlot = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washFrequency,
                title: { text: "Navel Wash Frequency", font: {size: 18} },
                type: "indicator",
                mode: "gauge",
                gauge: {
                    axis: { range: [0, 9] },
                    bar: {color: "purple"}
                }
            }
        ];
        
        var gaugeLayout = { width: 600, height: 500};

        Plotly.newPlot('gauge', gaugePlot, gaugeLayout);

    })
};

function buildCharts(sampleID) {
    //import data
    d3.json(dataLoc).then((importedData) => {
        // get the sample data
        var metaData = importedData.samples;

        // filter the data based based on the sample ID selected by user
        var filteredData = metaData.filter(data => data.id == sampleID);
        
        // pulling just the relevant data and setting to variable for ease of code
        var results = filteredData[0];

        // setting the variables for the plot
        var otu_ids = results.otu_ids;
        var sample_values = results.sample_values;
        var otu_hoverText = results.otu_labels;

        // creating horizontal bar plot
        var horizontalBarPlot = [{
            x: sample_values.slice(0, 10).reverse(), // getting the top 10 OTUs
            y: otu_ids.map(id => `OTU ${id}`), // setting the axis labe to those OTUs
            type: "bar",
            orientation: "h",
            text: otu_hoverText // pulls the bacterial label information
        }];

        var horizontalPlotLayout = {
            title: "Bacterial Samples Found",
            xaxis: {title: "Number of Bacteria Found"},
            yaxis: {title: "Sample"}
        };

        // creating bubble plot
        var bubblePlot = [{
            x: otu_ids,
            y: sample_values,
            marker: {
                color: otu_ids,
                size: sample_values
            },
            mode: 'markers',
            text: otu_hoverText
        }];

        var bubblePlotLayout = {
            title: "OTU Samples per Subject",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Number of OTU Found", autorange: true}
        };

        // plotting the charts
        Plotly.newPlot("bar", horizontalBarPlot, horizontalPlotLayout);
        Plotly.newPlot("bubble", bubblePlot, bubblePlotLayout);
    })
};

getMetaData();
