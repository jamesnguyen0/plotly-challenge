// read in JSON file and build the plot
function buildPlots(sample) {
    d3.json("samples.json").then(function(data) {
        // filter data by "names"
        var sampleNames = data.samples.filter(name => name.id === sample)[0];
        var sampleValues = sampleNames.sample_values
        var otuIDs = sampleNames.otu_ids
        var otuLabels = sampleNames.otu_labels
        
        // slice the top 10 OTUs
        sliceSampleValues = sampleValues.slice(0,10);
        sliceOtuIds = otuIDs.slice(0,10);
        sliceLabels = otuLabels.slice(0,10);

        // reverse the array
        reverseSample = sliceSampleValues.reverse();
        reverseOtuIds = sliceOtuIds.reverse();

    // build horizontal bar chart
    var trace1 = {
        x: reverseSample,
        y: reverseOtuIds.map(object => `OTU: ${object}`),
        type: "bar",
        orientation: "h"
    };

    // build bubble chart
    var trace2 = {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
            size: sampleValues,
            color: otuIDs
        }
    };
    
    // data
    var otuChart = [trace1, trace2];

    // apply the bar chart to the layout
    var layout1 = {
      title: "OTU Samples",  
      margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    };

    var layout2 = {
        title: "OTU IDs",
        height: 600,
        width: 1000
    };

    Plotly.newPlot("bar", [trace1], layout1)
    Plotly.newPlot("bubble", [trace2], layout2)
    
    // build demographics data
    var demoList = d3.select("#sample-metadata")
    var demoSelect = data.metadata.filter(name => name.id == sample)[0];
    
    //clear the demoList selection
    demoList.html("")
    
    Object.entries(demoSelect).forEach(function([key, value]) {
        console.log(key, value);
        
        //append the key and value pairs to the demographics div
        demoList.append("p").text(`${key}: ${value}`)
    })
    })
}

function optionChanged(newID) {
    buildPlots(newID)
}
// function called when a dropdown menu item is selected
function getData() {
    // select the dropdown menu
    var dropDown = d3.select("#selDataset");

    d3.json("samples.json").then(function(data) {
        var samples = data.names

        samples.forEach((sample) => {
            dropDown.append("option").text(sample) 
        }) 
        buildPlots(samples[0])
    })
}
getData()