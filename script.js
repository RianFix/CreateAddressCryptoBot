// ==========================================
// PARTICLE CANVAS EFFECT
// ==========================================
class ParticleCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        
        // Reduce particles on mobile for better performance
        this.particleCount = window.innerWidth < 768 ? 30 : 80;
        this.connectionDistance = window.innerWidth < 768 ? 100 : 150;
        
        this.init();
        this.animate();
        this.handleResize();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(124, 58, 237, 0.8)';
        this.ctx.fill();
        
        // Glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = 'rgba(124, 58, 237, 0.8)';
    }
    
    connectParticles(p1, p2, distance) {
        const opacity = 1 - (distance / this.connectionDistance);
        this.ctx.strokeStyle = `rgba(124, 58, 237, ${opacity * 0.3})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }
    
    update() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    this.connectParticles(this.particles[i], this.particles[j], distance);
                }
            }
        }
        
        // Draw particles
        this.particles.forEach(particle => this.drawParticle(particle));
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                // Only recreate particles if screen size category changed
                const newCount = window.innerWidth < 768 ? 30 : 80;
                if (newCount !== this.particleCount) {
                    this.particleCount = newCount;
                    this.connectionDistance = window.innerWidth < 768 ? 100 : 150;
                    this.createParticles();
                }
            }, 250);
        });
    }
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    const elements = document.querySelectorAll(`
        .section-header,
        .feature-card,
        .blockchain-card,
        .step-card,
        .footer-content
    `);
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// ==========================================
// PARALLAX EFFECT - Optimized with throttling
// ==========================================
function initParallax() {
    // Disable on mobile for better performance
    if (window.innerWidth < 768) return;
    
    let ticking = false;
    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
        lastScrollY = window.pageYOffset;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const parallaxElements = document.querySelectorAll('.hologram-circle');
                
                parallaxElements.forEach((el, index) => {
                    const speed = 0.3 + (index * 0.1); // Reduced speed
                    const yPos = -(lastScrollY * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true }); // Add passive for better scroll performance
}

// ==========================================
// NAVBAR SCROLL EFFECT (if you add navbar later)
// ==========================================
function initNavbarScroll() {
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.classList.add('hide');
        } else {
            navbar.classList.remove('hide');
        }
        
        lastScroll = currentScroll;
    });
}

// ==========================================
// CARD HOVER EFFECTS - Optimized for mobile
// ==========================================
function initCardEffects() {
    const cards = document.querySelectorAll('.feature-card, .blockchain-card, .step-card');
    const isMobile = window.innerWidth < 768;
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
        
        // Disable 3D tilt effect on mobile for better performance
        if (!isMobile) {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        }
    });
}

// ==========================================
// CURSOR GLOW EFFECT
// ==========================================
function initCursorGlow() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(124, 58, 237, 0.5) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    // Show only on desktop
    if (window.innerWidth > 768) {
        cursor.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });
        
        // Expand on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    }
}

// ==========================================
// TYPING EFFECT FOR HERO TITLE
// ==========================================
function initTypingEffect() {
    const titleLines = document.querySelectorAll('.hero-title .line');
    
    titleLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        line.style.opacity = '1';
        
        setTimeout(() => {
            let charIndex = 0;
            const typingInterval = setInterval(() => {
                if (charIndex < text.length) {
                    line.textContent += text[charIndex];
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 50);
        }, index * 1000);
    });
}

// ==========================================
// STATS COUNTER ANIMATION
// ==========================================
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-value');
    const speed = 200;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = counter.textContent;
                const number = parseInt(target.replace(/\D/g, ''));
                const suffix = target.replace(/[\d,]/g, '');
                
                let current = 0;
                const increment = number / speed;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < number) {
                        counter.textContent = Math.ceil(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// ==========================================
// BLOCKCHAIN CARD ANIMATION
// ==========================================
function initBlockchainAnimation() {
    const cards = document.querySelectorAll('.blockchain-card');
    
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// ==========================================
// LOADING ANIMATION
// ==========================================
function initLoadingAnimation() {
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Fade in hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            setTimeout(() => {
                heroContent.style.transition = 'opacity 1s ease';
                heroContent.style.opacity = '1';
            }, 100);
        }
    });
}

// ==========================================
// MOBILE MENU (if needed)
// ==========================================
function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuButton.classList.toggle('active');
        });
        
        // Close menu on link click
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuButton.classList.remove('active');
            });
        });
    }
}

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Reduce animations on low-end devices
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('*').forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }
}

// ==========================================
// INITIALIZE ALL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Core features
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        window.particleCanvas = new ParticleCanvas(canvas);
    }
    
    initSmoothScroll();
    initScrollAnimations();
    initParallax();
    initCardEffects();
    initStatsCounter();
    initBlockchainAnimation();
    initLoadingAnimation();
    initMobileMenu();
    optimizePerformance();
    
    // Disable heavy effects on mobile
    if (window.innerWidth > 768) {
        // initCursorGlow(); // Uncomment if you want cursor effect
    }
    
    console.log('%c🚀 Crypto Wallet Bot ', 'background: #7c3aed; color: white; font-size: 20px; padding: 10px;');
    console.log('%cWebsite loaded successfully!', 'color: #7c3aed; font-size: 14px;');
});

// Handle window resize - NO AUTO RELOAD
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Just resize canvas, no reload needed
        const canvas = document.getElementById('particleCanvas');
        if (canvas && window.particleCanvas) {
            window.particleCanvas.resize();
        }
    }, 250);
});

// Reduced motion support
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}
