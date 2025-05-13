/**
 * SiwBooks - Books JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeBookSearch();
    initializeFilterToggle();
    initializeRatingStars();
    initializeBooksCarousel();
});

/**
 * Book search functionality
 */
function initializeBookSearch() {
    const searchInput = document.getElementById('book-search');
    if (!searchInput) return;
    
    const bookItems = document.querySelectorAll('.book-item, .book-card');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        bookItems.forEach(item => {
            const title = item.querySelector('.book-title')?.textContent.toLowerCase() || '';
            const author = item.querySelector('.book-author')?.textContent.toLowerCase() || '';
            const content = (title + ' ' + author).toLowerCase();
            
            if (searchTerm === '' || content.includes(searchTerm)) {
                item.style.display = '';
                item.classList.add('fade-in');
            } else {
                item.style.display = 'none';
                item.classList.remove('fade-in');
            }
        });
    });
}

/**
 * Toggle filter section
 */
function initializeFilterToggle() {
    const filterToggle = document.getElementById('filter-toggle');
    if (!filterToggle) return;
    
    const filterSection = document.getElementById('filter-section');
    
    filterToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (filterSection) {
            filterSection.classList.toggle('show');
            this.textContent = filterSection.classList.contains('show') ? 'Nascondi filtri' : 'Mostra filtri';
        }
    });
}

/**
 * Interactive rating stars
 */
function initializeRatingStars() {
    // For displaying stars on existing ratings
    document.querySelectorAll('.rating-value').forEach(rating => {
        const ratingValue = parseFloat(rating.textContent || rating.value || '0');
        const starsContainer = document.createElement('div');
        starsContainer.classList.add('stars-container');
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            if (i <= ratingValue) {
                star.classList.add('filled');
            } else if (i - 0.5 <= ratingValue) {
                star.classList.add('half-filled');
            }
            starsContainer.appendChild(star);
        }
        
        rating.parentNode.insertBefore(starsContainer, rating.nextSibling);
    });
    
    // For interactive rating inputs
    document.querySelectorAll('.rating-input').forEach(input => {
        const container = document.createElement('div');
        container.classList.add('stars-input-container');
        
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = input.name;
        hiddenInput.value = input.value || '0';
        
        container.appendChild(hiddenInput);
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            star.dataset.value = i;
            
            if (i <= parseInt(hiddenInput.value)) {
                star.classList.add('filled');
            }
            
            star.addEventListener('click', function() {
                hiddenInput.value = this.dataset.value;
                
                // Update visual state
                container.querySelectorAll('.star').forEach(s => {
                    if (parseInt(s.dataset.value) <= parseInt(hiddenInput.value)) {
                        s.classList.add('filled');
                    } else {
                        s.classList.remove('filled');
                    }
                });
            });
            
            star.addEventListener('mouseover', function() {
                container.querySelectorAll('.star').forEach(s => {
                    if (parseInt(s.dataset.value) <= parseInt(this.dataset.value)) {
                        s.classList.add('hovered');
                    } else {
                        s.classList.remove('hovered');
                    }
                });
            });
            
            star.addEventListener('mouseout', function() {
                container.querySelectorAll('.star').forEach(s => {
                    s.classList.remove('hovered');
                });
            });
            
            container.appendChild(star);
        }
        
        input.parentNode.replaceChild(container, input);
    });
}

/**
 * Simple books carousel for featured books
 */
function initializeBooksCarousel() {
    const carousel = document.querySelector('.books-carousel');
    if (!carousel) return;
    
    const container = carousel.querySelector('.carousel-container');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    if (!container || !prevBtn || !nextBtn) return;
    
    const slideWidth = container.querySelector('.book-card')?.offsetWidth;
    if (!slideWidth) return;
    
    let position = 0;
    const slidesPerView = Math.floor(container.offsetWidth / slideWidth);
    const maxPosition = container.querySelectorAll('.book-card').length - slidesPerView;
    
    function updateButtonStates() {
        prevBtn.disabled = position <= 0;
        nextBtn.disabled = position >= maxPosition;
    }
    
    prevBtn.addEventListener('click', function() {
        if (position > 0) {
            position--;
            container.style.transform = `translateX(-${position * slideWidth}px)`;
            updateButtonStates();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (position < maxPosition) {
            position++;
            container.style.transform = `translateX(-${position * slideWidth}px)`;
            updateButtonStates();
        }
    });
    
    // Initialize button states
    updateButtonStates();
    
    // Update on window resize
    window.addEventListener('resize', function() {
        const newSlidesPerView = Math.floor(container.offsetWidth / slideWidth);
        const newMaxPosition = container.querySelectorAll('.book-card').length - newSlidesPerView;
        
        if (position > newMaxPosition) {
            position = Math.max(0, newMaxPosition);
            container.style.transform = `translateX(-${position * slideWidth}px)`;
        }
        
        updateButtonStates();
    });
} 