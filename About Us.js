// about.js - Interactive features for About Us page

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Animated counter for statistics
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const targetText = stat.textContent;
            // Extract number from text (e.g., "500+" -> 500)
            const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
            const suffix = targetText.replace(/[0-9]/g, '');
            
            if (targetNumber && !isNaN(targetNumber)) {
                let currentNumber = 0;
                const increment = Math.ceil(targetNumber / 50); // Divide animation into steps
                
                const updateCounter = () => {
                    currentNumber += increment;
                    if (currentNumber <= targetNumber) {
                        stat.textContent = currentNumber + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = targetNumber + suffix; // Ensure final number is exact
                    }
                };
                
                // Start animation when element is in viewport
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            updateCounter();
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(stat);
            }
        });
    }
    
    animateStats();
    
    // 2. Testimonial slider
    const slider = {
        track: document.querySelector('.testimonial-track'),
        cards: document.querySelectorAll('.testimonial-card'),
        prevBtn: document.querySelector('.slider-btn.prev'),
        nextBtn: document.querySelector('.slider-btn.next'),
        dots: document.querySelectorAll('.dot'),
        currentIndex: 0,
        
        init() {
            if (!this.track || !this.cards.length) return;
            
            // Set up event listeners
            this.prevBtn?.addEventListener('click', () => this.slide('prev'));
            this.nextBtn?.addEventListener('click', () => this.slide('next'));
            
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
            
            // Auto-advance slides every 5 seconds
            setInterval(() => {
                if (this.currentIndex < this.cards.length - 1) {
                    this.slide('next');
                } else {
                    this.goToSlide(0);
                }
            }, 5000);
        },
        
        slide(direction) {
            if (direction === 'prev' && this.currentIndex > 0) {
                this.currentIndex--;
            } else if (direction === 'next' && this.currentIndex < this.cards.length - 1) {
                this.currentIndex++;
            }
            this.updateSlider();
        },
        
        goToSlide(index) {
            this.currentIndex = index;
            this.updateSlider();
        },
        
        updateSlider() {
            // Update track position
            const slideWidth = this.cards[0].offsetWidth;
            this.track.style.transform = `translateX(-${this.currentIndex * slideWidth}px)`;
            
            // Update active states
            this.cards.forEach((card, i) => {
                card.classList.toggle('active', i === this.currentIndex);
            });
            
            this.dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
            });
            
            // Update button states
            if (this.prevBtn) {
                this.prevBtn.disabled = this.currentIndex === 0;
            }
            if (this.nextBtn) {
                this.nextBtn.disabled = this.currentIndex === this.cards.length - 1;
            }
        }
    };
    
    slider.init();
    
    // 3. Hover effect for team cards - add tooltips
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const role = this.querySelector('.member-role').textContent;
            const name = this.querySelector('h3').textContent;
            
            // Create temporary tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'hover-tooltip';
            tooltip.textContent = `Click to learn more about ${name}`;
            tooltip.style.cssText = `
                position: absolute;
                background-color: var(--secondary-color);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                font-size: 0.85rem;
                pointer-events: none;
                z-index: 1000;
                transform: translateY(-100%);
                margin-top: -10px;
            `;
            
            this.style.position = 'relative';
            this.appendChild(tooltip);
            
            // Position tooltip
            const rect = this.getBoundingClientRect();
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
            
            // Remove tooltip on mouse leave
            this.addEventListener('mouseleave', function() {
                const tip = this.querySelector('.hover-tooltip');
                if (tip) tip.remove();
            }, { once: true });
        });
    });
    
    // 4. Add smooth reveal for cards on scroll
    const revealElements = document.querySelectorAll('.card, .team-card, .testimonial-card');
    
    function revealOnScroll() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state for reveal elements
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
    });
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load
    
    // 5. Add interactive table highlighting
    const tableRows = document.querySelectorAll('.comparison-table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f0f7ff';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
        
        // Add click to highlight feature
        row.addEventListener('click', function() {
            // Remove highlight from all rows
            tableRows.forEach(r => r.classList.remove('highlighted-row'));
            // Add highlight to clicked row
            this.classList.add('highlighted-row');
        });
    });
    
    // Add CSS for highlighted rows
    const style = document.createElement('style');
    style.textContent = `
        .highlighted-row {
            background-color: #e3f2fd !important;
            border-left: 4px solid var(--primary-color);
        }
        .hover-tooltip {
            animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-50%) translateY(-80%); }
            to { opacity: 1; transform: translateX(-50%) translateY(-100%); }
        }
    `;
    document.head.appendChild(style);
    
    console.log('About page JavaScript loaded successfully!');
});