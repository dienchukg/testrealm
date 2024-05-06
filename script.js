fetch('https://raw.githubusercontent.com/dienchukg/testrealm/master/db.json') // Assuming your JSON server is running on localhost:3000
  .then(response => response.json())
  .then(data => {
    // Parse and extract necessary fields
    const boardgames = data.slice(0, 40).map(item => ({
      title: item.title,
      age: item.minage,
      players: item.maxplayers,
      rating: item.rating.rating,
      reviewsCount: item.rating.num_of_reviews
    }));

    // Create scatterplot using D3.js
    const svgWidth = 800;
    const svgHeight = 600;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select('body').append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(boardgames, d => d.reviewsCount)])
      .range([margin.left, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 10])
      .range([height, margin.top]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    svg.selectAll('circle')
      .data(boardgames)
      .enter().append('circle')
      .attr('cx', d => xScale(d.reviewsCount))
      .attr('cy', d => yScale(d.rating))
      .attr('r', 5)
      .attr('fill', d => colorScale(d.players));

    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    // Add y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

         // Add legend
    const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${width - 100},${margin.top})`);

  const legendData = [2, 3, 4, 5]; // Example player counts

  legend.selectAll('.legend-item')
    .data(legendData)
    .enter().append('circle')
    .attr('class', 'legend-item')
    .attr('cx', 0)
    .attr('cy', (d, i) => i * 20)
    .attr('r', 5)
    .attr('fill', d => colorScale(d));

  legend.selectAll('.legend-label')
    .data(legendData)
    .enter().append('text')
    .attr('class', 'legend-label')
    .attr('x', 10)
    .attr('y', (d, i) => i * 20 + 5)
    .text(d => `${d} Players`);
  })
  
  .catch(error => console.error('Error loading data:', error));