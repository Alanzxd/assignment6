import React, { useState, useEffect } from "react";
import { groupByCity } from "./utils";
import {
    forceSimulation,
    forceX,
    forceY,
    forceCollide,
    scaleLinear,
    min,
    max
} from "d3";

function AirportBubble(props) {
    const { width, height, countries, routes, selectedAirline } = props;
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        // Function to process data and run simulation
        const processData = () => {
            let filteredRoutes = routes;
            if (selectedAirline) {
                // Filter routes by selectedAirline
                filteredRoutes = routes.filter(a => a.AirlineID === selectedAirline);
            }

            // Group routes by city
            let cities = groupByCity(filteredRoutes);

            // Sort cities ascendingly by Count
            cities.sort((a, b) => a.Count - b.Count);

            // Define radius scale
            const countValues = cities.map(d => d.Count);
            const radiusScale = scaleLinear()
                .domain([min(countValues), max(countValues)])
                .range([2, width * 0.15]);

            // Assign radius to each city
            cities.forEach(d => {
                d.radius = radiusScale(d.Count);
            });

            // Run force simulation
            const simulation = forceSimulation(cities)
                .force("x", forceX(width / 2).strength(0.02))
                .force("y", forceY(height / 2).strength(0.02))
                .force("collide", forceCollide(d => d.radius + 1))
                .velocityDecay(0.2);

            simulation.tick(200); // Run simulation for 200 ticks

            // Update nodes with positions
            setNodes(cities);
        };

        processData();
    }, [routes, selectedAirline, width, height]);

    // Determine top 5 hubs (last 5 after sorting ascendingly)
    const top5 = nodes.slice(-5);

    return (
        <svg width={width} height={height}>
            <g id="bubble">
                {/* Render all circles */}
                {nodes.map((d, idx) => {
                    const isTop5 = top5.includes(d);
                    return (
                        <circle
                            key={idx}
                            cx={d.x}
                            cy={d.y}
                            r={d.radius}
                            fill={isTop5 ? "#ADD8E6" : "#2a5599"}
                            stroke="black"
                            strokeWidth="2"
                        />
                    );
                })}

                {/* Render labels for top 5 hubs */}
                {top5.map((d, idx) => (
                    <text
                        key={`label-${idx}`}
                        x={d.x}
                        y={d.y}
                        style={{
                            textAnchor: "middle",
                            stroke: "pink",
                            strokeWidth: "0.5em",
                            fill: "#992a2a",
                            fontSize: 16,
                            fontFamily: "cursive",
                            paintOrder: "stroke",
                            strokeLinejoin: "round"
                        }}
                    >
                        {d.City}
                    </text>
                ))}
            </g>
        </svg>
    );
}

export { AirportBubble };
