import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './SkillGraph.css';

const SkillGraph = () => {
  const svgRef = useRef();
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/skills/graph');
      if (!response.ok) throw new Error('Failed to fetch graph data');
      const data = await response.json();
      setGraphData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching graph:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!graphData || !graphData.nodes.length) return;

    const width = 900;
    const height = 600;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Color scale by category
    const colorScale = d3.scaleOrdinal()
      .domain(['Programming Language', 'Framework', 'DevOps', 'AI/ML'])
      .range(['#4CAF50', '#2196F3', '#FF9800', '#9C27B0']);

    // Create force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Add arrow markers for links
    svg.append('defs').selectAll('marker')
      .data(['prerequisite'])
      .join('marker')
      .attr('id', d => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', '#999')
      .attr('d', 'M0,-5L10,0L0,5');

    // Draw links
    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graphData.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow-prerequisite)');

    // Draw nodes
    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(graphData.nodes)
      .join('circle')
      .attr('r', 20)
      .attr('fill', d => colorScale(d.category))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(drag(simulation));

    // Add labels
    const label = svg.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(graphData.nodes)
      .join('text')
      .text(d => d.name)
      .attr('font-size', 12)
      .attr('font-weight', 'bold')
      .attr('dx', 25)
      .attr('dy', 5)
      .style('pointer-events', 'none');

    // Add tooltips
    node.append('title')
      .text(d => `${d.name}\nCategory: ${d.category}\nDifficulty: ${d.difficulty}`);

    // Highlight on hover
    node.on('mouseenter', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 25)
        .attr('stroke-width', 3);
    }).on('mouseleave', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 20)
        .attr('stroke-width', 2);
    });

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // Drag functions
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

  }, [graphData]);

  if (loading) return (
    <div className="skill-graph-container">
      <div className="loading">Loading skill graph...</div>
    </div>
  );

  if (error) return (
    <div className="skill-graph-container">
      <div className="error">Error: {error}</div>
    </div>
  );

  return (
    <div className="skill-graph-container">
      <div className="header">
        <h1>Skill Relationship Graph</h1>
        <p>Interactive visualization of skills and their connections</p>
        {graphData && (
          <div className="stats">
            <span>Skills: {graphData.stats.total_skills}</span>
            <span>Connections: {graphData.stats.total_connections}</span>
          </div>
        )}
      </div>

      <svg ref={svgRef}></svg>

      <div className="legend">
        <h3>Categories</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{background: '#4CAF50'}}></span>
            <span>Programming Language</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: '#2196F3'}}></span>
            <span>Framework</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: '#FF9800'}}></span>
            <span>DevOps</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: '#9C27B0'}}></span>
            <span>AI/ML</span>
          </div>
        </div>
        <p className="hint">💡 Drag nodes to rearrange • Hover for details</p>
      </div>
    </div>
  );
};

export default SkillGraph;
