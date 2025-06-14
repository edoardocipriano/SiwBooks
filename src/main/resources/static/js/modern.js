/**
 * Modern JavaScript for SiwBooks
 * Adds enhanced interactivity and user experience
 */

// Enhanced DOM ready function
const ready = (fn) => {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};

ready(() => {
    initializeModernFeatures();
});

function initializeModernFeatures() {
    // Initialize all modern features
    initScrollAnimations();
    initEnhancedCards();
    initProgressBars();
    initTooltips();
    initImageLazyLoading();
    initSearchEnhancements();
    initRippleEffects();
    initParallaxEffects();
    initSmoothScrolling();
}

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stagger animation for multiple elements
                const siblings = Array.from(entry.target.parentNode.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.book-card, .author-card, .review-item, .message').forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
}

// Enhanced card interactions
function initEnhancedCards() {
    const cards = document.querySelectorAll('.book-card, .author-card');
    
    cards.forEach(card => {
        // Add tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
        
        // Add click animation
        card.addEventListener('click', function(e) {
            if (!e.target.matches('button, a, .btn')) {
                createRippleEffect(this, e);
            }
        });
    });
}

// Progress bars for loading states
function initProgressBars() {
    // Create a progress bar for page loading
    const progressBar = document.createElement('div');
    progressBar.className = 'page-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    // Show progress during navigation
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        
        const fill = progressBar.querySelector('.progress-fill');
        fill.style.width = progress + '%';
        
        if (document.readyState === 'complete') {
            fill.style.width = '100%';
            setTimeout(() => {
                progressBar.style.opacity = '0';
                setTimeout(() => progressBar.remove(), 300);
            }, 200);
            clearInterval(interval);
        }
    }, 100);
}

// Enhanced tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        let tooltip;
        
        element.addEventListener('mouseenter', function() {
            tooltip = document.createElement('div');
            tooltip.className = 'modern-tooltip';
            tooltip.textContent = this.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            positionTooltip(this, tooltip);
            
            requestAnimationFrame(() => {
                tooltip.classList.add('show');
            });
        });
        
        element.addEventListener('mouseleave', function() {
            if (tooltip) {
                tooltip.classList.remove('show');
                setTimeout(() => tooltip.remove(), 200);
            }
        });
        
        element.addEventListener('mousemove', function(e) {
            if (tooltip) {
                positionTooltip(this, tooltip);
            }
        });
    });
}

function positionTooltip(element, tooltip) {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 10;
    
    // Adjust if tooltip goes off screen
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) {
        top = rect.bottom + 10;
        tooltip.classList.add('bottom');
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

// Lazy loading for images
function initImageLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Enhanced search functionality
function initSearchEnhancements() {
    const searchInputs = document.querySelectorAll('input[type="search"], #book-search');
    
    searchInputs.forEach(input => {
        let searchTimeout;
        
        // Add search suggestions
        const suggestions = document.createElement('div');
        suggestions.className = 'search-suggestions';
        input.parentNode.appendChild(suggestions);
        
        input.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    // Simulate search suggestions (replace with actual API call)
                    showSearchSuggestions(suggestions, query);
                }, 300);
            } else {
                suggestions.style.display = 'none';
            }
        });
        
        input.addEventListener('blur', () => {
            setTimeout(() => suggestions.style.display = 'none', 200);
        });
    });
}

function showSearchSuggestions(container, query) {
    // Placeholder for search suggestions
    const mockSuggestions = [
        '1984 - George Orwell',
        'To Kill a Mockingbird',
        'The Great Gatsby',
        'Pride and Prejudice'
    ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
    
    if (mockSuggestions.length > 0) {
        container.innerHTML = mockSuggestions
            .map(suggestion => `<div class="suggestion-item">${suggestion}</div>`)
            .join('');
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

// Ripple effects for buttons
function initRippleEffects() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn, button')) {
            createRippleEffect(e.target, e);
        }
    });
}

function createRippleEffect(element, event) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 1000);
}

// Parallax effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Enhanced form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
        
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showFormError('Per favore, correggi gli errori nel form prima di continuare.');
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Questo campo è obbligatorio');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Inserisci un indirizzo email valido');
            return false;
        }
    }
    
    // Minimum length validation
    if (field.minLength && value.length < field.minLength) {
        showFieldError(field, `Minimo ${field.minLength} caratteri`);
        return false;
    }
    
    // Success state
    if (fieldGroup) {
        fieldGroup.classList.add('success');
    }
    
    return true;
}

function showFieldError(field, message) {
    const fieldGroup = field.closest('.form-group');
    if (fieldGroup) {
        fieldGroup.classList.add('error');
        
        let errorMsg = fieldGroup.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            fieldGroup.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }
}

function clearFieldError(field) {
    const fieldGroup = field.closest('.form-group');
    if (fieldGroup) {
        fieldGroup.classList.remove('error', 'success');
        const errorMsg = fieldGroup.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
}

function showFormError(message) {
    const existingAlert = document.querySelector('.form-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = 'form-alert error';
    alert.textContent = message;
    
    const form = document.querySelector('form');
    if (form) {
        form.insertBefore(alert, form.firstChild);
        setTimeout(() => alert.remove(), 5000);
    }
}

// Add dynamic CSS for modern features
function addModernStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .page-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(52, 152, 219, 0.2);
            z-index: 9999;
            transition: opacity 0.3s ease;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3498db, #2980b9);
            width: 0%;
            transition: width 0.3s ease;
        }
        
        .modern-tooltip {
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            white-space: nowrap;
            z-index: 10000;
            opacity: 0;
            transform: translateY(5px);
            transition: all 0.2s ease;
            pointer-events: none;
        }
        
        .modern-tooltip.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .modern-tooltip.bottom::before {
            content: '';
            position: absolute;
            top: -4px;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-bottom-color: rgba(0, 0, 0, 0.9);
        }
        
        .modern-tooltip:not(.bottom)::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-top-color: rgba(0, 0, 0, 0.9);
        }
        
        .search-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            display: none;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .suggestion-item {
            padding: 12px 16px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        
        .suggestion-item:hover {
            background-color: var(--secondary-color);
            color: white;
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .form-alert {
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            animation: slideInLeft 0.3s ease;
        }
        
        .form-alert.error {
            background: var(--error-bg);
            color: var(--error-color);
            border: 1px solid var(--error-color);
        }
        
        img.loaded {
            opacity: 1;
            transform: scale(1);
        }
        
        img[data-src] {
            opacity: 0;
            transform: scale(0.9);
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Initialize styles
addModernStyles();

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        });
    }
}

trackPerformance(); 