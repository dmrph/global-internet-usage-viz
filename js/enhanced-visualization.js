// Enhanced globe visualization with continent details
class EnhancedGlobeVisualization extends Visualization {
    constructor(containerId) {
        super(containerId);
        this.detailLevel = 12; // High detail for a smooth earth
        
        // Internet usage data
        this.internetData = null;
        
        // Load internet usage data
        this.loadInternetData();
    }
    
    loadInternetData() {
        // In a real implementation, this would load from the CSV or API
        // For now, we'll use sample data based on the World Bank dataset
        fetch('https://raw.githubusercontent.com/ckan/ckanext-mapviews/master/doc/internet-users-per-100-people.csv')
            .then(response => response.text())
            .then(csvText => {
                // Parse CSV
                const lines = csvText.split('\n');
                const headers = lines[0].split(',');
                
                // Find indices for relevant columns
                const countryNameIndex = headers.indexOf('Country Name');
                const countryCodeIndex = headers.indexOf('Country Code');
                
                // Find the most recent year column (assuming years are at the end)
                let mostRecentYearIndex = -1;
                let mostRecentYear = '';
                
                for (let i = 0; i < headers.length; i++) {
                    if (/^\d{4}$/.test(headers[i])) {
                        if (headers[i] > mostRecentYear) {
                            mostRecentYear = headers[i];
                            mostRecentYearIndex = i;
                        }
                    }
                }
                
                // Parse data rows
                const data = [];
                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;
                    
                    const values = lines[i].split(',');
                    if (values.length < Math.max(countryNameIndex, countryCodeIndex, mostRecentYearIndex) + 1) continue;
                    
                    let countryName = values[countryNameIndex];
                    const countryCode = values[countryCodeIndex];
                    const internetUsage = parseFloat(values[mostRecentYearIndex]) || 0;
                    
                    // Patch for Russia
                    if (countryCode === 'RUS') countryName = 'Russia';
                    
                    // Get continent from our mapping
                    const continent = window.continentMapping[countryCode] || 'Unknown';
                    
                    data.push({
                        countryName,
                        countryCode,
                        internetUsage,
                        year: mostRecentYear,
                        continent
                    });
                }
                
                this.internetData = data;
                console.log(`Loaded internet usage data for ${data.length} countries`);
                
                // Update visualization if it's already created
                if (this.globe) {
                    this.updateGlobeData();
                }
            })
            .catch(error => {
                console.error('Error loading internet data:', error);
                
                // Fallback to sample data
                this.loadSampleData();
            });
    }
    
    loadSampleData() {
        // Sample data as fallback
        const sampleData = [
            { countryName: 'United States', countryCode: 'USA', internetUsage: 87.3, continent: 'North America' },
            { countryName: 'China', countryCode: 'CHN', internetUsage: 54.3, continent: 'Asia' },
            { countryName: 'India', countryCode: 'IND', internetUsage: 34.8, continent: 'Asia' },
            { countryName: 'Brazil', countryCode: 'BRA', internetUsage: 67.5, continent: 'South America' },
            { countryName: 'Russia', countryCode: 'RUS', internetUsage: 92.3, continent: 'Europe' },
            { countryName: 'Japan', countryCode: 'JPN', internetUsage: 91.1, continent: 'Asia' },
            { countryName: 'Germany', countryCode: 'DEU', internetUsage: 89.6, continent: 'Europe' },
            { countryName: 'United Kingdom', countryCode: 'GBR', internetUsage: 94.8, continent: 'Europe' },
            { countryName: 'France', countryCode: 'FRA', internetUsage: 85.6, continent: 'Europe' },
            { countryName: 'Italy', countryCode: 'ITA', internetUsage: 74.4, continent: 'Europe' },
            { countryName: 'Canada', countryCode: 'CAN', internetUsage: 92.7, continent: 'North America' },
            { countryName: 'Australia', countryCode: 'AUS', internetUsage: 86.5, continent: 'Oceania' },
            { countryName: 'South Africa', countryCode: 'ZAF', internetUsage: 56.2, continent: 'Africa' },
            { countryName: 'Nigeria', countryCode: 'NGA', internetUsage: 42.0, continent: 'Africa' },
            { countryName: 'Egypt', countryCode: 'EGY', internetUsage: 48.1, continent: 'Africa' },
            { countryName: 'Saudi Arabia', countryCode: 'SAU', internetUsage: 93.3, continent: 'Asia' },
            { countryName: 'Mexico', countryCode: 'MEX', internetUsage: 70.1, continent: 'North America' },
            { countryName: 'Indonesia', countryCode: 'IDN', internetUsage: 53.7, continent: 'Asia' },
            { countryName: 'South Korea', countryCode: 'KOR', internetUsage: 96.2, continent: 'Asia' },
            { countryName: 'Turkey', countryCode: 'TUR', internetUsage: 71.0, continent: 'Asia' }
        ];
        
        this.internetData = sampleData;
        console.log('Using sample internet usage data');
        
        // Update visualization if it's already created
        if (this.globe) {
            this.updateGlobeData();
        }
    }
    
    createGlobe() {
        // Create globe group
        this.globe = new THREE.Group();
        
        // Create earth sphere with continent textures
        this.createEarthWithContinents();
        
        // Add data points if data is available
        if (this.internetData) {
            this.addDataPoints();
        }
        
        // Add to scene
        this.scene.add(this.globe);
        
        // Reset camera position
        this.camera.position.set(0, 0, 150);
        this.controls.update();
    }
    
    async createEarthWithContinents() {
        // Create base earth sphere
        const earthGeometry = new THREE.SphereGeometry(50, 32 * this.detailLevel / 5, 32 * this.detailLevel / 5);
        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2c3e50,
            emissive: 0x112244,
            specular: 0x333333,
            shininess: 25,
            transparent: false,
            opacity: 1.0
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        earth.userData = { type: 'earth' };
        this.globe.add(earth);

        // Add a second, slightly larger sphere for the glow effect
        const glowGeometry = new THREE.SphereGeometry(50.1, 32 * this.detailLevel / 5, 32 * this.detailLevel / 5);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x112244,
            transparent: true,
            opacity: 0.3,
            depthWrite: false,
            depthTest: false
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.globe.add(glow);
        
        // Add country outlines
        await this.addCountryOutlines();
        // Add continent outlines
        // this.addContinentOutlines();
    }
    
    async addCountryOutlines() {
        // Fetch GeoJSON for world countries
        const url = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';
        let geojson;
        try {
            const res = await fetch(url);
            geojson = await res.json();
        } catch (e) {
            console.error('Failed to load country GeoJSON', e);
            return;
        }
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1, transparent: true, opacity: 0.3 });
        geojson.features.forEach(feature => {
            const coords = feature.geometry.coordinates;
            const type = feature.geometry.type;
            const countryCode = feature.properties.iso_a3 || feature.id;
            // MultiPolygon or Polygon
            const polygons = (type === 'Polygon') ? [coords] : coords;
            polygons.forEach(polygon => {
                polygon.forEach(ring => {
                    if (!Array.isArray(ring) || ring.length < 3) {
                        console.warn('Skipping malformed ring for', countryCode, ring);
                        return;
                    }
                    const points = ring.map(([lng, lat]) => {
                        const phi = (90 - lat) * Math.PI / 180;
                        const theta = (lng + 180) * Math.PI / 180;
                        const x = -50 * Math.sin(phi) * Math.cos(theta);
                        const y = 50 * Math.cos(phi);
                        const z = 50 * Math.sin(phi) * Math.sin(theta);
                        return new THREE.Vector3(x, y, z);
                    });
                    if (points.length < 3) {
                        console.warn('Skipping short points for', countryCode, points);
                        return;
                    }
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geometry, lineMaterial.clone());
                    line.userData = { type: 'country-shape', countryCode };
                    this.globe.add(line);
                });
            });
        });
    }
    
    addContinentOutlines() {
        // Define continent boundaries (simplified for demonstration)
        const continents = {
            'North America': [
                { lat: 83, lng: -52 }, // Northern point
                { lat: 15, lng: -125 }, // Western point
                { lat: 7, lng: -78 },   // Southern point
                { lat: 50, lng: -55 }   // Eastern point
            ],
            'South America': [
                { lat: 12, lng: -72 },  // Northern point
                { lat: -55, lng: -75 }, // Southern point
                { lat: -20, lng: -40 }, // Eastern point
                { lat: -10, lng: -81 }  // Western point
            ],
            'Europe': [
                { lat: 71, lng: 28 },  // Northern point
                { lat: 35, lng: -10 }, // Western point
                { lat: 36, lng: 40 },  // Southern point
                { lat: 60, lng: 60 }   // Eastern point
            ],
            'Asia': [
                { lat: 77, lng: 104 }, // Northern point
                { lat: 35, lng: 25 },  // Western point
                { lat: -10, lng: 140 },// Southern point
                { lat: 65, lng: 170 }  // Eastern point
            ],
            'Africa': [
                { lat: 37, lng: 10 },  // Northern point
                { lat: -35, lng: 20 }, // Southern point
                { lat: 10, lng: -17 }, // Western point
                { lat: 12, lng: 51 }   // Eastern point
            ],
            'Oceania': [
                { lat: -5, lng: 110 },  // Northern point
                { lat: -47, lng: 165 }, // Southern point
                { lat: -25, lng: 110 }, // Western point
                { lat: -15, lng: 180 }  // Eastern point
            ],
            'Antarctica': [
                { lat: -60, lng: 0 },   // All around the south pole
                { lat: -60, lng: 90 },
                { lat: -60, lng: 180 },
                { lat: -60, lng: -90 }
            ]
        };
        
        // Create continent outlines
        Object.entries(continents).forEach(([continent, points]) => {
            const color = this.continentColors[continent];
            
            // Create a line for the continent outline
            const lineGeometry = new THREE.BufferGeometry();
            const linePoints = [];
            
            // Convert lat/lng to 3D positions
            points.forEach(point => {
                const phi = (90 - point.lat) * Math.PI / 180;
                const theta = (point.lng + 180) * Math.PI / 180;
                
                const x = -50 * Math.sin(phi) * Math.cos(theta);
                const y = 50 * Math.cos(phi);
                const z = 50 * Math.sin(phi) * Math.sin(theta);
                
                linePoints.push(new THREE.Vector3(x, y, z));
            });
            
            // Close the loop
            if (linePoints.length > 0) {
                linePoints.push(linePoints[0].clone());
            }
            
            lineGeometry.setFromPoints(linePoints);
            
            const lineMaterial = new THREE.LineBasicMaterial({
                color: color,
                linewidth: 8,
                transparent: false,
                opacity: 1.0
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            this.globe.add(line);
            
            // Add continent label
            this.addContinentLabel(continent, points);
        });
    }
    
    addContinentLabel(continent, points) {
        // Calculate center point of continent
        let centerLat = 0;
        let centerLng = 0;
        
        points.forEach(point => {
            centerLat += point.lat;
            centerLng += point.lng;
        });
        
        centerLat /= points.length;
        centerLng /= points.length;
        
        // Convert to 3D position
        const phi = (90 - centerLat) * Math.PI / 180;
        const theta = (centerLng + 180) * Math.PI / 180;
        
        const x = -55 * Math.sin(phi) * Math.cos(theta); // Slightly above surface
        const y = 55 * Math.cos(phi);
        const z = 55 * Math.sin(phi) * Math.sin(theta);
        
        // Create sprite for text
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.font = 'bold 64px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Add a shadow for better visibility
        context.shadowColor = '#000000';
        context.shadowBlur = 8;
        context.fillText(continent, 256, 128);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 1.0
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(x, y, z);
        sprite.scale.set(40, 20, 1);
        
        this.globe.add(sprite);
    }
    
    addDataPoints() {
        if (!this.internetData) return;
        
        this.internetData.forEach(country => {
            // Skip if no internet usage data
            if (!country.internetUsage) return;
            
            // Convert country to lat/lng (simplified - in a real app we'd use a GeoJSON database)
            const position = this.getCountryPosition(country.countryCode);
            if (!position) return;
            
            // Jitter for Europe to reduce overlap
            let lat = position.lat;
            let lng = position.lng;
            if (country.continent === 'Europe') {
                lat += (Math.random() - 0.5) * 1.2; // up to ±0.6 degrees
                lng += (Math.random() - 0.5) * 1.2;
            }
            
            // Convert lat/lng to 3D position
            const phi = (90 - lat) * Math.PI / 180;
            const theta = (lng + 180) * Math.PI / 180;
            
            const x = -50 * Math.sin(phi) * Math.cos(theta);
            const y = 50 * Math.cos(phi);
            const z = 50 * Math.sin(phi) * Math.sin(theta);
            
            // Create marker with usage-based scaling, but clamp size
            const minSize = 0.5;
            const maxSize = 3.0;
            const markerSize = Math.max(minSize, Math.min(maxSize, minSize + (country.internetUsage / 100) * (maxSize - minSize)));
            const markerGeometry = new THREE.SphereGeometry(markerSize, 16, 16);
            
            // Use continent color
            const continentColor = this.continentColors[country.continent] || this.continentColors['Unknown'];
            
            const markerMaterial = new THREE.MeshBasicMaterial({
                color: continentColor,
                transparent: true,
                opacity: 0.8
            });
            
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set(x, y, z);
            
            // Add pulse animation
            this.animateMarker(marker, markerSize);
            
            // Store data for interaction
            marker.userData = {
                type: 'country',
                data: country
            };
            
            this.globe.add(marker);
        });
    }
    
    getCountryPosition(countryCode) {
        // Simplified mapping of country codes to positions
        // In a real application, this would use a GeoJSON database
        const positions = {
            'USA': { lat: 37, lng: -95 },
            'CHN': { lat: 35, lng: 105 },
            'IND': { lat: 20, lng: 77 },
            'BRA': { lat: -10, lng: -55 },
            'RUS': { lat: 60, lng: 100 },
            'JPN': { lat: 36, lng: 138 },
            'DEU': { lat: 51, lng: 10 },
            'GBR': { lat: 54, lng: -2 },
            'FRA': { lat: 46, lng: 2 },
            'ITA': { lat: 42, lng: 12 },
            'CAN': { lat: 56, lng: -106 },
            'AUS': { lat: -25, lng: 133 },
            'ZAF': { lat: -30, lng: 25 },
            'NGA': { lat: 10, lng: 8 },
            'EGY': { lat: 27, lng: 30 },
            'SAU': { lat: 24, lng: 45 },
            'MEX': { lat: 23, lng: -102 },
            'IDN': { lat: -5, lng: 120 },
            'KOR': { lat: 37, lng: 128 },
            'TUR': { lat: 39, lng: 35 },
            // Add more countries as needed
            
            // Sample countries from each continent
            // Africa
            'DZA': { lat: 28, lng: 3 },
            'KEN': { lat: 1, lng: 38 },
            'GHA': { lat: 8, lng: -2 },
            
            // Asia
            'THA': { lat: 15, lng: 100 },
            'VNM': { lat: 16, lng: 108 },
            'PAK': { lat: 30, lng: 70 },
            
            // Europe
            'ESP': { lat: 40, lng: -3 },
            'POL': { lat: 52, lng: 20 },
            'SWE': { lat: 62, lng: 15 },
            
            // North America
            'CUB': { lat: 22, lng: -80 },
            'GTM': { lat: 15, lng: -90 },
            'PAN': { lat: 9, lng: -80 },
            
            // Oceania
            'NZL': { lat: -40, lng: 174 },
            'FJI': { lat: -18, lng: 175 },
            'PNG': { lat: -6, lng: 147 },
            
            // South America
            'ARG': { lat: -34, lng: -64 },
            'COL': { lat: 4, lng: -74 },
            'PER': { lat: -10, lng: -76 }
        };
        
        return positions[countryCode];
    }
    
    updateGlobeData() {
        // Clear existing data points
        const objectsToRemove = [];
        this.globe.traverse(object => {
            if (object.userData && object.userData.type === 'country') {
                objectsToRemove.push(object);
            }
        });
        
        objectsToRemove.forEach(object => {
            this.globe.remove(object);
        });
        
        // Add new data points
        this.addDataPoints();
    }
    
    showTooltip(data, event) {
        // Create or update tooltip
        let tooltip = document.getElementById('visualization-tooltip');
        
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'visualization-tooltip';
            document.body.appendChild(tooltip);
            
            // Add tooltip styles
            const style = document.createElement('style');
            style.textContent = `
                #visualization-tooltip {
                    position: absolute;
                    background-color: rgba(30, 30, 30, 0.9);
                    color: #f5f5f5;
                    padding: 10px 15px;
                    border-radius: 5px;
                    font-size: 14px;
                    pointer-events: none;
                    z-index: 1000;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    max-width: 250px;
                    transition: opacity 0.2s ease;
                }
                
                #visualization-tooltip::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    border-width: 10px 10px 0;
                    border-style: solid;
                    border-color: rgba(30, 30, 30, 0.9) transparent transparent;
                }
                
                #visualization-tooltip.hidden {
                    opacity: 0;
                }
                
                #visualization-tooltip .tooltip-title {
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: #6c5ce7;
                }
                
                #visualization-tooltip .tooltip-value {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 3px;
                }
                
                #visualization-tooltip .tooltip-label {
                    color: #a0a0a0;
                }
                
                #visualization-tooltip .continent-badge {
                    display: inline-block;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 12px;
                    margin-top: 5px;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Position tooltip
        tooltip.style.left = `${event.clientX}px`;
        tooltip.style.top = `${event.clientY - 100}px`;
        
        // Set tooltip content based on data type
        let content = '';
        
        if (data.countryName) {
            content += `<div class="tooltip-title">${data.countryName}</div>`;
            
            if (data.continent) {
                const continentColor = this.continentColors[data.continent];
                const colorHex = '#' + continentColor.toString(16).padStart(6, '0');
                content += `<div class="continent-badge" style="background-color: ${colorHex}20; color: ${colorHex};">${data.continent}</div>`;
            }
            
            if (data.internetUsage !== undefined) {
                content += `<div class="tooltip-value">
                    <span class="tooltip-label">Internet Usage:</span>
                    <span>${data.internetUsage.toFixed(1)}% of population</span>
                </div>`;
            }
            
            if (data.year) {
                content += `<div class="tooltip-value">
                    <span class="tooltip-label">Year:</span>
                    <span>${data.year}</span>
                </div>`;
            }
        }
        
        tooltip.innerHTML = content;
        tooltip.classList.remove('hidden');
        
        // Hide tooltip after delay
        setTimeout(() => {
            tooltip.classList.add('hidden');
        }, 3000);
    }
    
    createVisualization() {
        this.showContinents = true;
        this.continentColors = {
            'North America': 0x3498db, // Blue
            'South America': 0x2ecc71, // Green
            'Europe': 0x9b59b6,        // Purple
            'Asia': 0xe74c3c,          // Red
            'Africa': 0xf39c12,        // Orange
            'Oceania': 0x1abc9c,       // Teal
            'Antarctica': 0xecf0f1,    // White
            'Unknown': 0x95a5a6        // Gray
        };
        this.createGlobe();
    }

    onClick(event) {
        // Calculate mouse position in normalized device coordinates
        const rect = this.container.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
        const y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
        
        // Raycasting for interactive elements
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, this.camera);
        
        // Check for intersections with country shapes first
        if (this.globe) {
            const intersects = raycaster.intersectObjects(this.globe.children, true);
            
            // Filter out intersections with the earth sphere
            const validIntersects = intersects.filter(intersect => {
                return !intersect.object.userData || intersect.object.userData.type !== 'earth';
            });
            
            for (const intersect of validIntersects) {
                if (intersect.object.userData && intersect.object.userData.type === 'country-shape') {
                    // Find country data
                    const country = this.internetData.find(c => c.countryCode === intersect.object.userData.countryCode);
                    if (country) {
                        this.selectObject(country);
                        return;
                    }
                }
            }
            
            // Fallback: check for data point markers
            for (const intersect of validIntersects) {
                if (intersect.object.userData && intersect.object.userData.type === 'country') {
                    this.selectObject(intersect.object.userData.data);
                    return;
                }
            }
        }
    }
}

// Override the initVisualization function to use the enhanced version
function initVisualization() {
    window.visualization = new EnhancedGlobeVisualization('visualization-canvas');
}
