import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import api from '../services/api';
import './SkillGraph.css';

const SkillGraphViewer = () => {
    const svgRef = useRef();

    useEffect(() => {
        const drawGraph = async () => {
            try {
                const response = await api.getSkillGraph();
                const { nodes, links } = response.data;

                // Clear previous svg content
                d3.select(svgRef.current).selectAll("*").remove();

                const width = 800;
                const height = 600;

                const svg = d3.select(svgRef.current)
                    .attr('width', width)
                    .attr('height', height)
                    .style('background-color', '#16213e')
                    .attr("viewBox", [0, 0, width, height]);

                const simulation = d3.forceSimulation(nodes)
                    .force("link", d3.forceLink(links).id(d => d.id).distance(100))
                    .force("charge", d3.forceManyBody().strength(-200))
                    .force("center", d3.forceCenter(width / 2, height / 2));

                const link = svg.append("g")
                    .attr("stroke", "#999")
                    .attr("stroke-opacity", 0.6)
                    .selectAll("line")
                    .data(links)
                    .join("line")
                    .attr("stroke-width", d => Math.sqrt(d.value || 1));

                const node = svg.append("g")
                    .selectAll("g")
                    .data(nodes)
                    .join("g")
                    .call(drag(simulation));

                node.append("circle")
                    .attr("r", 10)
                    .attr("fill", d => d.type === 'JobRole' ? '#e94560' : '#53bf9d');

                node.append("text")
                    .text(d => d.name)
                    .attr('x', 12)
                    .attr('y', 4)
                    .attr('fill', 'white')
                    .style('font-size', '12px');

                simulation.on("tick", () => {
                    link
                        .attr("x1", d => d.source.x)
                        .attr("y1", d => d.source.y)
                        .attr("x2", d => d.target.x)
                        .attr("y2", d => d.target.y);
                    node
                        .attr("transform", d => `translate(${d.x},${d.y})`);
                });

            } catch (error) {
                console.error("Failed to fetch skill graph:", error);
            }
        };

        drawGraph();

        const drag = simulation => {
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
            return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
        }
    }, []);

    return <svg ref={svgRef}></svg>;
};

export default SkillGraphViewer;
