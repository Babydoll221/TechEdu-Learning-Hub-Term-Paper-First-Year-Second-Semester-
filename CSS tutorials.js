// css-tutorials.js - Interactive features for CSS Tutorials page

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all demos
    initializeCSSDemos();
    
    // Setup progress tracking
    setupCSSProgress();
    
    // Setup color picker if exists
    setupColorPicker();
    
    // Setup interactive examples
    setupInteractiveExamples();
    
    console.log('CSS Tutorials page loaded!');
});

// ========== APPLY CSS FUNCTION ==========
window.applyCSS = function(editorId, previewId) {
    const editor = document.getElementById(editorId);
    const preview = document.getElementById(previewId);
    
    if (!editor || !preview) return;
    
    const cssCode = editor.value;
    
    // Create or update style element
    let styleEl = document.getElementById('dynamic-css-' + previewId);
    
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'dynamic-css-' + previewId;
        document.head.appendChild(styleEl);
    }
    
    styleEl.textContent = cssCode;
    
    // Show success message
    showNotification('CSS applied successfully!');
};

// ========== INITIALIZE CSS DEMOS ==========
function initializeCSSDemos() {
    
    // Box model calculator
    const calcBox = document.querySelector('.calc-box');
    if (calcBox) {
        calcBox.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#e74c3c';
        });
        
        calcBox.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    }
    
    // Transition timing function demo
    const timingBoxes = document.querySelectorAll('.timing-box');
    timingBoxes.forEach(box => {
        box.addEventListener('click', function() {
            this.style.width = this.style.width === '50%' ? '100%' : '50%';
        });
    });
    
    // Transform demo
    const transformBoxes = document.querySelectorAll('.transform-box');
    transformBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            const originalTransform = this.style.transform;
            this.dataset.originalTransform = originalTransform;
            this.style.transform = originalTransform + ' scale(1.1)';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = this.dataset.originalTransform || '';
        });
    });
}

// ========== SETUP COLOR PICKER ==========
function setupColorPicker() {
    const colorPicker = document.getElementById('colorPicker');
    const colorPreview = document.getElementById('colorPreview');
    
    if (colorPicker && colorPreview) {
        colorPicker.addEventListener('input', function(e) {
            colorPreview.style.background = e.target.value;
            colorPreview.textContent = e.target.value;
        });
    }
}

// ========== SETUP INTERACTIVE EXAMPLES ==========
function setupInteractiveExamples() {
    
    // Flexbox interactive demo
    const flexContainer = document.querySelector('.flex-container-demo');
    if (flexContainer) {
        // Add controls to change flex properties
        const controls = document.createElement('div');
        controls.className = 'flex-controls';
        controls.innerHTML = `
            <select id="flexDirection">
                <option value="row">row</option>
                <option value="column">column</option>
                <option value="row-reverse">row-reverse</option>
                <option value="column-reverse">column-reverse</option>
            </select>
            
            <select id="justifyContent">
                <option value="flex-start">flex-start</option>
                <option value="center">center</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
            </select>
            
            <select id="alignItems">
                <option value="stretch">stretch</option>
                <option value="flex-start">flex-start</option>
                <option value="center">center</option>
                <option value="flex-end">flex-end</option>
            </select>
        `;
        
        flexContainer.parentNode.insertBefore(controls, flexContainer);
        
        // Add event listeners
        document.getElementById('flexDirection')?.addEventListener('change', function(e) {
            flexContainer.style.flexDirection = e.target.value;
        });
        
        document.getElementById('justifyContent')?.addEventListener('change', function(e) {
            flexContainer.style.justifyContent = e.target.value;
        });
        
        document.getElementById('alignItems')?.addEventListener('change', function(e) {
            flexContainer.style.alignItems = e.target.value;
        });
    }
    
    // Grid interactive demo
    const gridDemo = document.querySelector('.grid-demo');
    if (gridDemo) {
        // Add gap control
        const gapControl = document.createElement('input');
        gapControl.type = 'range';
        gapControl.min = '0';
        gapControl.max = '30';
        gapControl.value = '10';
        gapControl.style.width = '100%';
        gapControl.style.margin = '10px 0';
        
        gapControl.addEventListener('input', function(e) {
            gridDemo.style.gap = e.target.value + 'px';
        });
        
        gridDemo.parentNode.insertBefore(gapControl, gridDemo.nextSibling);
    }
}

// ========== CSS PROGRESS TRACKING ==========
function setupCSSProgress() {
    const sections = document.querySelectorAll('.tutorial-section');
    const tocLinks = document.querySelectorAll('.toc-link');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const resetBtn = document.getElementById('resetProgress');
    
    // Load saved progress
    let completedSections = JSON.parse(localStorage.getItem('completedCSSSections')) || [];
    
    function updateProgress() {
        const totalSections = sections.length;
        const completed = completedSections.length;
        const percentage = Math.round((completed / totalSections) * 100);
        
        if (progressFill) {
            progressFill.style.width = percentage + '%';
            progressFill.textContent = percentage + '%';
        }
        
        if (progressText) {
            progressText.textContent = `${completed}/${totalSections} completed`;
        }
        
        // Update TOC with checkmarks
        tocLinks.forEach(link => {
            const sectionId = link.getAttribute('href').substring(1);
            if (completedSections.includes(sectionId)) {
                link.innerHTML = link.innerHTML.replace(/^(✅\s*)?/, '✅ ');
            } else {
                link.innerHTML = link.innerHTML.replace(/^(✅\s*)?/, '');
            }
        });
        
        // Save to localStorage
        localStorage.setItem('completedCSSSections', JSON.stringify(completedSections));
    }
    
    // Mark section as complete when user scrolls past it
    function checkCompletion() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionId = section.getAttribute('id');
            
            if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
                if (!completedSections.includes(sectionId) && sectionId) {
                    completedSections.push(sectionId);
                    updateProgress();
                    
                    // Show notification
                    showNotification(`Section completed: ${section.querySelector('h2')?.textContent}`);
                }
            }
        });
    }
    
    // Reset progress
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            completedSections = [];
            updateProgress();
            showNotification('Progress reset!');
        });
    }
    
    // Highlight active TOC on scroll
    function highlightActiveTOC() {
        let current = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 0) {
                current = section.getAttribute('id');
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    // Smooth scroll for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                
                // Update URL without jump
                history.pushState(null, null, '#' + targetId);
            }
        });
    });
    
    // Initialize
    updateProgress();
    window.addEventListener('scroll', () => {
        checkCompletion();
        highlightActiveTOC();
    });
    
    // Check initial hash
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
}

// ========== QUIZ FUNCTIONALITY ==========
const quizOptions = document.querySelectorAll('.quiz-option');
quizOptions.forEach(option => {
    option.addEventListener('click', function() {
        const parent = this.closest('.section-checkpoint');
        const isCorrect = this.getAttribute('data-correct') === 'true';
        const feedback = parent.querySelector('.quiz-feedback');
        
        // Remove previous classes
        parent.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('correct', 'incorrect');
        });
        
        if (isCorrect) {
            this.classList.add('correct');
            feedback.innerHTML = '✅ Correct! Great job!';
            feedback.style.color = '#27ae60';
            
            // Mark section as completed if quiz passed
            const section = this.closest('.tutorial-section');
            if (section) {
                const sectionId = section.getAttribute('id');
                let completed = JSON.parse(localStorage.getItem('completedCSSSections')) || [];
                if (!completed.includes(sectionId)) {
                    completed.push(sectionId);
                    localStorage.setItem('completedCSSSections', JSON.stringify(completed));
                    
                    // Update progress
                    if (typeof setupCSSProgress === 'function') {
                        setupCSSProgress();
                    }
                }
            }
        } else {
            this.classList.add('incorrect');
            feedback.innerHTML = '❌ Try again! That\'s not correct.';
            feedback.style.color = '#e74c3c';
        }
    });
});

// ========== COPY CODE FUNCTION ==========
window.copyCode = function(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code') || codeBlock.querySelector('pre');
    
    if (code) {
        const textToCopy = code.textContent || code.innerText;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            button.textContent = '✅ Copied!';
            setTimeout(() => {
                button.textContent = '📋 Copy';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            button.textContent = '❌ Failed';
            setTimeout(() => {
                button.textContent = '📋 Copy';
            }, 2000);
        });
    }
};

// ========== SCROLL TO SECTION ==========
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};

// ========== SHOW NOTIFICATION ==========
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'css-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #264de4;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid #f7df1e;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .flex-controls {
        display: flex;
        gap: 10px;
        margin: 20px 0;
        flex-wrap: wrap;
    }
    
    .flex-controls select {
        flex: 1;
        min-width: 150px;
        padding: 8px;
        border: 2px solid #3498db;
        border-radius: 4px;
        background: white;
        font-family: inherit;
    }
    
    .flex-controls select:focus {
        outline: none;
        border-color: #e74c3c;
    }
    
    .css-notification {
        font-family: 'Open Sans', sans-serif;
        font-weight: 600;
    }
`;

document.head.appendChild(style);