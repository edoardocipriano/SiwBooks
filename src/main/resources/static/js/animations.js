/**
 * SiwBooks - Animations JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeIntersectionObserver();
});

/**
 * Initialize basic animations
 */
function initializeAnimations() {
    // Apply loaded class to book and author cards to trigger animations
    document.querySelectorAll('.book-card, .author-card').forEach(card => {
        // Small delay for a staggered effect
        setTimeout(() => {
            card.classList.add('loaded');
        }, Math.random() * 300);
    });
    
    // Add hover animations to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = 'var(--hover-shadow)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--box-shadow)';
        });
    });
}

/**
 * Initialize Intersection Observer for scroll animations
 */
function initializeIntersectionObserver() {
    // Only run if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Apply a different animation based on the element's position
                    const position = element.getBoundingClientRect().left > window.innerWidth / 2 ? 
                        'right' : 'left';
                    
                    if (position === 'left') {
                        element.classList.add('slide-in-left');
                    } else {
                        element.classList.add('slide-in-right');
                    }
                    
                    // Unobserve after animation is applied
                    animationObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Observe elements with the 'animate-on-scroll' class
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            animationObserver.observe(element);
        });
    }
}

/**
 * Apply staggered animations to a list of elements
 * @param {string} selector - CSS selector for the container
 * @param {string} itemSelector - CSS selector for the items to animate
 * @param {string} animationClass - CSS animation class to apply
 * @param {number} delay - Delay between animations in ms
 */
function applyStaggeredAnimation(selector, itemSelector, animationClass, delay = 100) {
    const container = document.querySelector(selector);
    if (!container) return;
    
    const items = container.querySelectorAll(itemSelector);
    
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add(animationClass);
        }, index * delay);
    });
}

/**
 * Manually trigger animations for sections
 * @param {string} selector - CSS selector for the target element
 * @param {string} animationClass - CSS animation class to apply
 */
function triggerAnimation(selector, animationClass) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    element.classList.add(animationClass);
} 