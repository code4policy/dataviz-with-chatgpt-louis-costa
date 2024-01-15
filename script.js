// Load the CSV data
d3.csv("311_boston_data.csv", d => {
  return {
    reason: d.reason,
    count: +d.Count // convert string to number
  };
}).then(data => {
  // Sort and slice the top 10 reasons
  let topTenData = data.sort((a, b) => d3.descending(a.count, b.count)).slice(0, 10);

  // Set up the dimensions and margins of the graph
  const margin = { top: 30, right: 30, bottom: 70, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  // Append the svg object to the body of the page
  const svg = d3.select("#chart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // X axis
  const x = d3.scaleBand()
    .range([0, width])
    .domain(topTenData.map(d => d.reason))
    .padding(0.2);
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(topTenData, d => d.count)])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Bars
  svg.selectAll("mybar")
    .data(topTenData)
    .join("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.reason))
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.count));
});
