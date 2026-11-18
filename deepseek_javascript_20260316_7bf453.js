// Form validation (Chapter 6, p. 26)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// DOM manipulation (Chapter 6, p. 10)
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners and dynamic content
});

// Scroll animations (Chapter 6 extensions)
window.addEventListener('scroll', animateOnScroll);