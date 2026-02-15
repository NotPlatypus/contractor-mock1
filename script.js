// ========================================
// PERFORMANCE OPTIMIZED JAVASCRIPT
// ========================================

(function() {
    'use strict';
    
    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
    const debounce = (func, wait = 20, immediate = true) => {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };
    
    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    
    const initMobileMenu = () => {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!mobileMenuToggle || !navMenu) return;
        
        // Toggle mobile menu
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            
            // Update ARIA attribute
            const isExpanded = mobileMenuToggle.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    };
    
    // ========================================
    // STICKY NAVBAR
    // ========================================
    
    const initStickyNavbar = () => {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;
        
        const handleScroll = throttle(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    };
    
    // ========================================
    // SMOOTH SCROLLING
    // ========================================
    
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                
                // Ignore empty anchors
                if (href === '#' || href === '#!') return;
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    
                    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };
    
    // ========================================
    // ACTIVE NAVIGATION LINK
    // ========================================
    
    const initActiveNav = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        const handleScroll = throttle(() => {
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');
                
                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    };
    
    // ========================================
    // BACK TO TOP BUTTON
    // ========================================
    
    const initBackToTop = () => {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
        const handleScroll = throttle(() => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        handleScroll(); // Initial check
    };
    
    // ========================================
    // LAZY LOADING IMAGES
    // ========================================
    
    const initLazyLoading = () => {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading supported
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        } else {
            // Fallback for browsers that don't support native lazy loading
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    };
    
    // ========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================
    
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .testimonial-card, .trust-badge');
        
        if (animatedElements.length === 0) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered animation delay
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    };
    
    // ========================================
    // HANDLE EXTERNAL LINKS
    // ========================================
    
    const initExternalLinks = () => {
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        
        externalLinks.forEach(link => {
            // Skip links to the same domain
            if (link.hostname === window.location.hostname) return;
            
            // Add target="_blank" if not present
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_blank');
            }
            
            // Add rel="noopener" for security
            if (!link.hasAttribute('rel')) {
                link.setAttribute('rel', 'noopener');
            }
        });
    };
    
    // ========================================
    // PHONE CLICK TRACKING (Optional)
    // ========================================
    
    const initPhoneTracking = () => {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        
        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                // You can add analytics tracking here
                console.log('Phone link clicked:', link.href);
                
                // Example: Google Analytics event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'phone_call', {
                        'event_category': 'contact',
                        'event_label': link.href
                    });
                }
            });
        });
    };
    
    // ========================================
    // EMAIL CLICK TRACKING (Optional)
    // ========================================
    
    const initEmailTracking = () => {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        
        emailLinks.forEach(link => {
            link.addEventListener('click', () => {
                // You can add analytics tracking here
                console.log('Email link clicked:', link.href);
                
                // Example: Google Analytics event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'email_click', {
                        'event_category': 'contact',
                        'event_label': link.href
                    });
                }
            });
        });
    };
    
    // ========================================
    // PERFORMANCE MONITORING
    // ========================================
    
    const logPerformanceMetrics = () => {
        if (!('performance' in window)) return;
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                
                if (perfData) {
                    console.log('Page Load Performance:');
                    console.log('- DOM Content Loaded:', Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart), 'ms');
                    console.log('- Page Load Time:', Math.round(perfData.loadEventEnd - perfData.loadEventStart), 'ms');
                    console.log('- Total Load Time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
                }
            }, 0);
        });
    };
    
    // ========================================
    // FORM VALIDATION (If you add a contact form later)
    // ========================================
    
    const initFormValidation = () => {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                    } else {
                        field.classList.remove('error');
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    alert('Please fill in all required fields.');
                }
            });
        });
    };
    
    // ========================================
    // ACCESSIBILITY IMPROVEMENTS
    // ========================================
    
    const initAccessibility = () => {
        // Skip to main content link
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.setAttribute('tabindex', '-1');
                    mainContent.focus();
                }
            });
        }
        
        // Trap focus in mobile menu when open
        const navMenu = document.getElementById('navMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (navMenu && mobileMenuToggle) {
            document.addEventListener('keydown', (e) => {
                if (!navMenu.classList.contains('active')) return;
                
                if (e.key === 'Escape') {
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenuToggle.focus();
                }
            });
        }
    };
    
    // ========================================
    // DETECT SAFARI AND ADD CLASS
    // ========================================
    
    const detectBrowser = () => {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (isSafari) {
            document.documentElement.classList.add('is-safari');
        }
        
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
            document.documentElement.classList.add('is-ios');
        }
    };
    
    // ========================================
    // SERVICE WORKER REGISTRATION (For PWA - Optional)
    // ========================================
    
    const initServiceWorker = () => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('Service Worker registered:', registration.scope);
                    })
                    .catch(err => {
                        console.log('Service Worker registration failed:', err);
                    });
            });
        }
    };
    
    // ========================================
    // INITIALIZE ALL FUNCTIONS
    // ========================================
    
    const init = () => {
        // Core functionality
        initMobileMenu();
        initStickyNavbar();
        initSmoothScroll();
        initActiveNav();
        initBackToTop();
        
        // Performance optimizations
        initLazyLoading();
        initScrollAnimations();
        
        // Enhancements
        initExternalLinks();
        initPhoneTracking();
        initEmailTracking();
        initFormValidation();
        initAccessibility();
        detectBrowser();
        
        // Optional
        // initServiceWorker();
        logPerformanceMetrics();
        
        // Log initialization
        console.log('✓ Site initialized successfully');
    };
    
    // ========================================
    // DOM READY
    // ========================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // ========================================
    // HANDLE PAGE VISIBILITY
    // ========================================
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden - pause animations, videos, etc.
            console.log('Page is hidden');
        } else {
            // Page is visible - resume animations, videos, etc.
            console.log('Page is visible');
        }
    });
    
})();

// ========================================
// ONLINE/OFFLINE STATUS
// ========================================

window.addEventListener('online', () => {
    console.log('Connection restored');
    // You can show a notification to the user
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    // You can show a notification to the user
});
