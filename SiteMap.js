// sitemap.js - Interactive features for Site Map page

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all interactive features
    initializeTreeView();
    initializeSearch();
    initializeStats();
    initializeDownload();
    
    console.log('Site Map page loaded!');
});

// ========== TREE VIEW TOGGLE ==========

window.toggleTreeItem = function(header) {
    const treeItem = header.closest('.tree-item');
    treeItem.classList.toggle('active');
    
    // Update icon rotation
    const icon = header.querySelector('.toggle-icon');
    if (treeItem.classList.contains('active')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
};

function initializeTreeView() {
    // Auto-expand current page section
    const currentItem = document.querySelector('.tree-item.active');
    if (currentItem) {
        currentItem.classList.add('active');
        const icon = currentItem.querySelector('.toggle-icon');
        if (icon) icon.style.transform = 'rotate(180deg)';
    }
    
    // Add click handlers to all tree item headers
    document.querySelectorAll('.tree-item-header').forEach(header => {
        header.addEventListener('click', function(e) {
            // Don't toggle if clicking on a link
            if (e.target.tagName === 'A') return;
            toggleTreeItem(this);
        });
    });
}

// ========== SEARCH FUNCTIONALITY ==========

function initializeSearch() {
    // Add search box to the explorer
    const explorerTree = document.querySelector('.explorer-tree');
    
    if (explorerTree) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'explorer-search';
        searchContainer.innerHTML = `
            <div class="search-wrapper">
                <i class="fas fa-search"></i>
                <input type="text" id="sitemapSearch" placeholder="Search pages..." class="explorer-search-input">
                <button class="search-clear" onclick="clearSearch()" style="display: none;">✕</button>
            </div>
        `;
        
        explorerTree.insertBefore(searchContainer, explorerTree.firstChild);
        
        const searchInput = document.getElementById('sitemapSearch');
        const clearBtn = document.querySelector('.search-clear');
        
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase().trim();
            
            if (term.length > 0) {
                clearBtn.style.display = 'block';
                filterTreeItems(term);
            } else {
                clearBtn.style.display = 'none';
                resetTreeFilter();
            }
        });
    }
}

function filterTreeItems(term) {
    const treeItems = document.querySelectorAll('.tree-item');
    const treeLinks = document.querySelectorAll('.tree-link');
    
    // Expand all items to show results
    treeItems.forEach(item => {
        item.classList.add('active');
        const icon = item.querySelector('.toggle-icon');
        if (icon) icon.style.transform = 'rotate(180deg)';
    });
    
    // Highlight matching links
    treeLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        if (text.includes(term)) {
            link.style.background = '#fff3cd';
            link.style.borderLeft = '4px solid #f39c12';
        } else {
            link.style.background = '';
            link.style.borderLeft = '';
        }
    });
}

function resetTreeFilter() {
    const treeLinks = document.querySelectorAll('.tree-link');
    treeLinks.forEach(link => {
        link.style.background = '';
        link.style.borderLeft = '';
    });
}

window.clearSearch = function() {
    const searchInput = document.getElementById('sitemapSearch');
    const clearBtn = document.querySelector('.search-clear');
    
    if (searchInput) {
        searchInput.value = '';
        resetTreeFilter();
        clearBtn.style.display = 'none';
        
        // Collapse all except current
        const treeItems = document.querySelectorAll('.tree-item');
        treeItems.forEach(item => {
            if (!item.classList.contains('active')) {
                item.classList.remove('active');
                const icon = item.querySelector('.toggle-icon');
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        });
    }
};

// ========== STATS COUNTER ==========

function initializeStats() {
    // Count all pages and sections
    const totalPages = document.querySelectorAll('.tree-link').length;
    const htmlSections = document.querySelectorAll('.html-group .sub-node').length;
    const cssSections = document.querySelectorAll('.css-group .sub-node').length;
    const jsSections = document.querySelectorAll('.js-group .sub-node').length;
    const examples = document.querySelectorAll('.examples-grid .sub-node').length;
    
    // Update stats in explorer info if exists
    const statsList = document.querySelector('.explorer-info ul');
    if (statsList) {
        statsList.innerHTML = `
            <li><i class="fas fa-file"></i> Total Pages: ${totalPages}</li>
            <li><i class="fas fa-hashtag"></i> HTML Sections: ${htmlSections}</li>
            <li><i class="fas fa-hashtag"></i> CSS Sections: ${cssSections}</li>
            <li><i class="fas fa-hashtag"></i> JavaScript Sections: ${jsSections}</li>
            <li><i class="fas fa-code"></i> Code Examples: ${examples}</li>
            <li><i class="fas fa-clock"></i> Last Updated: March 2025</li>
        `;
    }
}

// ========== DOWNLOAD SITEMAP ==========

window.downloadSitemap = function() {
    // Show loading state
    const btn = document.querySelector('.btn-download');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    btn.disabled = true;
    
    // Simulate PDF generation (in real app, would call server or use jsPDF)
    setTimeout(() => {
        // Create a text version of sitemap
        const sitemapText = generateSitemapText();
        
        // Create download link
        const blob = new Blob([sitemapText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TechEdu_SiteMap.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Reset button
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        // Show success message
        showNotification('Site map downloaded!', '#27ae60');
    }, 1500);
};

function generateSitemapText() {
    let text = 'TECHEDU LEARNING HUB - SITE MAP\n';
    text += 'Generated: ' + new Date().toLocaleString() + '\n';
    text += '='.repeat(50) + '\n\n';
    
    text += 'MAIN PAGES:\n';
    text += '- Home (index.html)\n';
    text += '- About (about.html)\n';
    text += '- Contact (contact.html)\n';
    text += '- Site Map (sitemap.html)\n\n';
    
    text += 'HTML TUTORIALS (html-tutorials.html):\n';
    const htmlLinks = document.querySelectorAll('.html-group .sub-node');
    htmlLinks.forEach(link => {
        text += '  - ' + link.textContent.trim() + '\n';
    });
    text += '\n';
    
    text += 'CSS TUTORIALS (css-tutorials.html):\n';
    const cssLinks = document.querySelectorAll('.css-group .sub-node');
    cssLinks.forEach(link => {
        text += '  - ' + link.textContent.trim() + '\n';
    });
    text += '\n';
    
    text += 'JAVASCRIPT TUTORIALS (javascript.html):\n';
    const jsLinks = document.querySelectorAll('.js-group .sub-node');
    jsLinks.forEach(link => {
        text += '  - ' + link.textContent.trim() + '\n';
    });
    text += '\n';
    
    text += 'EXAMPLES GALLERY (examples.html):\n';
    const exampleLinks = document.querySelectorAll('.examples-grid .sub-node');
    exampleLinks.forEach(link => {
        text += '  - ' + link.textContent.trim() + '\n';
    });
    
    return text;
}

// ========== NOTIFICATION ==========

function showNotification(message, color) {
    const notification = document.createElement('div');
    notification.className = 'sitemap-notification';
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
        z-index: 9999;
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

// ========== BREADCRUMB NAVIGATION ==========

// Add click handlers to breadcrumb links
document.querySelectorAll('.breadcrumb-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        // Show navigation message
        showNotification(`Navigating to ${href}...`, '#3498db');
        
        // Simulate navigation (in real app, would actually navigate)
        setTimeout(() => {
            window.location.href = href;
        }, 500);
    });
});

// ========== PRINT SITEMAP ==========

// Add keyboard shortcut (Ctrl+P) to print
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        printSitemap();
    }
});

function printSitemap() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>TechEdu Site Map - Print Version</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 2rem; }
                h1 { color: #2c3e50; }
                h2 { color: #3498db; margin-top: 2rem; }
                ul { list-style-type: none; padding-left: 1rem; }
                li { margin: 0.5rem 0; }
                .section { margin-bottom: 2rem; }
                hr { border: 1px solid #eee; }
                .footer { margin-top: 3rem; font-size: 0.8rem; color: #999; }
            </style>
        </head>
        <body>
            <h1>TechEdu Learning Hub - Site Map</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <hr>
            <div class="section">
                <h2>Main Pages</h2>
                <ul>
                    <li>🏠 Home (index.html)</li>
                    <li>👥 About (about.html)</li>
                    <li>📧 Contact (contact.html)</li>
                    <li>🗺️ Site Map (sitemap.html)</li>
                </ul>
            </div>
            <div class="section">
                <h2>HTML Tutorials</h2>
                <ul>
                    ${Array.from(document.querySelectorAll('.html-group .sub-node')).map(link => 
                        `<li>🔹 ${link.textContent.trim()}</li>`
                    ).join('')}
                </ul>
            </div>
            <div class="section">
                <h2>CSS Tutorials</h2>
                <ul>
                    ${Array.from(document.querySelectorAll('.css-group .sub-node')).map(link => 
                        `<li>🔹 ${link.textContent.trim()}</li>`
                    ).join('')}
                </ul>
            </div>
            <div class="section">
                <h2>JavaScript Tutorials</h2>
                <ul>
                    ${Array.from(document.querySelectorAll('.js-group .sub-node')).map(link => 
                        `<li>🔹 ${link.textContent.trim()}</li>`
                    ).join('')}
                </ul>
            </div>
            <div class="section">
                <h2>Examples Gallery</h2>
                <ul>
                    ${Array.from(document.querySelectorAll('.examples-grid .sub-node')).map(link => 
                        `<li>🔹 ${link.textContent.trim()}</li>`
                    ).join('')}
                </ul>
            </div>
            <div class="footer">
                <p>© 2025 TechEdu Learning Hub - Student Project for APT 1040</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
    
    .explorer-search {
        margin-bottom: 1rem;
        padding: 0.5rem;
        background: white;
        border-radius: 8px;
    }
    
    .search-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.3rem 0.8rem;
        background: #f8f9fa;
        border-radius: 30px;
    }
    
    .search-wrapper i {
        color: #999;
    }
    
    .explorer-search-input {
        flex: 1;
        padding: 0.5rem;
        border: none;
        background: transparent;
        font-size: 0.95rem;
    }
    
    .explorer-search-input:focus {
        outline: none;
    }
    
    .search-clear {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-size: 1rem;
        padding: 0.2rem 0.5rem;
    }
    
    .search-clear:hover {
        color: #e74c3c;
    }
    
    .sitemap-notification {
        font-weight: 600;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    }
`;

document.head.appendChild(style);