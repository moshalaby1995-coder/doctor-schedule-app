// Three.js 3D Background Animation
let scene, camera, renderer, particles;

function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.3,
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Add medical cross shapes
    createMedicalCrosses();
    
    animate();
}

function createMedicalCrosses() {
    const crossGeometry = new THREE.BoxGeometry(0.5, 2, 0.5);
    const crossMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x0099ff, 
        transparent: true, 
        opacity: 0.3 
    });
    
    for(let i = 0; i < 5; i++) {
        const cross1 = new THREE.Mesh(crossGeometry, crossMaterial);
        const cross2 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.5), crossMaterial);
        
        const group = new THREE.Group();
        group.add(cross1);
        group.add(cross2);
        
        group.position.x = (Math.random() - 0.5) * 80;
        group.position.y = (Math.random() - 0.5) * 80;
        group.position.z = (Math.random() - 0.5) * 50;
        
        group.userData = {
            rotationSpeed: Math.random() * 0.02,
            floatSpeed: Math.random() * 0.01
        };
        
        scene.add(group);
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;
    
    // Animate medical crosses
    scene.children.forEach(child => {
        if(child.type === 'Group') {
            child.rotation.y += child.userData.rotationSpeed;
            child.position.y += Math.sin(Date.now() * child.userData.floatSpeed * 0.001) * 0.01;
        }
    });
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if(currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Animate stats counter
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if(current >= target) {
            element.textContent = target + (element.parentElement.querySelector('p').textContent.includes('%') ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Animate counters when stats section is visible
            if(entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.service-card, .stat-item, .floating-card, .testimonial-card').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.stat-number').forEach(el => {
    observer.observe(el);
});

// Testimonials slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.remove('active');
        dots[i].classList.remove('active');
        if(i === index) {
            testimonial.classList.add('active');
            dots[i].classList.add('active');
        }
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
}

nextBtn.addEventListener('click', nextTestimonial);
prevBtn.addEventListener('click', prevTestimonial);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
    });
});

// Auto-advance testimonials
setInterval(nextTestimonial, 5000);

// Contact form handling
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if(data.success) {
            formMessage.textContent = data.message;
            formMessage.className = 'form-message success';
            contactForm.reset();
        } else {
            formMessage.textContent = data.message;
            formMessage.className = 'form-message error';
        }
        
        formMessage.style.display = 'block';
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
        
    } catch(error) {
        formMessage.textContent = 'An error occurred. Please try again.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
    }
});

// Service card 3D tilt effect
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Initialize Three.js when page loads
window.addEventListener('load', initThreeJS);
