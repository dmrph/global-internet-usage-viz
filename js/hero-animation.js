// Initialize the hero background animation
document.addEventListener('DOMContentLoaded', function() {
    // Create a simplified version of the globe for the hero section
    initHeroBackground();
});

function initHeroBackground() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
        45,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 150;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a simple globe
    const globe = new THREE.Group();
    
    // Earth sphere
    const earthGeometry = new THREE.SphereGeometry(50, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x2c3e50,
        emissive: 0x112244,
        specular: 0x333333,
        shininess: 25
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    globe.add(earth);
    
    // Add wireframe
    const wireframeGeometry = new THREE.SphereGeometry(50.1, 32, 32);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x3498db,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    globe.add(wireframe);
    
    // Add atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(55, 32, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x6c5ce7,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globe.add(atmosphere);
    
    // Add some particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const posArray = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 200;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.5,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Add globe to scene
    scene.add(globe);
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate globe
        globe.rotation.y += 0.001;
        
        // Render
        renderer.render(scene, camera);
    }
    
    // Handle resize
    function onWindowResize() {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate();
}
