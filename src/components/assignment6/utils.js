function groupByAirline(data) {
    //Iterate over each route, producing a dictionary where the keys is are the ailines ids and the values are the information of the airline.
    let result = data.reduce((result, d) => {
        let currentData = result[d.AirlineID] || {
            "AirlineID": d.AirlineID,
            "AirlineName": d.AirlineName,
            "Count": 0
        }
        currentData.Count += 1;//Increment the count (number of routes) of ariline.
        result[d.AirlineID] = currentData; //Save the updated information in the dictionary using the airline id as key.
        return result;
    }, {})

    //We use this to convert the dictionary produced by the code above, into a list, that will make it easier to create the visualization. 
    result = Object.keys(result).map(key => result[key]);
    result = result.sort((a, b) => b.Count - a.Count); //Sort the data in descending order of count.
    return result
}

function groupByAirport(data) {
    //We use reduce to transform a list into a object where each key points to an aiport. This way makes it easy to check if is the first time we are seeing the airport.
    let result = data.reduce((result, d) => {
        //The || sign in the line below means that in case the first option is anything that Javascript consider false (this insclude undefined, null and 0), the second option will be used. Here if result[d.DestAirportID] is false, it means that this is the first time we are seeing the airport, so we will create a new one (second part after ||)
        
        let currentDest = result[d.DestAirportID] || {
            "AirportID": d.DestAirportID,
            "Airport": d.DestAirport,
            "Latitude": +d.DestLatitude,
            "Longitude": +d.DestLongitude,
            "City": d.DestCity,
            "Country": d.DestCountry,
            "Count": 0
        }
        currentDest.Count += 1
        result[d.DestAirportID] = currentDest

        //After doing for the destination airport, we also update the airport the airplane is departing from.
        let currentSource = result[d.SourceAirportID] || {
            "AirportID": d.SourceAirportID,
            "Airport": d.SourceAirport,
            "Latitude": +d.SourceLatitude,
            "Longitude": +d.SourceLongitude,
            "City": d.SourceCity,
            "Country": d.SourceCountry,
            "Count": 0
        }
        currentSource.Count += 1
        result[d.SourceAirportID] = currentSource
        return result
    }, {})

    //We map the keys to the actual airports, this is an way to transform the object we got in the previous step into a list.
    result = Object.keys(result).map(key => result[key])
    return result
}

function groupByCity(data) {
    // Iterate over each route, grouping by city, considering both source and destination cities
    let result = data.reduce((result, d) => {
        // Unique key for the destination city (combining city and country)
        let destKey = d.DestCity + ', ' + d.DestCountry;
        let currentDest = result[destKey] || {
            "City": d.DestCity,
            "Country": d.DestCountry,
            "Latitude": +d.DestLatitude,
            "Longitude": +d.DestLongitude,
            "Count": 0
        };
        currentDest.Count += 1;
        result[destKey] = currentDest;

        // Unique key for the source city
        let sourceKey = d.SourceCity + ', ' + d.SourceCountry;
        let currentSource = result[sourceKey] || {
            "City": d.SourceCity,
            "Country": d.SourceCountry,
            "Latitude": +d.SourceLatitude,
            "Longitude": +d.SourceLongitude,
            "Count": 0
        };
        currentSource.Count += 1;
        result[sourceKey] = currentSource;

        return result;
    }, {});

    // Convert the result object into an array
    result = Object.keys(result).map(key => result[key]);

    // Sort the result by Count in descending order
    result = result.sort((a, b) => b.Count - a.Count);

    return result;
}


export {
    groupByAirline, groupByAirport, groupByCity
}