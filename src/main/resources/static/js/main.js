/**
 * SiwBooks - Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeButtons();
    initializeFormValidation();
    initializeImagePreviews();
    initializeDropdowns();
    
    // Add fade-in animation to page content
    const mainContent = document.querySelector('body > div:not(.header)');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
});

/**
 * Navigation enhancements
 */
function initializeNavigation() {
    // Add active class to current navigation item
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath) {
            // Remove any existing active class first
            link.classList.remove('active');
            
            // Check for exact match or if current path starts with link path (but only for full segments)
            if (currentPath === linkPath || 
                (linkPath !== '/' && currentPath.startsWith(linkPath + '/')) ||
                (linkPath !== '/' && currentPath === linkPath)) {
                link.classList.add('active');
            }
        }
        
        // Add hover animation
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Button enhancements
 */
function initializeButtons() {
    // Add click effects to all buttons
    const buttons = document.querySelectorAll('.btn, button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add a ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = (event.clientX - rect.left) + 'px';
            ripple.style.top = (event.clientY - rect.top) + 'px';
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Initialize delete confirmation dialogs
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            if (!confirm('Sei sicuro di voler eliminare questo elemento? Questa azione non può essere annullata.')) {
                event.preventDefault();
            }
        });
    });
}

/**
 * Form validation
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Real-time validation feedback
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateInput(this);
                }
            });
        });
        
        form.addEventListener('submit', function(event) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                event.preventDefault();
            }
        });
    });
}

/**
 * Validate a single input field
 */
function validateInput(input) {
    const isValid = input.checkValidity();
    
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        
        // Remove any existing error message
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        
        // Add error message if not exists
        let errorMessage = input.parentNode.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            input.parentNode.appendChild(errorMessage);
        }
        
        errorMessage.textContent = input.validationMessage;
    }
    
    return isValid;
}

/**
 * Image preview functionality
 */
function initializeImagePreviews() {
    const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    
    imageInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            // Create or find the preview container
            let previewContainer = this.parentNode.querySelector('.image-preview');
            if (!previewContainer) {
                previewContainer = document.createElement('div');
                previewContainer.classList.add('image-preview');
                this.parentNode.appendChild(previewContainer);
            } else {
                previewContainer.innerHTML = '';
            }
            
            // Create image preview
            const img = document.createElement('img');
            img.file = file;
            previewContainer.appendChild(img);
            
            const reader = new FileReader();
            reader.onload = (function(aImg) { 
                return function(e) { 
                    aImg.src = e.target.result; 
                }; 
            })(img);
            
            reader.readAsDataURL(file);
        });
    });
}

/**
 * Initialize dropdown menus
 */
function initializeDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            event.preventDefault();
            
            const dropdown = this.nextElementSibling;
            if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                dropdown.classList.toggle('show');
                
                // Close when clicking outside
                document.addEventListener('click', function closeDropdown(e) {
                    if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
                        dropdown.classList.remove('show');
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            }
        });
    });
} 