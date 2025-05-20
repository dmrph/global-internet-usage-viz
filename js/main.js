// Main JavaScript file for the 3D Data Visualization Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen when page is loaded
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 700);
        }
    }, 2500);

    // Initialize visualization
    initVisualization();
    
    // Set up event listeners for controls
    setupControls();
    
    // Populate sidebar data
    populateSidebar();
});

// Set up control buttons
function setupControls() {
    // Rotation controls
    document.getElementById('rotate-left').addEventListener('click', function() {
        if (window.visualization) {
            window.visualization.rotateGlobe(-Math.PI / 8);
        }
    });
    
    document.getElementById('rotate-right').addEventListener('click', function() {
        if (window.visualization) {
            window.visualization.rotateGlobe(Math.PI / 8);
        }
    });
    
    // Zoom controls
    document.getElementById('zoom-in').addEventListener('click', function() {
        if (window.visualization) {
            window.visualization.zoomGlobe(10);
        }
    });
    
    document.getElementById('zoom-out').addEventListener('click', function() {
        if (window.visualization) {
            window.visualization.zoomGlobe(-10);
        }
    });
    
    // Reset view
    document.getElementById('reset-view').addEventListener('click', function() {
        if (window.visualization) {
            window.visualization.resetView();
        }
    });
}

// Populate sidebar with data
function populateSidebar() {
    // This will be called once data is loaded
    setTimeout(() => {
        if (window.visualization && window.visualization.internetData) {
            updateGlobalStats();
            updateContinentalBreakdownHorizontal();
            updateTopCountries();
            updateContinentAverages();
            updateKeyInsights();
        } else {
            // Try again in a second if data isn't loaded yet
            setTimeout(populateSidebar, 1000);
        }
    }, 2000);
}

// Update global statistics
function updateGlobalStats() {
    const data = window.visualization.internetData;
    if (!data || data.length === 0) return;
    
    // Calculate global average
    let totalUsage = 0;
    let countWithData = 0;
    
    data.forEach(country => {
        if (country.internetUsage) {
            totalUsage += country.internetUsage;
            countWithData++;
        }
    });
    
    const globalAverage = totalUsage / countWithData;
    window.globalAverage = globalAverage; // Ensure this is set globally for other functions
    document.getElementById('global-average').textContent = `${globalAverage.toFixed(1)}%`;
    
    // Calculate continent averages
    const continentData = {};
    
    data.forEach(country => {
        if (country.internetUsage && country.continent) {
            if (!continentData[country.continent]) {
                continentData[country.continent] = {
                    total: 0,
                    count: 0
                };
            }
            
            continentData[country.continent].total += country.internetUsage;
            continentData[country.continent].count++;
        }
    });
    
    // Find highest and lowest continents
    let highestContinent = null;
    let highestAverage = -1;
    let lowestContinent = null;
    let lowestAverage = Infinity;
    
    Object.entries(continentData).forEach(([continent, data]) => {
        const average = data.total / data.count;
        
        if (average > highestAverage) {
            highestAverage = average;
            highestContinent = continent;
        }
        
        if (average < lowestAverage) {
            lowestAverage = average;
            lowestContinent = continent;
        }
    });
    
    document.getElementById('highest-continent').textContent = highestContinent || 'N/A';
    document.getElementById('lowest-continent').textContent = lowestContinent || 'N/A';
    // Fix: If a country is selected, update its details after globalAverage is set
    if (window.selectedCountry) {
        updateCountryDetails(window.selectedCountry);
    }
}

// Populate the new horizontal continental breakdown
function updateContinentalBreakdownHorizontal() {
    const data = window.visualization.internetData;
    if (!data || data.length === 0) return;
    // Calculate continent averages
    const continentData = {};
    data.forEach(country => {
        if (country.internetUsage && country.continent) {
            if (!continentData[country.continent]) {
                continentData[country.continent] = {
                    total: 0,
                    count: 0
                };
            }
            continentData[country.continent].total += country.internetUsage;
            continentData[country.continent].count++;
        }
    });
    // Create horizontal cards
    const container = document.getElementById('continental-breakdown-horizontal');
    container.innerHTML = '';
    Object.entries(continentData)
        .sort((a, b) => b[1].total / b[1].count - a[1].total / a[1].count)
        .forEach(([continent, data]) => {
            const average = data.total / data.count;
            const continentColor = window.visualization.continentColors[continent];
            const colorHex = '#' + continentColor.toString(16).padStart(6, '0');
            const card = document.createElement('div');
            card.className = 'continent-card';
            card.innerHTML = `
                <div class="continent-color" style="background-color: ${colorHex};"></div>
                <div class="continent-name">${continent}</div>
                <div class="continent-value">${average.toFixed(1)}%</div>
            `;
            container.appendChild(card);
        });
}

// Update top countries
function updateTopCountries() {
    const data = window.visualization.internetData;
    if (!data || data.length === 0) return;
    
    // Sort countries by internet usage
    const sortedCountries = [...data]
        .filter(country => country.internetUsage)
        .sort((a, b) => b.internetUsage - a.internetUsage);
    
    // Get top 5 countries
    const topCountries = sortedCountries.slice(0, 5);
    
    // Create table
    const table = document.getElementById('top-countries');
    table.innerHTML = `
        <tr>
            <th>Country</th>
            <th>Usage</th>
            <th>Continent</th>
        </tr>
    `;
    
    topCountries.forEach(country => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${country.countryName}</td>
            <td>${country.internetUsage.toFixed(1)}%</td>
            <td>${country.continent}</td>
        `;
        
        table.appendChild(row);
    });
}

// Update continent averages
function updateContinentAverages() {
    const data = window.visualization.internetData;
    if (!data || data.length === 0) return;
    
    // Calculate continent averages
    const continentData = {};
    
    data.forEach(country => {
        if (country.internetUsage && country.continent) {
            if (!continentData[country.continent]) {
                continentData[country.continent] = {
                    total: 0,
                    count: 0
                };
            }
            
            continentData[country.continent].total += country.internetUsage;
            continentData[country.continent].count++;
        }
    });
    
    // Create table
    const table = document.getElementById('continent-averages');
    table.innerHTML = `
        <tr>
            <th>Continent</th>
            <th>Avg. Usage</th>
            <th>Countries</th>
        </tr>
    `;
    
    Object.entries(continentData)
        .sort((a, b) => (b[1].total / b[1].count) - (a[1].total / a[1].count))
        .forEach(([continent, data]) => {
            const average = data.total / data.count;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${continent}</td>
                <td>${average.toFixed(1)}%</td>
                <td>${data.count}</td>
            `;
            
            table.appendChild(row);
        });
}

// Update country details when a country is selected
function updateCountryDetails(country) {
    window.selectedCountry = country;
    const countryDetails = document.getElementById('country-details');
    
    if (!country) {
        countryDetails.innerHTML = `<p class="select-prompt">Click on a country to see details</p>`;
        return;
    }
    
    const continentColor = window.visualization.continentColors[country.continent];
    const colorHex = '#' + continentColor.toString(16).padStart(6, '0');
    
    // Calculate global ranking
    const data = window.visualization.internetData;
    const sortedCountries = [...data]
        .filter(c => c.internetUsage)
        .sort((a, b) => b.internetUsage - a.internetUsage);
    const rank = sortedCountries.findIndex(c => c.countryCode === country.countryCode) + 1;
    const totalCountries = sortedCountries.length;
    
    let comparisonValue = '';
    let comparisonClass = '';
    if (window.globalAverage && country.internetUsage) {
        const diff = country.internetUsage - window.globalAverage;
        comparisonValue = `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
        comparisonClass = diff > 0 ? 'positive' : 'negative';
    } else {
        comparisonValue = 'N/A';
        comparisonClass = '';
    }
    
    countryDetails.innerHTML = `
        <div class="country-header">
            <h4>${country.countryName}</h4>
            <span class="country-continent" style="background-color: ${colorHex}20; color: ${colorHex};">${country.continent}</span>
        </div>
        <div class="country-stat">
            <div class="stat-label">Internet Usage:</div>
            <div class="stat-value">${country.internetUsage.toFixed(1)}% of population</div>
        </div>
        <div class="country-stat">
            <div class="stat-label">Global Ranking:</div>
            <div class="stat-value">#${rank} of ${totalCountries} countries</div>
        </div>
        <div class="country-comparison">
            <div class="comparison-label">Compared to global average:</div>
            <div class="comparison-value ${comparisonClass}">${comparisonValue}</div>
        </div>
    `;
}

// Add event listener for country selection
document.addEventListener('countrySelected', function(e) {
    updateCountryDetails(e.detail);
});

// Populate the Key Insights section under the map
function updateKeyInsights() {
    const data = window.visualization.internetData;
    if (!data || data.length === 0) return;
    // Global average
    let totalUsage = 0;
    let countWithData = 0;
    data.forEach(country => {
        if (country.internetUsage) {
            totalUsage += country.internetUsage;
            countWithData++;
        }
    });
    const globalAverage = totalUsage / countWithData;
    document.getElementById('insight-global-average').textContent = `${globalAverage.toFixed(1)}%`;
    // Top 5 countries
    const sortedCountries = [...data]
        .filter(country => country.internetUsage)
        .sort((a, b) => b.internetUsage - a.internetUsage);
    const topCountries = sortedCountries.slice(0, 5);
    const topCountriesList = document.getElementById('insight-top-countries');
    topCountriesList.innerHTML = '';
    topCountries.forEach(country => {
        const li = document.createElement('li');
        li.textContent = `${country.countryName} (${country.internetUsage.toFixed(1)}%)`;
        topCountriesList.appendChild(li);
    });
    // Lowest usage continent
    const continentData = {};
    data.forEach(country => {
        if (country.internetUsage && country.continent) {
            if (!continentData[country.continent]) {
                continentData[country.continent] = { total: 0, count: 0 };
            }
            continentData[country.continent].total += country.internetUsage;
            continentData[country.continent].count++;
        }
    });
    let lowestContinent = null;
    let lowestAverage = Infinity;
    Object.entries(continentData).forEach(([continent, d]) => {
        const avg = d.total / d.count;
        if (avg < lowestAverage) {
            lowestAverage = avg;
            lowestContinent = continent;
        }
    });
    document.getElementById('insight-lowest-continent').textContent = `${lowestContinent} (${lowestAverage.toFixed(1)}%)`;
}
