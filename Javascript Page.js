// javascript.js - Interactive features for JavaScript Tutorials page

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Initialize all demo elements
    initializeDemos();
    
    // 2. Setup event listeners for interactive demos
    setupEventDemo();
    
    // 3. Setup progress tracking
    setupProgressTracking();
    
    // 4. Setup code highlighting (if needed)
    setupCodeHighlighting();
    
    console.log('JavaScript page loaded!');
});

// ========== RUN CODE FUNCTION ==========
window.runJavaScript = function(editorId, outputId) {
    const editor = document.getElementById(editorId);
    const output = document.getElementById(outputId);
    
    if (!editor || !output) return;
    
    const code = editor.value;
    
    // Clear previous output
    output.innerHTML = '';
    
    // Create a sandbox for output
    const sandbox = document.createElement('div');
    output.appendChild(sandbox);
    
    // Capture console.log
    const originalLog = console.log;
    const logMessages = [];
    
    console.log = function(...args) {
        logMessages.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        originalLog.apply(console, args);
    };
    
    try {
        // Evaluate the code
        const result = eval(code);
        
        // Display logs
        if (logMessages.length > 0) {
            const logDiv = document.createElement('div');
            logDiv.className = 'console-output';
            logDiv.innerHTML = '<strong>Console Output:</strong><br>' + 
                logMessages.map(msg => '> ' + msg).join('<br>');
            sandbox.appendChild(logDiv);
        }
        
        // Display return value if any
        if (result !== undefined) {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result-output';
            resultDiv.innerHTML = '<strong>Return value:</strong> ' + result;
            sandbox.appendChild(resultDiv);
        }
        
        // If no output, show success
        if (logMessages.length === 0 && result === undefined) {
            sandbox.innerHTML = '<p class="success-message">✅ Code executed successfully (no output)</p>';
        }
        
    } catch (error) {
        // Show error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-output';
        errorDiv.innerHTML = '<strong>❌ Error:</strong> ' + error.message;
        sandbox.appendChild(errorDiv);
    } finally {
        // Restore console.log
        console.log = originalLog;
    }
};

// ========== INITIALIZE DEMOS ==========
function initializeDemos() {
    // Grade calculator
    window.calculateGrade = function() {
        const input = document.getElementById('scoreInput');
        const result = document.getElementById('gradeResult');
        
        if (!input || !result) return;
        
        const score = parseInt(input.value);
        
        if (isNaN(score) || score < 0 || score > 100) {
            result.innerHTML = '<p style="color: #e74c3c;">❌ Please enter a valid score between 0 and 100</p>';
            return;
        }
        
        let grade, color;
        if (score >= 90) {
            grade = 'A';
            color = '#27ae60';
        } else if (score >= 80) {
            grade = 'B';
            color = '#2980b9';
        } else if (score >= 70) {
            grade = 'C';
            color = '#f39c12';
        } else if (score >= 60) {
            grade = 'D';
            color = '#e67e22';
        } else {
            grade = 'F';
            color = '#e74c3c';
        }
        
        result.innerHTML = `<p style="color: ${color}; font-size: 2rem; font-weight: 700;">Grade: ${grade}</p>`;
    };
    
    // Temperature converter
    window.convertTemperature = function() {
        const input = document.getElementById('celsiusInput');
        const result = document.getElementById('tempResult');
        
        if (!input || !result) return;
        
        const celsius = parseFloat(input.value);
        
        if (isNaN(celsius)) {
            result.innerHTML = '<p style="color: #e74c3c;">❌ Please enter a valid number</p>';
            return;
        }
        
        const fahrenheit = (celsius * 9/5) + 32;
        result.innerHTML = `
            <p><strong>${celsius}°C</strong> = <strong style="color: #e74c3c;">${fahrenheit.toFixed(1)}°F</strong></p>
            <p style="font-size: 0.9rem; color: #666;">Formula: (°C × 9/5) + 32 = °F</p>
        `;
    };
    
    // DOM Demo functions
    window.changeText = function() {
        const box = document.getElementById('demoBox');
        if (box) {
            box.textContent = 'Text changed by JavaScript!';
            box.style.backgroundColor = '#e74c3c';
        }
    };
    
    window.changeColor = function() {
        const box = document.getElementById('demoBox');
        if (box) {
            const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            box.style.backgroundColor = randomColor;
            box.textContent = 'Color: ' + randomColor;
        }
    };
    
    window.addElement = function() {
        const container = document.getElementById('demoContainer');
        if (container) {
            const newElement = document.createElement('p');
            newElement.textContent = 'New element added! ' + new Date().toLocaleTimeString();
            newElement.style.color = '#f7df1e';
            newElement.style.marginTop = '0.5rem';
            container.appendChild(newElement);
        }
    };
    
    window.resetDemo = function() {
        const box = document.getElementById('demoBox');
        const container = document.getElementById('demoContainer');
        
        if (box) {
            box.textContent = 'This box will change!';
            box.style.backgroundColor = '#3498db';
        }
        
        if (container) {
            container.innerHTML = '<p>New elements will appear here ↓</p>';
        }
    };
    
    // Counter functions
    let counter = 0;
    const counterDisplay = document.getElementById('counterDisplay');
    
    window.incrementCounter = function() {
        counter++;
        if (counterDisplay) counterDisplay.textContent = counter;
    };
    
    window.decrementCounter = function() {
        counter--;
        if (counterDisplay) counterDisplay.textContent = counter;
    };
    
    window.resetCounter = function() {
        counter = 0;
        if (counterDisplay) counterDisplay.textContent = counter;
    };
    
    // Todo functions
    window.addTodo = function() {
        const input = document.getElementById('todoInput');
        const list = document.getElementById('todoList');
        
        if (!input || !list) return;
        
        const text = input.value.trim();
        if (text) {
            const li = document.createElement('li');
            li.innerHTML = text + ' <button onclick="this.parentElement.remove()">✓</button>';
            list.appendChild(li);
            input.value = '';
        }
    };
    
    // Color flipper
    window.flipColor = function() {
        const colorBox = document.getElementById('colorBox');
        const colorCode = document.getElementById('colorCode');
        
        if (!colorBox || !colorCode) return;
        
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#7f8c8d'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        colorBox.style.backgroundColor = randomColor;
        colorCode.textContent = randomColor;
    };
}

// ========== SETUP EVENT DEMO ==========
function setupEventDemo() {
    const demoBtn = document.getElementById('eventDemoBtn');
    const eventOutput = document.getElementById('eventOutput');
    const demoInput = document.getElementById('eventDemoInput');
    const hoverBox = document.getElementById('hoverDemo');
    
    if (demoBtn && eventOutput) {
        // Click event
        demoBtn.addEventListener('click', function() {
            eventOutput.innerHTML = '✅ Button clicked!';
            eventOutput.style.backgroundColor = '#d4edda';
            eventOutput.style.color = '#155724';
        });
        
        demoBtn.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'var(--secondary-color)';
        });
        
        demoBtn.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'var(--primary-color)';
        });
    }
    
    if (demoInput && eventOutput) {
        // Input events
        demoInput.addEventListener('input', function() {
            eventOutput.innerHTML = '✏️ Typing: "' + this.value + '"';
            eventOutput.style.backgroundColor = '#fff3cd';
            eventOutput.style.color = '#856404';
        });
        
        demoInput.addEventListener('focus', function() {
            this.style.borderColor = '#f7df1e';
        });
        
        demoInput.addEventListener('blur', function() {
            this.style.borderColor = '#e0e0e0';
        });
    }
    
    if (hoverBox && eventOutput) {
        hoverBox.addEventListener('mouseover', function() {
            this.innerHTML = 'Mouse is over me!';
            this.style.backgroundColor = '#8e44ad';
            eventOutput.innerHTML = '🖱️ Mouse entered the box';
        });
        
        hoverBox.addEventListener('mouseout', function() {
            this.innerHTML = 'Hover over me!';
            this.style.backgroundColor = '#9b59b6';
            eventOutput.innerHTML = '🖱️ Mouse left the box';
        });
    }
}

// ========== PROGRESS TRACKING ==========
function setupProgressTracking() {
    const sections = document.querySelectorAll('.tutorial-section');
    const tocLinks = document.querySelectorAll('.toc-link');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const resetBtn = document.getElementById('resetProgress');
    
    // Load saved progress
    let completedSections = JSON.parse(localStorage.getItem('completedJSSections')) || [];
    
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
        
        // Update TOC
        tocLinks.forEach(link => {
            const sectionId = link.getAttribute('href').substring(1);
            if (completedSections.includes(sectionId)) {
                link.innerHTML = link.innerHTML.replace(/^(✅\s*)?/, '✅ ');
            }
        });
        
        // Save to localStorage
        localStorage.setItem('completedJSSections', JSON.stringify(completedSections));
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
                }
            }
        });
    }
    
    // Reset progress
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            completedSections = [];
            updateProgress();
            
            // Show notification
            showNotification('Progress reset!');
        });
    }
    
    // Highlight active TOC on scroll
    function highlightActiveTOC() {
        let current = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100) {
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

// ========== CODE HIGHLIGHTING ==========
function setupCodeHighlighting() {
    // This would integrate with a library like Prism.js
    // For now, just basic styling
    document.querySelectorAll('.code-block pre code').forEach(block => {
        // Add basic highlighting classes
        const html = block.innerHTML;
        
        // Simple keyword highlighting
        const keywords = ['function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'return', 'console.log'];
        let highlighted = html;
        
        keywords.forEach(keyword => {
            const regex = new RegExp('\\b' + keyword + '\\b', 'g');
            highlighted = highlighted.replace(regex, '<span class="js-keyword">' + keyword + '</span>');
        });
        
        // String highlighting
        highlighted = highlighted.replace(/'([^']*)'/g, '<span class="js-string">\'$1\'</span>');
        highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="js-string">"$1"</span>');
        
        // Comment highlighting
        highlighted = highlighted.replace(/\/\/(.*)/g, '<span class="js-comment">//$1</span>');
        
        block.innerHTML = highlighted;
    });
}

// ========== HELPER FUNCTIONS ==========
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2c3e50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 4px;
        border-left: 4px solid #f7df1e;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .js-keyword {
        color: #569cd6;
        font-weight: bold;
    }
    
    .js-string {
        color: #ce9178;
    }
    
    .js-comment {
        color: #6a9955;
    }
    
    .console-output {
        background: #1e1e1e;
        color: #d4d4d4;
        padding: 1rem;
        border-radius: 4px;
        font-family: 'Source Code Pro', monospace;
        white-space: pre-wrap;
        margin: 0.5rem 0;
    }
    
    .result-output {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 4px;
        margin: 0.5rem 0;
        border-left: 4px solid #f7df1e;
    }
    
    .error-output {
        background: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 4px;
        margin: 0.5rem 0;
        border-left: 4px solid #e74c3c;
    }
    
    .success-message {
        color: #27ae60;
        padding: 1rem;
    }
    
    .notification {
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
`;

document.head.appendChild(style);

// ========== SCROLL TO SECTION ==========
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};

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