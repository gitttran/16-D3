// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create an svg wrapper, append svg, and chartgroup
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
// initiate Params

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale and y var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var x_scale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return x_scale;

};

function yScale(data, chosenYAxis) {
  // create scales
  var y_scale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
      d3.max(data, d => d[chosenYAxis]) * 1.2
    ])
    .range([0, height]);

  return y_scale;

};

// function used for updating xAxis and yAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomXAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
};

function renderXAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
};

function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "In Poverty (%)";
  }
  else if (chosenXAxis === "age") {
    var xlabel = "Age (Median)";
  }
  else {
    var xlabel = "Income";
  }

  if (chosenYAxis === "obesity") {
    var ylabel = "Obese (%)";
  }
  else if (chosenYAxis === "smokes"){
    var ylabel = "Smokes (%)";
  }
  else {
    var ylabel = "Lacks Healthcare";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv", function(err, data) {
  if (err) throw err;

  data.forEach(function(d){
    d.poverty = +d.poverty;
    d.age = +d.age;
    d.income = +d.income;
    d.healthcare = +d.healthcare;
    d.obesity = +d.obesity;
    d.smokes = +d.smokes;
  });

  var x_Scale = xScale(data, chosenXAxis);

  var y_Scale = yScale(data, chosenYAxis);

  var stateabbr = chartGroup.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .merge(stateabbr)
      .attr("dx", d => xLinearScale(d[chosenXAxis]))
      .attr("dy", d => yLinearScale(d[chosenYAxis])+5)
      .attr("text-anchor", "middle")
      .attr("textLength", "17px")
      .attr("lengthAdjust", "spacingAndGlyphs")
      .text(d => d.abbr);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(x_Scale);
  var leftAxis = d3.axisLeft(y_Scale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAsis]))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", ".5");

  // Create group for  3 x- axis labels

  var xlabelsGroup= chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);


  var poverty_label = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .classed("active", true)
    .text("In Poverty (%)");

  var age_label = xlabelsGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 20})`)
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .classed("inactive", true)
    .text("Age (Median)");

  var income_label = xlabelsGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 20})`)
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")
    .classed("inactive", true)
    .text("Household Income (Median)");

    // Create group for  3 y - axis labels
  var ylabelsGroup = chartGroup.append("g");

  var obese_label = ylabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")
    .classed("inactive", true)
    .text("Household Income (Median)");

  var smokes_label = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+20)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "smokes")
    .classed("inactive", true)
    .text("Smokes (%)");

  var healthcare_label = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare")
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  xlabelsGroup.selectAll("text")
  .on("click", function() {
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {
      chosenXAxis = value;
      xLinearScale = xScale(data, chosenXAxis);
      xAxis = renderXAxes(xLinearScale, xAxis);
      textGroup = renderText(textGroup, x_Scale, chosenXAxis, y_Scale, chosenYAxis);
      circlesGroup = renderCircles(circlesGroup, x_Scale, chosenXAxis, y_Scale, chosenYAxis);
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    if (chosenXAxis === "poverty") {
      poverty_label
        .classed("active", true)
        .classed("inactive", false);
      age_label
        .classed("active", false)
        .classed("inactive", true);
      income_label
        .classed("active", false)
        .classed("inactive", true);
    }
    else if (chosenXAxis === "age") {
      poverty_Label
        .classed("active", false)
        .classed("inactive", true);
      age_label
        .classed("active", true)
        .classed("inactive", false);
      income_label
        .classed("active", false)
        .classed("inactive", true);
    }
    else {
      poverty_label
        .classed("active", false)
        .classed("inactive", true);
      age_label
        .classed("active", false)
        .classed("inactive", true);
      income_label
        .classed("active", true)
        .classed("inactive", false);
      }
    }
  });

  ylabelsGroup.selectAll("text")
      .on("click", function() {
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
          chosenYAxis = value;
          yLinearScale = yScale (data, chosenYAxis);
          yAxis = renderYAxes(y_Scale, yAxis);
          textGroup = renderText(textGroup, x_Scale, chosenXAxis, y_Scale, chosenYAxis);
          circlesGroup = renderMarkers(circlesGroup, x_Scale, chosenXAxis, y_Scale, chosenYAxis);
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          if (chosenYAxis === "obesity") {
            obese_label
              .classed("active", true)
              .classed("inactive", false);
            smokes_label
              .classed("active", false)
              .classed("inactive", true);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "smokes") {
            obese_label
              .classed("active", false)
              .classed("inactive", true);
            smokes_label
              .classed("active", true)
              .classed("inactive", false);
            healthcare_label
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            obese_label
              .classed("active", false)
              .classed("inactive", true);
            smokes_label
              .classed("active", false)
              .classed("inactive", true);
            healthcare_label
              .classed("active", true)
              .classed("inactive", false);
          }
      })
});
