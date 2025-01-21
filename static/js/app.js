// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sampleMetadata = metadata.filter(item => item.id === parseInt(sample));

    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (const [key, value] of Object.entries(sampleMetadata[0])) {
      metadataPanel.append('div').text(`${key}: ${value}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let fullSample = samples.filter(item => item.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = fullSample[0].otu_ids;
    let otu_labels = fullSample[0].otu_labels;
    let sample_values = fullSample[0].sample_values;

    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values
      },
      text: otu_labels
    };

    // Set up the Layout
    let layout1 = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"}
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [trace1], layout1);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Don't forget to slice and reverse the input data appropriately
    let topTen = sample_values.slice(0, 10).reverse();
    let ticks = otu_ids.slice(0, 10).map(id => `OTU ${String(id)}`).reverse();
    let text2 = otu_labels.slice(0, 10).reverse();

    // Build a Bar Chart
    let trace2 = {
      x: topTen,
      y: ticks,
      type: "bar",
      orientation: "h",
      text: text2
    };

    // Set up the Layout
    let layout2 = {
      title:"Top 10 Bacteria Cultures Found",
      xaxis: {title: "Number of Bacteria"}
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [trace2], layout2);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(name => {
      dropdownMenu.append('option').attr('value', name).text(name);
    });

    // Get the first sample from the list
    let sample = dropdownMenu.property("value");

    // Build charts and metadata panel with the first sample
    buildCharts(sample);
    buildMetadata(sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
