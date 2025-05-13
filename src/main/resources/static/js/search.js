/**
 * SiwBooks - Advanced Search JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeAdvancedSearch();
    initializeSearchHistory();
    initializeSuggestions();
});

/**
 * Advanced search functionality
 */
function initializeAdvancedSearch() {
    const searchForm = document.getElementById('advanced-search-form');
    if (!searchForm) return;
    
    const searchFields = searchForm.querySelectorAll('.search-field');
    const toggleButton = document.getElementById('toggle-advanced-search');
    const advancedSection = document.getElementById('advanced-search-section');
    
    // Toggle advanced search section
    if (toggleButton && advancedSection) {
        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            advancedSection.classList.toggle('show');
            this.textContent = advancedSection.classList.contains('show') ? 
                'Nascondi ricerca avanzata' : 'Mostra ricerca avanzata';
            
            // Animate fields in advanced search
            if (advancedSection.classList.contains('show')) {
                searchFields.forEach((field, index) => {
                    field.style.animationDelay = (index * 0.1) + 's';
                    field.classList.add('fade-in');
                });
            }
        });
    }
    
    // Handle form submission
    searchForm.addEventListener('submit', function(e) {
        // Get all search parameters
        const params = {};
        const formData = new FormData(this);
        
        // Convert form data to object
        for (const [key, value] of formData.entries()) {
            if (value.trim() !== '') {
                params[key] = value.trim();
            }
        }
        
        // Save search in history
        saveSearchToHistory(params);
    });
}

/**
 * Handle search history
 */
function initializeSearchHistory() {
    const historyContainer = document.getElementById('search-history');
    if (!historyContainer) return;
    
    // Load and display search history
    const searchHistory = loadSearchHistory();
    displaySearchHistory(searchHistory, historyContainer);
    
    // Clear history button
    const clearButton = document.getElementById('clear-history');
    if (clearButton) {
        clearButton.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('siwbooks-search-history');
            historyContainer.innerHTML = '<p>Nessuna ricerca recente.</p>';
            this.disabled = true;
        });
    }
}

/**
 * Load search history from localStorage
 */
function loadSearchHistory() {
    const historyJson = localStorage.getItem('siwbooks-search-history');
    return historyJson ? JSON.parse(historyJson) : [];
}

/**
 * Save search to history
 */
function saveSearchToHistory(searchParams) {
    if (Object.keys(searchParams).length === 0) return;
    
    let searchHistory = loadSearchHistory();
    
    // Create search entry
    const searchEntry = {
        params: searchParams,
        timestamp: new Date().toISOString()
    };
    
    // Add to history (max 10 items)
    searchHistory.unshift(searchEntry);
    if (searchHistory.length > 10) {
        searchHistory = searchHistory.slice(0, 10);
    }
    
    // Save back to localStorage
    localStorage.setItem('siwbooks-search-history', JSON.stringify(searchHistory));
}

/**
 * Display search history
 */
function displaySearchHistory(history, container) {
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    if (history.length === 0) {
        container.innerHTML = '<p>Nessuna ricerca recente.</p>';
        return;
    }
    
    // Create history list
    const list = document.createElement('ul');
    list.classList.add('search-history-list');
    
    history.forEach((entry, index) => {
        const item = document.createElement('li');
        item.classList.add('search-history-item');
        
        // Create search description
        let description = '';
        if (entry.params.query) {
            description += `"${entry.params.query}"`;
        }
        if (entry.params.author) {
            description += ` di ${entry.params.author}`;
        }
        if (entry.params.category) {
            description += ` in ${entry.params.category}`;
        }
        if (description === '') {
            description = 'Ricerca avanzata';
        }
        
        // Format date
        const date = new Date(entry.timestamp);
        const formattedDate = date.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Create item content
        item.innerHTML = `
            <div class="search-item-content">
                <span class="search-description">${description}</span>
                <span class="search-date">${formattedDate}</span>
            </div>
            <div class="search-item-actions">
                <button class="search-repeat-btn" data-index="${index}">Ripeti</button>
                <button class="search-remove-btn" data-index="${index}">✕</button>
            </div>
        `;
        
        list.appendChild(item);
    });
    
    container.appendChild(list);
    
    // Add event listeners
    const repeatButtons = container.querySelectorAll('.search-repeat-btn');
    repeatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = this.dataset.index;
            const entry = history[index];
            
            // Fill form with search parameters
            const form = document.getElementById('advanced-search-form');
            if (form) {
                // Reset form first
                form.reset();
                
                // Fill in values
                Object.keys(entry.params).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = entry.params[key];
                    }
                });
                
                // Submit form
                form.submit();
            }
        });
    });
    
    const removeButtons = container.querySelectorAll('.search-remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = this.dataset.index;
            
            // Remove from history
            history.splice(index, 1);
            localStorage.setItem('siwbooks-search-history', JSON.stringify(history));
            
            // Update display
            displaySearchHistory(history, container);
            
            // Disable clear button if history is empty
            if (history.length === 0) {
                const clearButton = document.getElementById('clear-history');
                if (clearButton) {
                    clearButton.disabled = true;
                }
            }
        });
    });
}

/**
 * Initialize search suggestions
 */
function initializeSuggestions() {
    const searchInput = document.getElementById('search-query');
    if (!searchInput) return;
    
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.classList.add('search-suggestions');
    searchInput.parentNode.appendChild(suggestionsContainer);
    
    // Add event listeners
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.trim();
        if (query.length < 2) {
            suggestionsContainer.innerHTML = '';
            return;
        }
        
        // For demonstration, we'll use dummy data
        // In a real application, this would be an AJAX call to your server
        const dummySuggestions = [
            'Il nome della rosa',
            'Harry Potter',
            'Il signore degli anelli',
            'La divina commedia',
            'Iliade',
            'Odissea',
            'Il piccolo principe',
            '1984',
            'Orgoglio e pregiudizio',
            'La fattoria degli animali'
        ];
        
        // Filter suggestions based on query
        const filteredSuggestions = dummySuggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        
        // Display suggestions
        displaySuggestions(filteredSuggestions, suggestionsContainer, query);
    }, 300));
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!suggestionsContainer.contains(e.target) && e.target !== searchInput) {
            suggestionsContainer.innerHTML = '';
        }
    });
}

/**
 * Display search suggestions
 */
function displaySuggestions(suggestions, container, query) {
    container.innerHTML = '';
    
    if (suggestions.length === 0) return;
    
    const list = document.createElement('ul');
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('li');
        
        // Highlight matching part
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        const highlighted = suggestion.replace(regex, '<strong>$1</strong>');
        
        item.innerHTML = highlighted;
        item.addEventListener('click', function() {
            const searchInput = document.getElementById('search-query');
            if (searchInput) {
                searchInput.value = suggestion;
                container.innerHTML = '';
            }
        });
        
        list.appendChild(item);
    });
    
    container.appendChild(list);
}

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Escape regular expression special characters
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
} 