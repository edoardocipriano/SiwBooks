/**
 * SiwBooks - Reviews JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeStarRating();
    initializeReviewFilters();
    initializeHelpfulButtons();
    initializeSpoilerToggles();
});

/**
 * Star rating functionality for review form
 */
function initializeStarRating() {
    const ratingContainer = document.querySelector('.star-rating-container');
    if (!ratingContainer) return;
    
    const ratingInput = document.getElementById('rating');
    if (!ratingInput) return;
    
    // Create star elements
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.classList.add('rating-star');
        star.dataset.value = i;
        ratingContainer.appendChild(star);
        
        // Add event listeners
        star.addEventListener('click', function() {
            const value = this.dataset.value;
            ratingInput.value = value;
            updateStars(value);
        });
        
        star.addEventListener('mouseover', function() {
            const value = this.dataset.value;
            highlightStars(value);
        });
        
        star.addEventListener('mouseout', function() {
            const currentRating = ratingInput.value || 0;
            highlightStars(currentRating);
        });
    }
    
    // Initialize with current value
    if (ratingInput.value) {
        updateStars(ratingInput.value);
    }
    
    // Helper functions
    function updateStars(value) {
        ratingInput.value = value;
        highlightStars(value);
        
        // Update text description
        const ratingText = document.querySelector('.rating-text');
        if (ratingText) {
            const descriptions = [
                'Non valutato',
                'Pessimo',
                'Mediocre',
                'Buono',
                'Molto buono',
                'Eccellente'
            ];
            ratingText.textContent = descriptions[parseInt(value)] || descriptions[0];
        }
    }
    
    function highlightStars(value) {
        const stars = ratingContainer.querySelectorAll('.rating-star');
        stars.forEach(star => {
            if (star.dataset.value <= value) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
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