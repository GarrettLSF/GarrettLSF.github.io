/**
 * ===================================================================
 * Elite Install - Award-Worthy Professional JavaScript
 * Version: 6.0 (Premium 3D Implementation)
 * ===================================================================
 *
 * This script implements award-worthy interactions including a
 * sophisticated 3D particle system, enhanced animations, and
 * premium micro-interactions while maintaining optimal performance.
 *
 * TABLE OF CONTENTS
 * 1.  App Initialization & Error Handling
 * 2.  Module: Component Loader (Header/Footer)
 * 3.  Module: Mobile Navigation with Accessibility
 * 4.  Module: Premium Sticky Header
 * 5.  Module: Enhanced Scroll Animations (GSAP)
 * 6.  Module: Horizontal Process Scroll with Performance
 * 7.  Module: 3D Hero Background (Three.js Premium Implementation)
 * 8.  Module: Performance Monitor & Optimization
 *
 * ===================================================================
 */

(() => {
    'use strict';

    // --- 1. App Initialization & Error Handling ---
    const App = {
        isInitialized: false,
        
        async init() {
            try {
                // Load components first, then initialize interactions
                await componentLoader.load();
                await this.initComponents();
                this.isInitialized = true;
                console.log('Elite Install: Application initialized successfully');
            } catch (error) {
                console.error('Elite Install: Initialization error:', error);
                this.handleInitError(error);
            }
        },

        async initComponents() {
            // Check for required dependencies
            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                throw new Error('GSAP or ScrollTrigger not loaded');
            }
            
            // Register GSAP plugins
            gsap.registerPlugin(ScrollTrigger);
            
            // Initialize modules in optimal order
            await Promise.all([
                mobileNav.init(),
                stickyHeader.init(),
                scrollAnimator.init(),
                horizontalProcessScroll.init(),
                hero3DBackground.init()
            ]);
            
            // Initialize performance monitor
            performanceMonitor.init();
        },

        handleInitError(error) {
            // Graceful degradation - ensure basic functionality works
            console.warn('Falling back to basic functionality');
            document.body.classList.add('js-disabled');
            
            // Show error message to developers only
            if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    position: fixed; top: 0; left: 0; right: 0; 
                    background: #ff3333; color: white; padding: 1rem; 
                    z-index: 10000; font-family: monospace;
                `;
                errorDiv.textContent = `Development Error: ${error.message}`;
                document.body.prepend(errorDiv);
            }
        }
    };

    // --- 2. Module: Component Loader (Header/Footer) ---
    const componentLoader = {
        cache: new Map(),
        
        async fetchAndInject(url, placeholderId) {
            const placeholder = document.getElementById(placeholderId);
            if (!placeholder) return;
            
            try {
                // Check cache first
                let html = this.cache.get(url);
                
                if (!html) {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    html = await response.text();
                    this.cache.set(url, html);
                }
                
                // Create temporary container for parsing
                const temp = document.createElement('div');
                temp.innerHTML = html;
                
                // Replace placeholder with actual content
                const newElement = temp.firstElementChild;
                if (newElement) {
                    placeholder.replaceWith(newElement);
                } else {
                    placeholder.innerHTML = html;
                }
                
            } catch (error) {
                console.error(`Component loading failed for ${url}:`, error);
                placeholder.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: #999;">
                        <p>Content temporarily unavailable</p>
                    </div>
                `;
            }
        },

        async load() {
            const loadPromises = [
                this.fetchAndInject('header.html', 'header-placeholder'),
                this.fetchAndInject('footer.html', 'footer-placeholder')
            ];
            
            await Promise.allSettled(loadPromises);
            
            // Small delay to ensure DOM is ready
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    };

    // --- 3. Module: Mobile Navigation with Accessibility ---
    const mobileNav = {
        elements: {},
        isOpen: false,
        
        init() {
            // Cache DOM elements after components are loaded
            this.elements = {
                toggleButton: document.querySelector('.mobile-menu-toggle'),
                navContainer: document.querySelector('#nav-links'),
                body: document.body
            };
            
            if (!this.elements.toggleButton || !this.elements.navContainer) {
                console.warn('Mobile navigation elements not found');
                return;
            }

            this.focusableElements = this.elements.navContainer.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            
            this.firstFocusable = this.focusableElements[0];
            this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];

            this.bindEvents();
            this.setupAccessibility();
        },

        bindEvents() {
            this.elements.toggleButton.addEventListener('click', this.toggleMenu.bind(this));
            document.addEventListener('keydown', this.handleKeydown.bind(this));
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isOpen && 
                    !this.elements.navContainer.contains(e.target) && 
                    !this.elements.toggleButton.contains(e.target)) {
                    this.closeMenu();
                }
            });

            // Close menu on nav link click
            this.focusableElements.forEach(link => {
                link.addEventListener('click', () => {
                    if (this.isOpen) this.closeMenu();
                });
            });

            // Handle window resize
            window.addEventListener('resize', this.handleResize.bind(this));
        },

        setupAccessibility() {
            this.elements.toggleButton.setAttribute('aria-expanded', 'false');
            this.elements.toggleButton.setAttribute('aria-controls', 'nav-links');
            this.elements.navContainer.setAttribute('aria-hidden', 'true');
        },

        toggleMenu() {
            this.isOpen ? this.closeMenu() : this.openMenu();
        },

        openMenu() {
            this.isOpen = true;
            this.elements.body.classList.add('mobile-nav-open');
           this.elements.toggleButton.setAttribute('aria-expanded', 'true');
           this.elements.navContainer.setAttribute('aria-hidden', 'false');
           
           // Focus management
           requestAnimationFrame(() => {
               if (this.firstFocusable) this.firstFocusable.focus();
           });

           // Trap focus within navigation
           this.trapFocus();
       },

       closeMenu() {
           this.isOpen = false;
           this.elements.body.classList.remove('mobile-nav-open');
           this.elements.toggleButton.setAttribute('aria-expanded', 'false');
           this.elements.navContainer.setAttribute('aria-hidden', 'true');
           
           // Return focus to toggle button
           this.elements.toggleButton.focus();
       },

       handleKeydown(event) {
           if (!this.isOpen) return;
           
           switch (event.key) {
               case 'Escape':
                   this.closeMenu();
                   break;
               case 'Tab':
                   this.handleTabNavigation(event);
                   break;
           }
       },

       handleTabNavigation(event) {
           if (event.shiftKey) {
               // Shift + Tab
               if (document.activeElement === this.firstFocusable) {
                   this.lastFocusable.focus();
                   event.preventDefault();
               }
           } else {
               // Tab
               if (document.activeElement === this.lastFocusable) {
                   this.firstFocusable.focus();
                   event.preventDefault();
               }
           }
       },

       trapFocus() {
           // Additional focus trapping logic if needed
       },

       handleResize() {
           // Close mobile menu on desktop resize
           if (window.innerWidth > 768 && this.isOpen) {
               this.closeMenu();
           }
       }
   };

   // --- 4. Module: Premium Sticky Header ---
   const stickyHeader = {
       header: null,
       scrollTrigger: null,
       
       init() {
           this.header = document.querySelector('.main-header');
           if (!this.header) {
               console.warn('Header element not found');
               return;
           }

           this.createScrollTrigger();
           this.addScrollEnhancement();
       },

       createScrollTrigger() {
           this.scrollTrigger = ScrollTrigger.create({
               start: 'top top-=1',
               end: '+=99999',
               toggleClass: {
                   className: 'is-scrolled',
                   target: this.header
               },
               onToggle: self => {
                   // Add smooth transition when scrolling state changes
                   if (self.isActive) {
                       gsap.to(this.header, {
                           y: 0,
                           duration: 0.3,
                           ease: 'power2.out'
                       });
                   }
               }
           });
       },

       addScrollEnhancement() {
           let lastScrollY = window.scrollY;
           let ticking = false;

           const updateHeader = () => {
               const currentScrollY = window.scrollY;
               const scrollingDown = currentScrollY > lastScrollY;
               const scrolledPast = currentScrollY > 100;

               if (scrolledPast && scrollingDown && currentScrollY > 200) {
                   // Hide header when scrolling down
                   gsap.to(this.header, {
                       y: -100,
                       duration: 0.3,
                       ease: 'power2.out'
                   });
               } else if (!scrollingDown || currentScrollY < 100) {
                   // Show header when scrolling up or near top
                   gsap.to(this.header, {
                       y: 0,
                       duration: 0.3,
                       ease: 'power2.out'
                   });
               }

               lastScrollY = currentScrollY;
               ticking = false;
           };

           window.addEventListener('scroll', () => {
               if (!ticking) {
                   requestAnimationFrame(updateHeader);
                   ticking = true;
               }
           }, { passive: true });
       }
   };

   // --- 5. Module: Enhanced Scroll Animations (GSAP) ---
   const scrollAnimator = {
       animations: [],
       
       init() {
           // Check for reduced motion preference
           if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
               this.disableAnimations();
               return;
           }

           this.createScrollAnimations();
           this.createMicroInteractions();
       },

       createScrollAnimations() {
           const elementsToAnimate = gsap.utils.toArray('.anim-fade-in-up');
           
           elementsToAnimate.forEach((el, index) => {
               const delay = el.dataset.delay ? parseFloat(el.dataset.delay) / 1000 : 0;
               
               const animation = gsap.to(el, {
                   opacity: 1,
                   y: 0,
                   duration: 1.4,
                   ease: 'power3.out',
                   delay,
                   scrollTrigger: {
                       trigger: el,
                       start: 'top 90%',
                       end: 'bottom 10%',
                       toggleActions: 'play none none reverse',
                       onEnter: () => performanceMonitor.trackAnimation('fadeInUp'),
                   }
               });

               this.animations.push(animation);
           });

           // Stagger animations for feature cards
           this.createFeatureCardAnimations();
       },

       createFeatureCardAnimations() {
           const featureCards = gsap.utils.toArray('.feature-card');
           
           if (featureCards.length > 0) {
               gsap.set(featureCards, { opacity: 0, y: 60, scale: 0.9 });
               
               ScrollTrigger.batch(featureCards, {
                   onEnter: (elements) => {
                       gsap.to(elements, {
                           opacity: 1,
                           y: 0,
                           scale: 1,
                           duration: 0.8,
                           ease: 'back.out(1.4)',
                           stagger: 0.15,
                           overwrite: true
                       });
                   },
                   start: 'top 85%',
                   end: 'bottom 15%'
               });
           }
       },

       createMicroInteractions() {
           // Enhanced button hover effects
           const buttons = document.querySelectorAll('.btn');
           buttons.forEach(btn => {
               btn.addEventListener('mouseenter', () => {
                   gsap.to(btn, {
                       scale: 1.02,
                       duration: 0.3,
                       ease: 'power2.out'
                   });
               });

               btn.addEventListener('mouseleave', () => {
                   gsap.to(btn, {
                       scale: 1,
                       duration: 0.3,
                       ease: 'power2.out'
                   });
               });
           });

           // Feature card interactions
           const featureCards = document.querySelectorAll('.feature-card');
           featureCards.forEach(card => {
               const icon = card.querySelector('.feature-icon');
               
               card.addEventListener('mouseenter', () => {
                   if (icon) {
                       gsap.to(icon, {
                           scale: 1.1,
                           rotation: 5,
                           duration: 0.4,
                           ease: 'back.out(1.7)'
                       });
                   }
               });

               card.addEventListener('mouseleave', () => {
                   if (icon) {
                       gsap.to(icon, {
                           scale: 1,
                           rotation: 0,
                           duration: 0.4,
                           ease: 'back.out(1.7)'
                       });
                   }
               });
           });
       },

       disableAnimations() {
           const elementsToShow = gsap.utils.toArray('.anim-fade-in-up');
           gsap.set(elementsToShow, { opacity: 1, y: 0 });
           console.log('Animations disabled for reduced motion preference');
       }
   };

   // --- 6. Module: Horizontal Process Scroll with Performance ---
   const horizontalProcessScroll = {
       container: null,
       scrollWrapper: null,
       scrollTrigger: null,
       
       init() {
           this.container = document.querySelector('.process-section-container');
           this.scrollWrapper = document.querySelector('.process-steps-wrapper');
           
           if (!this.container || !this.scrollWrapper) {
               console.warn('Process scroll elements not found');
               return;
           }

           // Wait for layout to stabilize
           requestAnimationFrame(() => {
               setTimeout(() => this.createScrollEffect(), 100);
           });

           this.addKeyboardNavigation();
       },

       createScrollEffect() {
           const scrollDistance = this.scrollWrapper.scrollWidth - this.container.offsetWidth;
           
           if (scrollDistance <= 0) {
               console.log('Process scroll: No scrolling needed');
               return;
           }

           this.scrollTrigger = gsap.to(this.scrollWrapper, {
               x: -scrollDistance,
               ease: 'none',
               scrollTrigger: {
                   trigger: this.container,
                   start: 'center center',
                   end: () => `+=${scrollDistance * 1.2}`,
                   scrub: 1,
                   pin: true,
                   anticipatePin: 1,
                   invalidateOnRefresh: true,
                   onUpdate: self => {
                       // Add parallax effect to process step numbers
                       const steps = this.scrollWrapper.querySelectorAll('.process-step span');
                       steps.forEach((step, index) => {
                           const progress = self.progress;
                           const stepProgress = Math.max(0, Math.min(1, (progress - index * 0.25) * 4));
                           
                           gsap.set(step, {
                               scale: 1 + stepProgress * 0.1,
                               rotation: stepProgress * 10
                           });
                       });
                   },
                   onToggle: self => {
                       performanceMonitor.trackAnimation('horizontalScroll');
                   }
               }
           });

           // Refresh on window resize
           window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
       },

       addKeyboardNavigation() {
           const scrollContainer = document.querySelector('.process-horizontal-scroll');
           if (!scrollContainer) return;

           scrollContainer.setAttribute('tabindex', '0');
           scrollContainer.setAttribute('role', 'region');
           scrollContainer.setAttribute('aria-label', 'Horizontally scrolling process steps');

           scrollContainer.addEventListener('keydown', (e) => {
               switch (e.key) {
                   case 'ArrowLeft':
                       e.preventDefault();
                       window.scrollBy({ top: -100, behavior: 'smooth' });
                       break;
                   case 'ArrowRight':
                       e.preventDefault();
                       window.scrollBy({ top: 100, behavior: 'smooth' });
                       break;
               }
           });
       },

       handleResize() {
           if (this.scrollTrigger) {
               // Debounce resize handler
               clearTimeout(this.resizeTimeout);
               this.resizeTimeout = setTimeout(() => {
                   ScrollTrigger.refresh();
               }, 150);
           }
       }
   };

   // --- 7. Module: 3D Hero Background (Three.js Premium Implementation) ---
   const hero3DBackground = {
       scene: null,
       camera: null,
       renderer: null,
       particles: null,
       animationId: null,
       mouse: { x: 0, y: 0 },
       isVisible: true,
       
       async init() {
           const container = document.getElementById('hero-canvas-container');
           if (!container || typeof THREE === 'undefined') {
               console.warn('3D background: Three.js not available or container not found');
               return;
           }

           try {
               await this.setupScene(container);
               this.createParticleSystem();
               this.addEventListeners();
               this.startAnimation();
               console.log('3D Hero Background: Successfully initialized');
           } catch (error) {
               console.error('3D background initialization failed:', error);
               this.cleanup();
           }
       },

       async setupScene(container) {
           // Scene setup
           this.scene = new THREE.Scene();
           
           // Camera setup with responsive FOV
           const fov = window.innerWidth < 768 ? 85 : 75;
           this.camera = new THREE.PerspectiveCamera(
               fov,
               container.offsetWidth / container.offsetHeight,
               0.1,
               1000
           );
           this.camera.position.z = 5;

           // Renderer setup with optimizations
           this.renderer = new THREE.WebGLRenderer({
               alpha: true,
               antialias: window.devicePixelRatio < 2,
               powerPreference: 'low-power'
           });
           
           this.renderer.setSize(container.offsetWidth, container.offsetHeight);
           this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
           this.renderer.setClearColor(0x000000, 0);
           
           container.appendChild(this.renderer.domElement);
       },

       createParticleSystem() {
           const particleCount = this.getOptimalParticleCount();
           const geometry = new THREE.BufferGeometry();
           const positions = new Float32Array(particleCount * 3);
           const colors = new Float32Array(particleCount * 3);
           const sizes = new Float32Array(particleCount);

           // Create particles in a distributed pattern
           for (let i = 0; i < particleCount; i++) {
               const i3 = i * 3;
               
               // Position particles in a wider area
               positions[i3] = (Math.random() - 0.5) * 20;     // x
               positions[i3 + 1] = (Math.random() - 0.5) * 15; // y  
               positions[i3 + 2] = (Math.random() - 0.5) * 10; // z

               // Color variation (subtle grays and whites)
               const colorIntensity = 0.3 + Math.random() * 0.7;
               colors[i3] = colorIntensity;     // r
               colors[i3 + 1] = colorIntensity; // g
               colors[i3 + 2] = colorIntensity; // b

               // Size variation
               sizes[i] = Math.random() * 2 + 0.5;
           }

           geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
           geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
           geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

           // Shader material for better performance and effects
           const material = new THREE.ShaderMaterial({
               uniforms: {
                   time: { value: 0 },
                   mouse: { value: new THREE.Vector2(0, 0) },
                   pixelRatio: { value: this.renderer.getPixelRatio() }
               },
               vertexShader: this.getVertexShader(),
               fragmentShader: this.getFragmentShader(),
               transparent: true,
               vertexColors: true,
               blending: THREE.AdditiveBlending,
               depthWrite: false
           });

           this.particles = new THREE.Points(geometry, material);
           this.scene.add(this.particles);

           // Store reference for animation
           this.particlesMaterial = material;
           this.particlesGeometry = geometry;
       },

       getOptimalParticleCount() {
           // Adaptive particle count based on device performance
           const baseCount = 800;
           const isMobile = window.innerWidth < 768;
           const hasHighDPI = window.devicePixelRatio > 1.5;
           
           if (isMobile) return Math.floor(baseCount * 0.4);
           if (hasHighDPI) return Math.floor(baseCount * 0.7);
           return baseCount;
       },

       getVertexShader() {
           return `
               attribute float size;
               uniform float time;
               uniform vec2 mouse;
               uniform float pixelRatio;
               varying vec3 vColor;
               varying float vAlpha;
               
               void main() {
                   vColor = color;
                   
                   // Subtle movement
                   vec3 pos = position;
                   pos.x += sin(time * 0.0005 + position.y * 0.01) * 0.1;
                   pos.y += cos(time * 0.0003 + position.x * 0.01) * 0.1;
                   pos.z += sin(time * 0.0004 + position.x * 0.02) * 0.05;
                   
                   // Mouse interaction
                   vec2 mouseInfluence = mouse * 0.1;
                   pos.x += mouseInfluence.x * (1.0 - abs(position.z) / 10.0);
                   pos.y += mouseInfluence.y * (1.0 - abs(position.z) / 10.0);
                   
                   vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                   gl_Position = projectionMatrix * mvPosition;
                   
                   // Size and alpha based on distance
                   float distanceToCamera = length(mvPosition.xyz);
                   gl_PointSize = size * pixelRatio * (300.0 / distanceToCamera);
                   vAlpha = 1.0 - (distanceToCamera / 15.0);
                   vAlpha = clamp(vAlpha * 0.8, 0.0, 0.8);
               }
           `;
       },

       getFragmentShader() {
           return `
               varying vec3 vColor;
               varying float vAlpha;
               
               void main() {
                   // Create soft circular particles
                   vec2 center = gl_PointCoord - vec2(0.5);
                   float dist = length(center);
                   
                   if (dist > 0.5) discard;
                   
                   float alpha = vAlpha * (1.0 - dist * 2.0);
                   alpha = smoothstep(0.0, 1.0, alpha);
                   
                   gl_FragColor = vec4(vColor, alpha);
               }
           `;
       },

       addEventListeners() {
           // Mouse movement tracking
           const container = document.getElementById('hero-canvas-container');
           let mouseMoveTimeout;

           const handleMouseMove = (event) => {
               const rect = container.getBoundingClientRect();
               this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
               this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

               // Smooth mouse interaction
               if (this.particlesMaterial) {
                   gsap.to(this.particlesMaterial.uniforms.mouse.value, {
                       x: this.mouse.x * 0.3,
                       y: this.mouse.y * 0.3,
                       duration: 0.8,
                       ease: 'power2.out'
                   });
               }

               clearTimeout(mouseMoveTimeout);
               mouseMoveTimeout = setTimeout(() => {
                   // Return to neutral position when mouse stops
                   if (this.particlesMaterial) {
                       gsap.to(this.particlesMaterial.uniforms.mouse.value, {
                           x: 0,
                           y: 0,
                           duration: 2,
                           ease: 'power2.out'
                       });
                   }
               }, 1000);
           };

           container.addEventListener('mousemove', handleMouseMove, { passive: true });

           // Window resize handling
           window.addEventListener('resize', this.handleResize.bind(this), { passive: true });

           // Intersection Observer for performance
           this.setupIntersectionObserver(container);

           // Reduced motion handling
           if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
               this.particles.material.uniforms.time.value = 0;
           }
       },

       setupIntersectionObserver(container) {
           const observer = new IntersectionObserver((entries) => {
               entries.forEach(entry => {
                   this.isVisible = entry.isIntersecting;
               });
           }, { threshold: 0.1 });

           observer.observe(container);
       },

       startAnimation() {
           let lastTime = 0;
           const targetFPS = 60;
           const frameInterval = 1000 / targetFPS;

           const animate = (currentTime) => {
               this.animationId = requestAnimationFrame(animate);

               // Throttle to target FPS
               if (currentTime - lastTime < frameInterval) return;
               lastTime = currentTime;

               // Only animate when visible
               if (!this.isVisible) return;

               if (this.particlesMaterial) {
                   this.particlesMaterial.uniforms.time.value = currentTime;
               }

               // Subtle rotation
               if (this.particles) {
                   this.particles.rotation.y += 0.0005;
               }

               this.renderer.render(this.scene, this.camera);
               performanceMonitor.trackFrame();
           };

           animate(0);
       },

       handleResize() {
           if (!this.renderer || !this.camera) return;

           const container = document.getElementById('hero-canvas-container');
           if (!container) return;

           const width = container.offsetWidth;
           const height = container.offsetHeight;

           this.camera.aspect = width / height;
           this.camera.updateProjectionMatrix();
           this.renderer.setSize(width, height);

           // Update pixel ratio for mobile optimization
           this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
       },

       cleanup() {
           if (this.animationId) {
               cancelAnimationFrame(this.animationId);
           }

           if (this.renderer) {
               this.renderer.dispose();
           }

           if (this.particlesGeometry) {
               this.particlesGeometry.dispose();
           }

           if (this.particlesMaterial) {
               this.particlesMaterial.dispose();
           }

           const container = document.getElementById('hero-canvas-container');
           if (container) {
               container.innerHTML = '';
           }
       }
   };

   // --- 8. Module: Performance Monitor & Optimization ---
   const performanceMonitor = {
       frameCount: 0,
       lastTime: performance.now(),
       fps: 0,
       animationCount: 0,
       
       init() {
           if (process.env.NODE_ENV === 'development') {
               this.createDebugPanel();
           }
           
           this.monitorPerformance();
       },

       trackFrame() {
           this.frameCount++;
           const currentTime = performance.now();
           
           if (currentTime >= this.lastTime + 1000) {
               this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
               this.frameCount = 0;
               this.lastTime = currentTime;
               
               // Optimize based on FPS
               if (this.fps < 45) {
                   this.optimizePerformance();
               }
           }
       },

       trackAnimation(type) {
           this.animationCount++;
           
           // Log performance in development
           if (process.env.NODE_ENV === 'development') {
               console.log(`Animation triggered: ${type}, Total: ${this.animationCount}`);
           }
       },

       optimizePerformance() {
           console.warn('Performance optimization triggered - FPS:', this.fps);
           
           // Reduce particle count
           if (hero3DBackground.particles && hero3DBackground.particlesGeometry) {
               const positions = hero3DBackground.particlesGeometry.attributes.position;
               if (positions.count > 200) {
                   positions.count = Math.floor(positions.count * 0.7);
                   positions.needsUpdate = true;
               }
           }
       },

       createDebugPanel() {
           const panel = document.createElement('div');
           panel.id = 'perf-panel';
           panel.style.cssText = `
               position: fixed; top: 10px; right: 10px; z-index: 10000;
               background: rgba(0,0,0,0.8); color: white; padding: 1rem;
               font-family: monospace; font-size: 12px; border-radius: 4px;
               backdrop-filter: blur(10px);
           `;
           document.body.appendChild(panel);
           
           setInterval(() => {
               panel.innerHTML = `
                   <div>FPS: ${this.fps}</div>
                   <div>Animations: ${this.animationCount}</div>
                   <div>Memory: ${this.getMemoryUsage()}</div>
               `;
           }, 1000);
       },

       getMemoryUsage() {
           if (performance.memory) {
               return `${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)}MB`;
           }
           return 'N/A';
       }
   };

   // --- Application Startup ---
   if (document.readyState === 'loading') {
       document.addEventListener('DOMContentLoaded', () => App.init());
   } else {
       App.init();
   }

   // Expose for debugging in development
   if (process.env.NODE_ENV === 'development') {
       window.EliteInstall = {
           App,
           modules: {
               componentLoader,
               mobileNav,
               stickyHeader,
               scrollAnimator,
               horizontalProcessScroll,
               hero3DBackground,
               performanceMonitor
           }
       };
   }

})();
