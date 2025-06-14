/**
 * SiwBooks - Reviews JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Reviews.js loaded');
    initializeStarRating();
    initializeCharacterCounter();
    initializeReviewForm();
    initializeReviewFilters();
    initializeHelpfulButtons();
    initializeSpoilerToggles();
});

/**
 * Star rating functionality for review form
 */
function initializeStarRating() {
    console.log('Initializing star rating system');
    
    const ratingContainers = document.querySelectorAll('.star-rating-container');
    console.log('Found rating containers:', ratingContainers.length);
    
    ratingContainers.forEach(container => {
        const ratingInput = container.parentElement.querySelector('input[type="hidden"]');
        const ratingText = container.parentElement.querySelector('.rating-text');
        
        if (!ratingInput) {
            console.error('Rating input not found for container:', container);
            return;
        }
        
        console.log('Setting up rating for input:', ratingInput.id, 'current value:', ratingInput.value);
        
        // Clear container and create stars
        container.innerHTML = '';
        
        const ratingDescriptions = {
            1: 'Pessimo',
            2: 'Mediocre', 
            3: 'Buono',
            4: 'Molto Buono',
            5: 'Eccellente'
        };
        
        // Create 5 stars
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.classList.add('rating-star');
            star.dataset.value = i;
            star.innerHTML = '★';
            star.style.cursor = 'pointer';
            star.style.fontSize = '2rem';
            star.style.color = '#ddd';
            star.style.transition = 'all 0.2s ease';
            star.style.marginRight = '0.25rem';
            
            // Click event
            star.addEventListener('click', function() {
                const value = parseInt(this.dataset.value);
                console.log('Star clicked, value:', value);
                ratingInput.value = value;
                updateStars(container, value);
                if (ratingText) {
                    ratingText.textContent = ratingDescriptions[value];
                }
                
                // Add animation
                this.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            });
            
            // Hover events
            star.addEventListener('mouseenter', function() {
                const value = parseInt(this.dataset.value);
                highlightStars(container, value);
            });
            
            star.addEventListener('mouseleave', function() {
                const currentRating = parseInt(ratingInput.value) || 0;
                updateStars(container, currentRating);
            });
            
            container.appendChild(star);
        }
        
        // Initialize with current value
        const currentRating = parseInt(ratingInput.value) || 5;
        console.log('Initializing with rating:', currentRating);
        updateStars(container, currentRating);
        if (ratingText) {
            ratingText.textContent = ratingDescriptions[currentRating] || 'Non valutato';
        }
    });
    
    function updateStars(container, rating) {
        const stars = container.querySelectorAll('.rating-star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#f1c40f';
                star.classList.add('active');
            } else {
                star.style.color = '#ddd';
                star.classList.remove('active');
            }
        });
    }
    
    function highlightStars(container, rating) {
        const stars = container.querySelectorAll('.rating-star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#e67e22';
                star.style.transform = 'scale(1.1)';
            } else {
                star.style.color = '#ddd';
                star.style.transform = 'scale(1)';
            }
        });
    }
}

/**
 * Character counter for textareas
 */
function initializeCharacterCounter() {
    console.log('Initializing character counter');
    
    const textareas = document.querySelectorAll('textarea');
    console.log('Found textareas:', textareas.length);
    
    textareas.forEach(textarea => {
        const counter = textarea.parentElement.querySelector('.character-counter');
        if (!counter) return;
        
        const currentSpan = counter.querySelector('.current');
        const maxLength = parseInt(textarea.getAttribute('maxlength')) || 1000;
        
        function updateCounter() {
            const length = textarea.value.length;
            currentSpan.textContent = length;
            
            // Color coding
            const percentage = (length / maxLength) * 100;
            if (percentage > 90) {
                counter.style.color = '#e74c3c';
            } else if (percentage > 75) {
                counter.style.color = '#f39c12';
            } else {
                counter.style.color = '#7f8c8d';
            }
        }
        
        // Initialize
        updateCounter();
        
        textarea.addEventListener('input', updateCounter);
    });
}

/**
 * General review form initialization
 */
function initializeReviewForm() {
    console.log('Initializing review form');
    
    // Add form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const ratingInput = form.querySelector('input[type="hidden"][id*="rating"]');
            if (ratingInput && (!ratingInput.value || ratingInput.value < 1 || ratingInput.value > 5)) {
                e.preventDefault();
                alert('Per favore seleziona una valutazione da 1 a 5 stelle');
                return false;
            }
        });
    });
}

/**
 * Display stars for existing ratings (read-only)
 */
function displayRatingStars(rating, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.innerHTML = '★';
        star.style.fontSize = '1.2rem';
        star.style.marginRight = '0.1rem';
        
        if (i <= rating) {
            star.style.color = '#f1c40f';
        } else {
            star.style.color = '#ddd';
        }
        
        container.appendChild(star);
    }
}

/**
 * Filter reviews by rating, date, etc.
 */
function initializeReviewFilters() {
    const filterForm = document.getElementById('review-filter-form');
    if (!filterForm) return;
    
    const reviewItems = document.querySelectorAll('.review-item');
    if (reviewItems.length === 0) return;
    
    const ratingFilter = document.getElementById('filter-rating');
    const sortFilter = document.getElementById('filter-sort');
    
    // Apply filters on change
    [ratingFilter, sortFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
    
    // Filter function
    function applyFilters() {
        const ratingValue = ratingFilter ? parseInt(ratingFilter.value) : 0;
        const sortValue = sortFilter ? sortFilter.value : 'newest';
        
        // First filter by rating
        let visibleReviews = Array.from(reviewItems);
        
        if (ratingValue > 0) {
            visibleReviews = visibleReviews.filter(review => {
                const reviewRating = parseInt(review.dataset.rating || 0);
                return reviewRating === ratingValue;
            });
        }
        
        // Then sort the results
        visibleReviews.sort((a, b) => {
            if (sortValue === 'newest') {
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            } else if (sortValue === 'oldest') {
                return new Date(a.dataset.date) - new Date(b.dataset.date);
            } else if (sortValue === 'highest') {
                return parseInt(b.dataset.rating || 0) - parseInt(a.dataset.rating || 0);
            } else if (sortValue === 'lowest') {
                return parseInt(a.dataset.rating || 0) - parseInt(b.dataset.rating || 0);
            } else if (sortValue === 'helpful') {
                return parseInt(b.dataset.helpful || 0) - parseInt(a.dataset.helpful || 0);
            }
            return 0;
        });
        
        // Hide all reviews first
        reviewItems.forEach(review => {
            review.style.display = 'none';
            review.classList.remove('fade-in');
        });
        
        // Show only filtered reviews with staggered animation
        visibleReviews.forEach((review, index) => {
            review.style.display = 'block';
            setTimeout(() => {
                review.classList.add('fade-in');
            }, index * 100);
        });
        
        // Update counts
        const countElement = document.getElementById('review-count');
        if (countElement) {
            countElement.textContent = visibleReviews.length;
        }
        
        // Show message if no reviews match
        const noReviewsMsg = document.getElementById('no-reviews-message');
        if (noReviewsMsg) {
            noReviewsMsg.style.display = visibleReviews.length === 0 ? 'block' : 'none';
        }
    }
}

/**
 * Handle "Was this review helpful?" buttons
 */
function initializeHelpfulButtons() {
    const helpfulButtons = document.querySelectorAll('.helpful-button');
    
    helpfulButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const reviewId = this.dataset.reviewId;
            if (!reviewId) return;
            
            // Check if user already voted
            if (localStorage.getItem(`review_helpful_${reviewId}`)) {
                showMessage('Hai già votato per questa recensione.');
                return;
            }
            
            // This would normally be an AJAX call to the server
            // For now, we'll just simulate it
            const helpfulCount = this.querySelector('.helpful-count');
            if (helpfulCount) {
                let count = parseInt(helpfulCount.textContent) || 0;
                count++;
                helpfulCount.textContent = count;
                
                // Mark as voted in localStorage
                localStorage.setItem(`review_helpful_${reviewId}`, 'true');
                
                // Change button appearance
                this.classList.add('voted');
                this.setAttribute('disabled', 'disabled');
                
                // Show confirmation
                showMessage('Grazie per il tuo feedback!');
            }
        });
    });
    
    function showMessage(text) {
        // Create or use existing message element
        let message = document.querySelector('.helpful-message');
        if (!message) {
            message = document.createElement('div');
            message.classList.add('helpful-message');
            document.querySelector('.reviews-container').appendChild(message);
        }
        
        message.textContent = text;
        message.classList.add('show');
        
        setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    }
}

/**
 * Toggle spoiler content in reviews
 */
function initializeSpoilerToggles() {
    const spoilerToggles = document.querySelectorAll('.spoiler-toggle');
    
    spoilerToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            const spoilerContent = this.nextElementSibling;
            if (!spoilerContent || !spoilerContent.classList.contains('spoiler-content')) return;
            
            spoilerContent.classList.toggle('revealed');
            this.textContent = spoilerContent.classList.contains('revealed') ? 
                'Nascondi spoiler' : 'Mostra spoiler';
        });
    });
} 