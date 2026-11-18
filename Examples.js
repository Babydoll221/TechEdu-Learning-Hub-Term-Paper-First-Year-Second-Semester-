// examples.js - Interactive features for Examples Gallery page

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all features
    initializeStats();
    initializeSearch();
    initializeFilters();
    initializeBookmarks();
    initializePlayground();
    initializeCopyButtons();
    
    console.log('Examples page loaded!');
});

// ========== STATS COUNTER ==========
function initializeStats() {
    const totalExamples = document.querySelectorAll('.example-card').length;
    const htmlExamples = document.querySelectorAll('[data-category="html"]').length;
    const cssExamples = document.querySelectorAll('[data-category="css"]').length;
    const jsExamples = document.querySelectorAll('[data-category="javascript"]').length;
    
    document.getElementById('totalExamples').textContent = totalExamples;
    document.getElementById('htmlExamples').textContent = htmlExamples;
    document.getElementById('cssExamples').textContent = cssExamples;
    document.getElementById('jsExamples').textContent = jsExamples;
    
    // Animate stats
    animateValue('totalExamples', 0, totalExamples, 1000);
    animateValue('htmlExamples', 0, htmlExamples, 1000);
    animateValue('cssExamples', 0, cssExamples, 1000);
    animateValue('jsExamples', 0, jsExamples, 1000);
}

function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = range / (duration / 10);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 10);
}

// ========== SEARCH FUNCTIONALITY ==========
function initializeSearch() {
    const searchInput = document.getElementById('exampleSearch');
    const exampleCards = document.querySelectorAll('.example-card');
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        exampleCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const tags = card.querySelector('.example-tag').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || tags.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide sections based on visible cards
        updateSectionVisibility();
    });
}

// ========== FILTER BUTTONS ==========
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const exampleSections = document.querySelectorAll('.example-section');
    const exampleCards = document.querySelectorAll('.example-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            if (filter === 'all') {
                // Show all cards
                exampleCards.forEach(card => {
                    card.style.display = 'block';
                });
                
                // Show all sections
                exampleSections.forEach(section => {
                    section.style.display = 'block';
                });
            } else {
                // Hide all sections first
                exampleSections.forEach(section => {
                    section.style.display = 'none';
                });
                
                // Show selected section
                document.getElementById(filter + '-examples').style.display = 'block';
                
                // Filter cards within that section
                exampleCards.forEach(card => {
                    if (card.dataset.category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });
}

// ========== BOOKMARKS ==========
function initializeBookmarks() {
    const exampleCards = document.querySelectorAll('.example-card');
    const bookmarksContainer = document.getElementById('bookmarksContainer');
    
    // Load saved bookmarks
    let bookmarks = JSON.parse(localStorage.getItem('bookmarkedExamples')) || [];
    
    // Mark bookmarked cards
    bookmarks.forEach(id => {
        const card = document.querySelector(`[data-id="${id}"]`);
        if (card) {
            card.classList.add('bookmarked');
        }
    });
    
    // Add click handler for bookmarking
    exampleCards.forEach(card => {
        // Add unique ID if not present
        if (!card.dataset.id) {
            card.dataset.id = 'example-' + Math.random().toString(36).substr(2, 9);
        }
        
        card.addEventListener('click', function(e) {
            // Check if click was on the star area (top-right corner)
            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            if (clickX > rect.width - 40 && clickY < 40) {
                toggleBookmark(this);
            }
        });
    });
    
    function toggleBookmark(card) {
        const id = card.dataset.id;
        const title = card.querySelector('h3').textContent;
        const tag = card.querySelector('.example-tag').textContent;
        
        if (bookmarks.includes(id)) {
            // Remove bookmark
            bookmarks = bookmarks.filter(bookmarkId => bookmarkId !== id);
            card.classList.remove('bookmarked');
            showNotification('Removed from bookmarks', '#e74c3c');
        } else {
            // Add bookmark
            bookmarks.push(id);
            card.classList.add('bookmarked');
            showNotification('Added to bookmarks! ⭐', '#27ae60');
            
            // Add to bookmarks container
            addBookmarkToContainer({ id, title, tag });
        }
        
        // Save to localStorage
        localStorage.setItem('bookmarkedExamples', JSON.stringify(bookmarks));
        updateBookmarksContainer();
    }
    
    function addBookmarkToContainer(bookmark) {
        const bookmarkItem = document.createElement('div');
        bookmarkItem.className = 'bookmark-item';
        bookmarkItem.dataset.id = bookmark.id;
        bookmarkItem.innerHTML = `
            <span>${bookmark.title}</span>
            <span class="bookmark-tag">${bookmark.tag}</span>
            <button onclick="removeBookmark('${bookmark.id}')" class="remove-bookmark">✕</button>
        `;
        
        const emptyMsg = bookmarksContainer.querySelector('.empty-bookmarks');
        if (emptyMsg) {
            emptyMsg.remove();
        }
        
        bookmarksContainer.appendChild(bookmarkItem);
    }
    
    function updateBookmarksContainer() {
        if (bookmarks.length === 0) {
            bookmarksContainer.innerHTML = '<p class="empty-bookmarks">No bookmarks yet. Click the ★ on any example to save it.</p>';
        } else {
            bookmarksContainer.innerHTML = '';
            bookmarks.forEach(id => {
                const card = document.querySelector(`[data-id="${id}"]`);
                if (card) {
                    const title = card.querySelector('h3').textContent;
                    const tag = card.querySelector('.example-tag').textContent;
                    addBookmarkToContainer({ id, title, tag });
                }
            });
        }
    }
    
    // Initialize bookmarks container
    updateBookmarksContainer();
}

// ========== REMOVE BOOKMARK ==========
window.removeBookmark = function(id) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarkedExamples')) || [];
    bookmarks = bookmarks.filter(bookmarkId => bookmarkId !== id);
    localStorage.setItem('bookmarkedExamples', JSON.stringify(bookmarks));
    
    // Remove class from card
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) {
        card.classList.remove('bookmarked');
    }
    
    // Reload page to refresh bookmarks
    location.reload();
};

// ========== CODE PLAYGROUND ==========
function initializePlayground() {
    const htmlPanel = document.getElementById('html-panel');
    const cssPanel = document.getElementById('css-panel');
    const jsPanel = document.getElementById('js-panel');
    const playgroundFrame = document.getElementById('playgroundFrame');
    
    // Load saved code
    loadSavedCode();
    
    // Run initial code
    runPlayground();
}

window.switchPlayground = function(lang) {
    document.querySelectorAll('.playground-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.querySelectorAll('.editor-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    document.getElementById(lang + '-panel').classList.add('active');
};

window.runPlayground = function() {
    const html = document.getElementById('htmlCode').value;
    const css = document.getElementById('cssCode').value;
    const js = document.getElementById('jsCode').value;
    
    const frame = document.getElementById('playgroundFrame');
    const doc = frame.contentDocument || frame.contentWindow.document;
    
    const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>${js}<\/script>
        </body>
        </html>
    `;
    
    doc.open();
    doc.write(content);
    doc.close();
    
    // Save to localStorage
    localStorage.setItem('playgroundHTML', html);
    localStorage.setItem('playgroundCSS', css);
    localStorage.setItem('playgroundJS', js);
    
    showNotification('Code executed!', '#27ae60');
};

window.resetPlayground = function() {
    document.getElementById('htmlCode').value = `<div class="playground-box">
    <h3>Hello from Playground!</h3>
    <p>Edit this code to see changes</p>
    <button onclick="alert('Hi!')">Click Me</button>
</div>`;
    
    document.getElementById('cssCode').value = `.playground-box {
    background: linear-gradient(135deg, #3498db, #e74c3c);
    color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}`;
    
    document.getElementById('jsCode').value = `// Write your JavaScript here
console.log('Playground ready!');

// Example function
function greet() {
    alert('Hello from JavaScript!');
}`;
    
    runPlayground();
    showNotification('Playground reset!', '#3498db');
};

function loadSavedCode() {
    const savedHTML = localStorage.getItem('playgroundHTML');
    const savedCSS = localStorage.getItem('playgroundCSS');
    const savedJS = localStorage.getItem('playgroundJS');
    
    if (savedHTML) document.getElementById('htmlCode').value = savedHTML;
    if (savedCSS) document.getElementById('cssCode').value = savedCSS;
    if (savedJS) document.getElementById('jsCode').value = savedJS;
}

// ========== COPY CODE ==========
function initializeCopyButtons() {
    // Already handled by global copyCode function
}

window.copyCode = function(button) {
    const codeBlock = button.closest('.example-code');
    const code = codeBlock.querySelector('code');
    
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

// ========== FULL PREVIEW ==========
window.showFullPreview = function(exampleId) {
    // Create modal with full preview
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const preview = document.getElementById(`preview-${exampleId}`).cloneNode(true);
    preview.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
    `;
    
    modal.appendChild(preview);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
    
    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
};

// ========== EDIT EXAMPLE ==========
window.editExample = function(exampleId) {
    // Switch to playground with this example loaded
    document.querySelector('[data-filter="all"]').click();
    
    // Scroll to playground
    document.querySelector('.code-playground').scrollIntoView({ behavior: 'smooth' });
    
    showNotification('Edit in playground below!', '#f39c12');
};

// ========== UPDATE SECTION VISIBILITY ==========
function updateSectionVisibility() {
    const sections = document.querySelectorAll('.example-section');
    
    sections.forEach(section => {
        const visibleCards = Array.from(section.querySelectorAll('.example-card'))
            .filter(card => card.style.display !== 'none');
        
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

// ========== SHOW NOTIFICATION ==========
function showNotification(message, color) {
    const notification = document.createElement('div');
    notification.className = 'example-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${color || '#3498db'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
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
    
    .bookmark-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.8rem;
        background: #f8f9fa;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        margin-bottom: 0.5rem;
    }
    
    .bookmark-item:last-child {
        margin-bottom: 0;
    }
    
    .bookmark-tag {
        background: #3498db;
        color: white;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.7rem;
        margin-left: auto;
    }
    
    .remove-bookmark {
        background: #e74c3c;
        color: white;
        border: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .remove-bookmark:hover {
        background: #c0392b;
    }
    
    .example-notification {
        font-weight: 600;
    }
`;

document.head.appendChild(style);