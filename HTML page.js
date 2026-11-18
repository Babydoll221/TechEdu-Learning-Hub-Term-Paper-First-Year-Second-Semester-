// tutorials.js - Interactive features for HTML Tutorials page

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Progress Tracking
    const sections = document.querySelectorAll('.tutorial-section');
    const tocLinks = document.querySelectorAll('.toc-link');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const resetBtn = document.getElementById('resetProgress');
    
    // Track completed sections
    let completedSections = JSON.parse(localStorage.getItem('completedHTMLSections')) || [];
    
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
        
        // Update checkmarks in TOC
        tocLinks.forEach(link => {
            const sectionId = link.getAttribute('href').substring(1);
            if (completedSections.includes(sectionId)) {
                link.innerHTML = link.innerHTML.replace(/^(✅\s*)?/, '✅ ');
            } else {
                link.innerHTML = link.innerHTML.replace(/^(✅\s*)?/, '');
            }
        });
        
        // Save to localStorage
        localStorage.setItem('completedHTMLSections', JSON.stringify(completedSections));
    }
    
    // Mark section as complete when user scrolls past it
    function checkCompletedSections() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionBottom = section.getBoundingClientRect().bottom;
            const sectionId = section.getAttribute('id');
            
            // If section is visible (or passed) and not already completed
            if (sectionTop < window.innerHeight - 100 && sectionBottom > 0) {
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
            
            // Show confirmation
            const message = document.createElement('div');
            message.className = 'note';
            message.textContent = 'Progress has been reset!';
            message.style.position = 'fixed';
            message.style.top = '20px';
            message.style.right = '20px';
            message.style.zIndex = '1000';
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 3000);
        });
    }
    
    // 2. Active TOC highlighting on scroll
    function highlightActiveTOC() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === current) {
                link.classList.add('active');
            }
        });
    }
    
    // 3. Smooth scroll for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without page jump
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
    
    // 4. Quiz functionality
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.closest('.section-checkpoint');
            const isCorrect = this.getAttribute('data-correct') === 'true';
            const feedback = parent.querySelector('.quiz-feedback');
            
            // Remove previous correct/incorrect classes
            parent.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('correct', 'incorrect');
            });
            
            if (isCorrect) {
                this.classList.add('correct');
                feedback.innerHTML = '✅ Correct! Great job!';
                feedback.style.color = '#28a745';
            } else {
                this.classList.add('incorrect');
                feedback.innerHTML = '❌ Try again! That\'s not correct.';
                feedback.style.color = '#dc3545';
            }
        });
    });
    
    // 5. Code runner functionality
    window.runCode = function(editorId, outputId) {
        const editor = document.getElementById(editorId);
        const output = document.getElementById(outputId);
        
        if (editor && output) {
            const code = editor.value;
            
            // Wrap in full HTML document if needed
            let fullCode = code;
            if (!code.includes('<!DOCTYPE html>')) {
                fullCode = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
${code}
</body>
</html>`;
            }
            
            // Create iframe for sandboxed output
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '200px';
            iframe.style.border = 'none';
            iframe.style.background = 'white';
            
            output.innerHTML = '';
            output.appendChild(iframe);
            
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(fullCode);
            iframeDoc.close();
        }
    };
    
    // 6. Copy code button functionality
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
    
    // 7. Answer checker for exercises
    window.showAnswer = function(exerciseNum) {
        const exercise = document.querySelector(`.exercise-card:nth-child(${exerciseNum})`);
        if (exercise) {
            const hint = exercise.querySelector('details');
            if (hint) {
                hint.open = !hint.open;
            } else {
                // Create hint if doesn't exist
                const newDetails = document.createElement('details');
                newDetails.innerHTML = `
                    <summary>Sample Solution</summary>
                    <div class="code-block">
                        <pre><code>Check the HTML Tables lecture for the exact solution with rowspan and colspan!</code></pre>
                    </div>
                `;
                exercise.appendChild(newDetails);
            }
        }
    };
    
    // 8. Section navigation
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    // Initialize next/prev buttons
    const sectionsArray = Array.from(sections);
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');
    
    if (prevBtn && nextBtn && sectionsArray.length > 0) {
        function updateNavButtons() {
            const currentSection = sectionsArray.findIndex(section => {
                const rect = section.getBoundingClientRect();
                return rect.top >= 0 && rect.top < window.innerHeight / 2;
            });
            
            if (currentSection > 0) {
                prevBtn.disabled = false;
                prevBtn.onclick = () => sectionsArray[currentSection - 1].scrollIntoView({ behavior: 'smooth' });
            } else {
                prevBtn.disabled = true;
            }
            
            if (currentSection < sectionsArray.length - 1 && currentSection !== -1) {
                nextBtn.disabled = false;
                nextBtn.onclick = () => sectionsArray[currentSection + 1].scrollIntoView({ behavior: 'smooth' });
            } else {
                nextBtn.disabled = true;
            }
        }
        
        window.addEventListener('scroll', updateNavButtons);
        updateNavButtons();
    }
    
    // 9. Check initial section on page load with hash
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
    
    // Initialize
    updateProgress();
    window.addEventListener('scroll', () => {
        checkCompletedSections();
        highlightActiveTOC();
    });
    
    // Run any pre-filled code editors
    document.querySelectorAll('.btn-run').forEach(btn => {
        btn.click();
    });
    
    console.log('Tutorials page JavaScript loaded successfully!');
});