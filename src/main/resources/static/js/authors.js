/**
 * SiwBooks - Authors JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeAuthorSearch();
    initializeAuthorSort();
    initializeRelatedBooksToggle();
});

/**
 * Author search functionality
 */
function initializeAuthorSearch() {
    const searchInput = document.getElementById('author-search');
    if (!searchInput) return;
    
    const authorItems = document.querySelectorAll('.author-item, .author-card');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        authorItems.forEach(item => {
            const name = item.querySelector('.author-name')?.textContent.toLowerCase() || '';
            const nationality = item.querySelector('.author-nationality')?.textContent.toLowerCase() || '';
            const content = (name + ' ' + nationality).toLowerCase();
            
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
 * Sort author list by name, nationality, or book count
 */
function initializeAuthorSort() {
    const sortSelect = document.getElementById('author-sort');
    if (!sortSelect) return;
    
    const authorsList = document.querySelector('.authors-list');
    if (!authorsList) return;
    
    sortSelect.addEventListener('change', function() {
        const sortBy = this.value;
        const authorItems = Array.from(authorsList.querySelectorAll('.author-item, .author-card'));
        
        authorItems.sort((a, b) => {
            if (sortBy === 'name') {
                const nameA = a.querySelector('.author-name')?.textContent.toLowerCase() || '';
                const nameB = b.querySelector('.author-name')?.textContent.toLowerCase() || '';
                return nameA.localeCompare(nameB);
            } else if (sortBy === 'name-desc') {
                const nameA = a.querySelector('.author-name')?.textContent.toLowerCase() || '';
                const nameB = b.querySelector('.author-name')?.textContent.toLowerCase() || '';
                return nameB.localeCompare(nameA);
            } else if (sortBy === 'nationality') {
                const natA = a.querySelector('.author-nationality')?.textContent.toLowerCase() || '';
                const natB = b.querySelector('.author-nationality')?.textContent.toLowerCase() || '';
                return natA.localeCompare(natB);
            } else if (sortBy === 'books') {
                const booksA = parseInt(a.querySelector('.book-count')?.textContent || '0');
                const booksB = parseInt(b.querySelector('.book-count')?.textContent || '0');
                return booksB - booksA; // Descending order
            }
            return 0;
        });
        
        // Empty the list and re-append sorted items
        authorsList.innerHTML = '';
        
        // Apply staggered animation
        authorsList.classList.add('stagger-load');
        
        authorItems.forEach(item => {
            authorsList.appendChild(item);
        });
        
        // Force reflow
        void authorsList.offsetWidth;
    });
}

/**
 * Toggle related books section for each author
 */
function initializeRelatedBooksToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-books');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const authorCard = this.closest('.author-card');
            if (!authorCard) return;
            
            const relatedBooks = authorCard.querySelector('.related-books');
            if (!relatedBooks) return;
            
            relatedBooks.classList.toggle('show');
            
            // Update button text
            if (relatedBooks.classList.contains('show')) {
                this.textContent = 'Nascondi libri';
                
                // Add animation to the books
                const bookItems = relatedBooks.querySelectorAll('.book-item');
                bookItems.forEach((item, index) => {
                    item.style.animationDelay = (index * 0.1) + 's';
                    item.classList.add('fade-in');
                });
            } else {
                this.textContent = 'Mostra libri';
            }
        });
    });
}

/**
 * Author image cropper/preview functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    const authorImageInput = document.getElementById('authorImage');
    if (!authorImageInput) return;
    
    authorImageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        
        // Create or get preview container
        let previewContainer = document.querySelector('.author-image-preview');
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.classList.add('author-image-preview');
            this.parentNode.appendChild(previewContainer);
        } else {
            previewContainer.innerHTML = '';
        }
        
        // Create preview image
        const img = document.createElement('img');
        previewContainer.appendChild(img);
        
        // Read and display the file
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
            
            // Add edit controls
            const controls = document.createElement('div');
            controls.classList.add('image-preview-controls');
            controls.innerHTML = `
                <button type="button" class="btn btn-small" id="rotateLeft">↶ Ruota</button>
                <button type="button" class="btn btn-small" id="rotateRight">↷ Ruota</button>
                <button type="button" class="btn btn-small" id="resetImage">Reset</button>
            `;
            previewContainer.appendChild(controls);
            
            // Initialize controls
            let rotation = 0;
            
            document.getElementById('rotateLeft').addEventListener('click', function() {
                rotation -= 90;
                img.style.transform = `rotate(${rotation}deg)`;
            });
            
            document.getElementById('rotateRight').addEventListener('click', function() {
                rotation += 90;
                img.style.transform = `rotate(${rotation}deg)`;
            });
            
            document.getElementById('resetImage').addEventListener('click', function() {
                rotation = 0;
                img.style.transform = '';
            });
        };
        
        reader.readAsDataURL(file);
    });
}); 