// Data handling for the 3D Data Visualization Dashboard

// Sample data for the visualization
const sampleData = {
    global: {
        regions: [
            { name: 'North America', lat: 40, lng: -100, value: 25.4, growth: 3.2 },
            { name: 'Europe', lat: 50, lng: 10, value: 21.7, growth: 2.8 },
            { name: 'Asia Pacific', lat: 30, lng: 120, value: 35.2, growth: 4.5 },
            { name: 'Latin America', lat: -10, lng: -60, value: 5.8, growth: 1.9 },
            { name: 'Africa', lat: 0, lng: 20, value: 2.9, growth: 3.7 }
        ],
        metrics: [
            { name: 'GDP', values: [80.2, 82.5, 85.1, 89.7, 94.3], unit: 'T' },
            { name: 'Population', values: [7.8, 7.9, 8.0, 8.05, 8.1], unit: 'B' },
            { name: 'Tech Market', values: [8.5, 9.2, 10.1, 11.5, 12.8], unit: 'T' },
            { name: 'CO₂ Emissions', values: [43.1, 42.8, 42.5, 41.9, 41.2], unit: 'Gt' }
        ],
        years: [2021, 2022, 2023, 2024, 2025]
    },
    categories: {
        technology: [
            { name: 'AI', value: 2.8, growth: 35.2 },
            { name: 'Cloud', value: 4.2, growth: 22.1 },
            { name: 'IoT', value: 1.5, growth: 18.7 },
            { name: 'Blockchain', value: 0.8, growth: 42.3 },
            { name: 'Cybersecurity', value: 1.9, growth: 15.4 }
        ],
        environment: [
            { name: 'Renewable Energy', value: 3.2, growth: 12.5 },
            { name: 'Carbon Capture', value: 0.5, growth: 28.9 },
            { name: 'Sustainable Agriculture', value: 1.2, growth: 8.7 },
            { name: 'Water Management', value: 0.9, growth: 7.2 },
            { name: 'Waste Reduction', value: 0.7, growth: 9.8 }
        ]
    },
    correlations: {
        GDP: { GDP: 1.0, Tech: 0.82, Env: 0.54, Soc: 0.67 },
        Tech: { GDP: 0.82, Tech: 1.0, Env: 0.48, Soc: 0.79 },
        Env: { GDP: 0.54, Tech: 0.48, Env: 1.0, Soc: 0.31 },
        Soc: { GDP: 0.67, Tech: 0.79, Env: 0.31, Soc: 1.0 }
    }
};

// Function to fetch data (simulated API call)
function fetchData() {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            resolve(sampleData);
        }, 1000);
    });
}

// Function to process data for visualization
function processData(data, type) {
    switch (type) {
        case 'globe':
            return processGlobeData(data);
        case 'bars':
            return processBarsData(data);
        case 'scatter':
            return processScatterData(data);
        case 'network':
            return processNetworkData(data);
        default:
            return data;
    }
}

// Process data for globe visualization
function processGlobeData(data) {
    // In a real application, this would transform the data for globe visualization
    return data.global.regions.map(region => ({
        name: region.name,
        lat: region.lat,
        lng: region.lng,
        value: region.value,
        growth: region.growth,
        color: getColorByValue(region.growth)
    }));
}

// Process data for 3D bars visualization
function processBarsData(data) {
    // In a real application, this would transform the data for 3D bars visualization
    return data.global.metrics.map((metric, index) => ({
        name: metric.name,
        values: metric.values,
        unit: metric.unit,
        color: getMetricColor(index)
    }));
}

// Process data for 3D scatter visualization
function processScatterData(data) {
    // In a real application, this would transform the data for 3D scatter visualization
    const result = [];
    
    Object.keys(data.categories).forEach((category, categoryIndex) => {
        data.categories[category].forEach(item => {
            result.push({
                category: category,
                name: item.name,
                value: item.value,
                growth: item.growth,
                color: getCategoryColor(categoryIndex)
            });
        });
    });
    
    return result;
}

// Process data for 3D network visualization
function processNetworkData(data) {
    // In a real application, this would transform the data for 3D network visualization
    const nodes = data.global.regions.map(region => ({
        name: region.name,
        value: region.value,
        growth: region.growth
    }));
    
    const links = [];
    
    // Create links between nodes based on correlation
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            // Calculate connection strength based on region values
            const strength = (nodes[i].value + nodes[j].value) / 100;
            
            if (strength > 0.2) { // Only connect significant nodes
                links.push({
                    source: i,
                    target: j,
                    strength: strength
                });
            }
        }
    }
    
    return { nodes, links };
}

// Helper functions for colors
function getColorByValue(value) {
    // Color gradient based on value
    if (value < 0) {
        return '#e17055'; // Negative (red)
    } else if (value < 2) {
        return '#fdcb6e'; // Low (yellow)
    } else if (value < 4) {
        return '#6c5ce7'; // Medium (purple)
    } else {
        return '#00cec9'; // High (teal)
    }
}

function getMetricColor(index) {
    // Colors for different metrics
    const colors = ['#6c5ce7', '#00cec9', '#fd79a8', '#00b894'];
    return colors[index % colors.length];
}

function getCategoryColor(index) {
    // Colors for different categories
    const colors = ['#6c5ce7', '#00b894'];
    return colors[index % colors.length];
}

// Export functions for use in visualization.js
window.dataUtils = {
    fetchData,
    processData,
    getColorByValue,
    getMetricColor,
    getCategoryColor
};
