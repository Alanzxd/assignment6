import React from "react";
import { max, scaleBand, scaleLinear } from "d3";
import { XAxis, YAxis } from "./axes";

export function BarChart(props) {
    const { offsetX, offsetY, data, height, width, selectedAirline, setSelectedAirline } = props;

    // Calculate the maximum count for the x-axis scale
    const maximumCount = max(data, d => d.Count);

    // Define scales for x and y axes
    const xScale = scaleLinear().range([0, width]).domain([0, maximumCount]).nice();
    const yScale = scaleBand()
        .range([0, height])
        .domain(data.map(a => a.AirlineName)) // The domain is the list of airline names
        .padding(0.2);

    // Define a color function to highlight the selected bar
    const color = (d) => d.AirlineID === selectedAirline ? "#992a5b" : "#2a5599";

    // Define the onClick handler
    const handleClick = (d) => {
        if (selectedAirline === d.AirlineID) {
            // If the clicked bar is already selected, unselect it
            setSelectedAirline(null);
        } else {
            // Otherwise, select the clicked airline
            setSelectedAirline(d.AirlineID);
        }
    };

    return (
        <g transform={`translate(${offsetX}, ${offsetY})`}>
            {/* Render the bars */}
            {data.map(d => (
                <rect
                    key={d.AirlineID}
                    x={0}
                    y={yScale(d.AirlineName)}
                    width={xScale(d.Count)}
                    height={yScale.bandwidth()}
                    onClick={() => handleClick(d)} // Attach the onClick event handler
                    stroke="black"
                    fill={color(d)} // Apply the color based on selection
                    style={{ cursor: "pointer" }} // Change cursor to pointer on hover
                />
            ))}

            {/* Render the Y-axis */}
            <YAxis yScale={yScale} height={height} offsetX={offsetX} />

            {/* Render the X-axis */}
            <XAxis xScale={xScale} width={width} height={height} />
        </g>
    );
}
