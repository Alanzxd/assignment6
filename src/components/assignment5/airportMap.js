import React from "react";
import { geoPath, geoMercator } from "d3-geo";
import { Routes } from './routes'
import { count } from "d3";


function AirportMap(props){
    const {width, height, countries, airports, routes, selectedAirline} = props;
    //TODO: 
    // 1.Define a projection which is geoMercator; 
    // set .scale(97), and .translate([width/2, height/2+20]) -- Done
    // 2. Define a path generator using geoPath() -- Done
    // 3. Plot the world map; remember to use countries.features.map(); (Note: stroke is "#ccc", and color is "#eee") -- Done
    // 4. Plot the airports; remember to use routes.map(); (Note: radius is 1; color is "#2a5599"); -- Done

    const projection = geoMercator()
        .scale(97)
        .translate([width / 2, height / 2 + 20]);

    const path = geoPath().projection(projection);

    return (
        <g>
            {countries.features.map((feature, index) => (
                <path
                    key={`country-${index}`}
                    d={path(feature)}
                    stroke="#ccc"
                    fill="#eee"
                />
            ))}
            {airports.map((airport, index) => (
                <circle
                    key={`airport-${index}`}
                    cx={projection([airport.Longitude, airport.Latitude])[0]}
                    cy={projection([airport.Longitude, airport.Latitude])[1]}
                    fill="#2a5599"
                    r={1}
                    
                />
            ))}
            <Routes projection={projection} routes={routes} selectedAirline={selectedAirline} />
        </g>
    );
}

export { AirportMap };