// Base visualization class
class Visualization {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        
        // Configuration
        this.detailLevel = 5; // 1-10, higher is more detailed
        this.rotationSpeed = 0.001;
        this.autoRotate = true;
        
        // Initialize
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Add lighting
        this.addLighting();
        
        // Add controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;
        this.controls.minDistance = 100;
        this.controls.maxDistance = 300;
        
        // Create visualization
        this.createVisualization();
        
        // Add event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.container.addEventListener('click', this.onClick.bind(this));
        
        // Start animation loop
        this.animate();
    }
    
    addLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        this.scene.add(ambientLight);
        
        // Directional light (sun-like)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Point lights for highlights
        const pointLight1 = new THREE.PointLight(0x6c5ce7, 1, 100);
        pointLight1.position.set(50, 50, 50);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x00cec9, 1, 100);
        pointLight2.position.set(-50, -50, -50);
        this.scene.add(pointLight2);
    }
    
    createVisualization() {
        // This method should be overridden by subclasses
        console.log('Base visualization created');
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Auto-rotate if enabled
        if (this.autoRotate && this.globe) {
            this.globe.rotation.y += this.rotationSpeed;
        }
        
        // Update controls
        this.controls.update();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        // Update camera aspect ratio
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        const rect = this.container.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
        const y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
        
        // Raycasting for interactive elements
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, this.camera);
        
        // Check for intersections with objects
        if (this.globe) {
            const intersects = raycaster.intersectObjects(this.globe.children, true);
            
            if (intersects.length > 0) {
                const object = intersects[0].object;
                
                // If object has user data, show tooltip
                if (object.userData && object.userData.data) {
                    this.container.style.cursor = 'pointer';
                    this.showTooltip(object.userData.data, event);
                    return;
                }
            }
        }
        
        // Reset cursor if no intersection
        this.container.style.cursor = 'default';
    }
    
    onClick(event) {
        // Calculate mouse position in normalized device coordinates
        const rect = this.container.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
        const y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
        
        // Raycasting for interactive elements
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, this.camera);
        
        // Check for intersections with objects
        if (this.globe) {
            const intersects = raycaster.intersectObjects(this.globe.children, true);
            
            if (intersects.length > 0) {
                const object = intersects[0].object;
                
                // If object has user data, trigger selection
                if (object.userData && object.userData.data) {
                    this.selectObject(object.userData.data);
                    return;
                }
            }
        }
    }
    
    selectObject(data) {
        // Dispatch custom event for country selection
        const event = new CustomEvent('countrySelected', { detail: data });
        document.dispatchEvent(event);
        
        console.log('Selected:', data);
    }
    
    showTooltip(data, event) {
        // This method should be overridden by subclasses
        console.log('Tooltip data:', data);
    }
    
    rotateGlobe(angle) {
        if (this.globe) {
            gsap.to(this.globe.rotation, {
                y: this.globe.rotation.y + angle,
                duration: 1,
                ease: 'power2.inOut'
            });
        }
    }
    
    zoomGlobe(delta) {
        const newPosition = this.camera.position.z - delta;
        
        // Ensure zoom stays within bounds
        if (newPosition >= 100 && newPosition <= 300) {
            gsap.to(this.camera.position, {
                z: newPosition,
                duration: 1,
                ease: 'power2.inOut'
            });
        }
    }
    
    resetView() {
        // Reset camera position
        gsap.to(this.camera.position, {
            x: 0,
            y: 0,
            z: 150,
            duration: 1.5,
            ease: 'power2.inOut'
        });
        
        // Reset globe rotation
        if (this.globe) {
            gsap.to(this.globe.rotation, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1.5,
                ease: 'power2.inOut'
            });
        }
        
        // Reset controls target
        gsap.to(this.controls.target, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => this.controls.update()
        });
    }
    
    animateMarker(marker, baseSize) {
        // Create pulse animation
        gsap.to(marker.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
            duration: 1 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

// Initialize visualization
function initVisualization() {
    window.visualization = new Visualization('visualization-canvas');
}
