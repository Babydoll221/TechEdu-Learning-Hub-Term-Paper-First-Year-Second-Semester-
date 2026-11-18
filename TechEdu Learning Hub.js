// Main JavaScript file for TechEdu Learning Hub

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Newsletter form handling
    const newsletterForm = document.getElementById('newsletterForm');
    const formMessage = document.getElementById('formMessage');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim();
            
            // Simple email validation
            if (validateEmail(email)) {
                // Success message
                formMessage.textContent = 'Thank you for subscribing! Check your email for confirmation.';
                formMessage.style.color = '#2ecc71';
                emailInput.value = ''; // Clear input
                
                // In a real project, you'd send this to a server
                console.log('Newsletter subscription:', email);
            } else {
                // Error message
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.style.color = '#e74c3c';
            }
        });
    }
    
    // Email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // 2. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    
    // 3. Active navigation highlighting based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    function highlightNavigation() {
        let scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const sectionId = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    if (sections.length > 0) {
        window.addEventListener('scroll', highlightNavigation);
    }
    
    // 4. Simple animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .code-display');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .code-display');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Trigger once on load
    
    // 5. Current year in footer copyright
    const yearElement = document.querySelector('.copyright p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
    }
    
    // 6. Tooltip for table example (educational)
    const tableCells = document.querySelectorAll('.demo-table td');
    tableCells.forEach(cell => {
        if (cell.getAttribute('colspan')) {
            cell.setAttribute('title', 'This cell uses colspan="2" to span two columns');
        }
    });
    
    console.log('TechEdu Learning Hub: JavaScript loaded successfully!');
});

// 7. Responsive navigation toggle (for mobile)
function createMobileNav() {
    const nav = document.querySelector('nav ul');
    const header = document.querySelector('header');
    
    if (window.innerWidth <= 768 && !document.querySelector('.menu-toggle')) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '☰ Menu';
        menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('show');
            this.innerHTML = nav.classList.contains('show') ? '✕ Close' : '☰ Menu';
        });
        
        header.insertBefore(menuToggle, nav);
        
        // Add styles for mobile menu
        nav.style.display = 'none';
        nav.classList.add('mobile-nav');
        
        menuToggle.style.cssText = `
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            margin: 0.5rem 0;
        `;
        
        // Add style for when nav is shown
        const style = document.createElement('style');
        style.textContent = `
            nav ul.show {
                display: flex !important;
                flex-direction: column;
                width: 100%;
            }
            nav ul.mobile-nav {
                display: none;
            }
        `;
        document.head.appendChild(style);
        
    } else if (window.innerWidth > 768) {
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.remove();
        }
        nav.style.display = 'flex';
        nav.classList.remove('mobile-nav', 'show');
    }
}

// Run on load and resize
window.addEventListener('load', createMobileNav);
window.addEventListener('resize', createMobileNav);