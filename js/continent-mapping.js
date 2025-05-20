// Create a simple continent mapping for countries
const continentMapping = {
    // North America
    "USA": "North America",
    "CAN": "North America",
    "MEX": "North America",
    "GTM": "North America",
    "BLZ": "North America",
    "SLV": "North America",
    "HND": "North America",
    "NIC": "North America",
    "CRI": "North America",
    "PAN": "North America",
    "CUB": "North America",
    "JAM": "North America",
    "HTI": "North America",
    "DOM": "North America",
    "PRI": "North America",
    "BHS": "North America",
    "TTO": "North America",
    "BRB": "North America",
    
    // South America
    "COL": "South America",
    "VEN": "South America",
    "GUY": "South America",
    "SUR": "South America",
    "BRA": "South America",
    "ECU": "South America",
    "PER": "South America",
    "BOL": "South America",
    "PRY": "South America",
    "CHL": "South America",
    "ARG": "South America",
    "URY": "South America",
    
    // Europe
    "GBR": "Europe",
    "IRL": "Europe",
    "FRA": "Europe",
    "DEU": "Europe",
    "ITA": "Europe",
    "ESP": "Europe",
    "PRT": "Europe",
    "BEL": "Europe",
    "NLD": "Europe",
    "LUX": "Europe",
    "CHE": "Europe",
    "AUT": "Europe",
    "GRC": "Europe",
    "SWE": "Europe",
    "NOR": "Europe",
    "FIN": "Europe",
    "DNK": "Europe",
    "ISL": "Europe",
    "EST": "Europe",
    "LVA": "Europe",
    "LTU": "Europe",
    "POL": "Europe",
    "CZE": "Europe",
    "SVK": "Europe",
    "HUN": "Europe",
    "ROU": "Europe",
    "BGR": "Europe",
    "SVN": "Europe",
    "HRV": "Europe",
    "BIH": "Europe",
    "SRB": "Europe",
    "MNE": "Europe",
    "MKD": "Europe",
    "ALB": "Europe",
    "UKR": "Europe",
    "BLR": "Europe",
    "MDA": "Europe",
    "RUS": "Europe",
    
    // Asia
    "TUR": "Asia",
    "CYP": "Asia",
    "SYR": "Asia",
    "LBN": "Asia",
    "ISR": "Asia",
    "JOR": "Asia",
    "SAU": "Asia",
    "YEM": "Asia",
    "OMN": "Asia",
    "ARE": "Asia",
    "QAT": "Asia",
    "BHR": "Asia",
    "KWT": "Asia",
    "IRQ": "Asia",
    "IRN": "Asia",
    "AFG": "Asia",
    "PAK": "Asia",
    "IND": "Asia",
    "NPL": "Asia",
    "BTN": "Asia",
    "BGD": "Asia",
    "LKA": "Asia",
    "MDV": "Asia",
    "MMR": "Asia",
    "THA": "Asia",
    "LAO": "Asia",
    "VNM": "Asia",
    "KHM": "Asia",
    "MYS": "Asia",
    "SGP": "Asia",
    "IDN": "Asia",
    "PHL": "Asia",
    "CHN": "Asia",
    "MNG": "Asia",
    "KOR": "Asia",
    "PRK": "Asia",
    "JPN": "Asia",
    
    // Africa
    "MAR": "Africa",
    "DZA": "Africa",
    "TUN": "Africa",
    "LBY": "Africa",
    "EGY": "Africa",
    "SDN": "Africa",
    "SSD": "Africa",
    "ERI": "Africa",
    "ETH": "Africa",
    "DJI": "Africa",
    "SOM": "Africa",
    "KEN": "Africa",
    "UGA": "Africa",
    "TZA": "Africa",
    "RWA": "Africa",
    "BDI": "Africa",
    "COD": "Africa",
    "COG": "Africa",
    "CAF": "Africa",
    "CMR": "Africa",
    "GAB": "Africa",
    "GNQ": "Africa",
    "TCD": "Africa",
    "NER": "Africa",
    "NGA": "Africa",
    "BEN": "Africa",
    "TGO": "Africa",
    "GHA": "Africa",
    "CIV": "Africa",
    "LBR": "Africa",
    "SLE": "Africa",
    "GIN": "Africa",
    "GNB": "Africa",
    "SEN": "Africa",
    "GMB": "Africa",
    "MLI": "Africa",
    "BFA": "Africa",
    "MRT": "Africa",
    "ESH": "Africa",
    "AGO": "Africa",
    "NAM": "Africa",
    "ZAF": "Africa",
    "LSO": "Africa",
    "SWZ": "Africa",
    "BWA": "Africa",
    "ZMB": "Africa",
    "ZWE": "Africa",
    "MWI": "Africa",
    "MOZ": "Africa",
    "MDG": "Africa",
    "MUS": "Africa",
    "COM": "Africa",
    "SYC": "Africa",
    
    // Oceania
    "AUS": "Oceania",
    "NZL": "Oceania",
    "PNG": "Oceania",
    "SLB": "Oceania",
    "VUT": "Oceania",
    "NCL": "Oceania",
    "FJI": "Oceania",
    "TON": "Oceania",
    "WSM": "Oceania",
    "KIR": "Oceania",
    "FSM": "Oceania",
    "MHL": "Oceania",
    "PLW": "Oceania",
    "NRU": "Oceania"
};

// Create a function to process the internet usage data and add continent information
function processInternetData(data) {
    return data.map(country => {
        // Add continent information based on country code
        const continent = continentMapping[country.countryCode] || "Unknown";
        
        // Find the most recent year with data
        let mostRecentYear = null;
        let mostRecentValue = null;
        
        // Check years from 2012 down to 2000
        for (let year = 2012; year >= 2000; year--) {
            if (country[year] !== null && country[year] !== undefined) {
                mostRecentYear = year;
                mostRecentValue = country[year];
                break;
            }
        }
        
        return {
            countryName: country.countryName,
            countryCode: country.countryCode,
            internetUsage: mostRecentValue,
            year: mostRecentYear,
            continent: continent
        };
    });
}

// Sample internet usage data structure (to be replaced with actual data)
const sampleInternetData = [
    {
        countryName: "United States",
        countryCode: "USA",
        2012: 81.0,
        2011: 78.2,
        2010: 74.0,
        // ... other years
    },
    {
        countryName: "China",
        countryCode: "CHN",
        2012: 42.3,
        2011: 38.3,
        2010: 34.3,
        // ... other years
    },
    // ... other countries
];

// Process the data
const processedData = processInternetData(sampleInternetData);
console.log("Processed data with continent information:", processedData);

// This mapping and processing function will be used in the visualization
// to color countries by continent and show internet usage data

window.continentMapping = continentMapping;
