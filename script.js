// ========================================
// ULTRA-OPTIMIZED JAVASCRIPT
// Async loading, no render blocking
// ========================================

(function() {
    'use strict';
    
    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
    const debounce = (func, wait = 20) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };
    
    const throttle = (func, limit = 100) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };
    
    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    
    const initMobileMenu = () => {
        const toggle = document.getElementById('mobileMenuToggle');
        const menu = document.getElementById('navMenu');
        const links = document.querySelectorAll('.nav-link');
        
        if (!toggle || !menu) return;
        
        // Toggle menu
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
            toggle.setAttribute('aria-expanded', menu.classList.contains('active'));
        });
        
        // Close on link click
        links.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('active')) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
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
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, 100);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    };
    
    // ========================================
    // SMOOTH SCROLLING
    // ========================================
    
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
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
        
        if (sections.length === 0) return;
        
        const handleScroll = throttle(() => {
            const scrollPos = window.scrollY + 150;
            
            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');
                
                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, 100);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    };
    
    // ========================================
    // BACK TO TOP BUTTON
    // ========================================
    
    const initBackToTop = () => {
        const btn = document.getElementById('backToTop');
        if (!btn) return;
        
        const handleScroll = throttle(() => {
            btn.classList.toggle('visible', window.scrollY > 400);
        }, 100);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        handleScroll();
    };
    
    // ========================================
    // LAZY LOADING OPTIMIZATION
    // ========================================
    
    const initLazyLoading = () => {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading supported - nothing to do
            return;
        }
        
        // Fallback for older browsers
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) img.src = img.dataset.src;
                        imageObserver.unobserve(img);
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
    // SCROLL ANIMATIONS
    // ========================================
    
    const initScrollAnimations = () => {
        if (!('IntersectionObserver' in window)) return;
        
        const elements = document.querySelectorAll('.service-card, .gallery-item, .testimonial-card, .trust-badge');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    };
    
    // ========================================
    // ACCESSIBILITY
    // ========================================
    
    const initAccessibility = () => {
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
    };
    
    // ========================================
    // EXTERNAL LINKS
    // ========================================
    
    const initExternalLinks = () => {
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        
        externalLinks.forEach(link => {
            if (link.hostname === window.location.hostname) return;
            if (!link.hasAttribute('target')) link.setAttribute('target', '_blank');
            if (!link.hasAttribute('rel')) link.setAttribute('rel', 'noopener');
        });
    };
    
    // ========================================
    // PHONE & EMAIL TRACKING
    // ========================================
    
    const initContactTracking = () => {
        // Phone links
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'phone_call', {
                        'event_category': 'contact',
                        'event_label': link.href
                    });
                }
                console.log('Phone click:', link.href);
            });
        });
        
        // Email links
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'email_click', {
                        'event_category': 'contact',
                        'event_label': link.href
                    });
                }
                console.log('Email click:', link.href);
            });
        });
    };
    
    // ========================================
    // DETECT BROWSER
    // ========================================
    
    const detectBrowser = () => {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        if (isSafari) document.documentElement.classList.add('is-safari');
        if (isIOS) document.documentElement.classList.add('is-ios');
    };
    
    // ========================================
    // INITIALIZE ALL
    // ========================================
    
    const init = () => {
        initMobileMenu();
        initStickyNavbar();
        initSmoothScroll();
        initActiveNav();
        initBackToTop();
        initLazyLoading();
        initScrollAnimations();
        initAccessibility();
        initExternalLinks();
        initContactTracking();
        detectBrowser();
        
        console.log('✓ Site initialized');
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
    // PAGE VISIBILITY
    // ========================================
    
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Page is visible - could restart animations
        }
    });
    
    // ========================================
    // ONLINE/OFFLINE STATUS
    // ========================================
    
    window.addEventListener('online', () => {
        console.log('Connection restored');
    });
    
    window.addEventListener('offline', () => {
        console.log('Connection lost');
    });
    
})();
