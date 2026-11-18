// contact.js - Contact page functionality including AI Chatbot

// ========== FORM HANDLING ==========

// Form submit handler
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return false;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.opacity = '0';
    btnLoader.style.display = 'inline-block';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Hide loading
        btnText.style.opacity = '1';
        btnLoader.style.display = 'none';
        
        // Show success message
        showFormStatus('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Log to console (for demo)
        console.log('Form submitted:', getFormData());
        
        // Add to chatbot conversation
        addBotMessage('Thanks for contacting us! We\'ve received your message and will respond within 24-48 hours. Meanwhile, feel free to ask me any questions!');
    }, 2000);
    
    return false;
}

// Form validation
function validateForm() {
    let isValid = true;
    
    // Clear all previous errors
    clearErrors();
    
    // Validate first name
    const firstName = document.getElementById('firstName');
    if (firstName.value.trim() === '') {
        showError('firstName', 'First name is required');
        isValid = false;
    } else if (firstName.value.trim().length < 2) {
        showError('firstName', 'First name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate last name
    const lastName = document.getElementById('lastName');
    if (lastName.value.trim() === '') {
        showError('lastName', 'Last name is required');
        isValid = false;
    } else if (lastName.value.trim().length < 2) {
        showError('lastName', 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === '') {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone (optional but must be valid if provided)
    const phone = document.getElementById('phone');
    if (phone.value.trim() !== '') {
        const phoneRegex = /^[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(phone.value.trim())) {
            showError('phone', 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    // Validate subject
    const subject = document.getElementById('subject');
    if (subject.value === '') {
        showError('subject', 'Please select a subject');
        isValid = false;
    }
    
    // Validate message
    const message = document.getElementById('message');
    if (message.value.trim() === '') {
        showError('message', 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showError('message', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    // Validate privacy policy
    const privacy = document.getElementById('privacy');
    if (!privacy.checked) {
        showError('privacy', 'You must agree to the Privacy Policy');
        isValid = false;
    }
    
    return isValid;
}

// Show error message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('error');
    }
    
    if (errorDiv) {
        errorDiv.textContent = message;
    }
}

// Clear all errors
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
}

// Show form status message
function showFormStatus(message, type) {
    const statusDiv = document.getElementById('formStatus');
    statusDiv.textContent = message;
    statusDiv.className = 'form-status ' + type;
    statusDiv.style.display = 'block';
    
    // Scroll to status
    statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Hide after 5 seconds
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}

// Get form data as object
function getFormData() {
    return {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        newsletter: document.getElementById('newsletter').checked,
        timestamp: new Date().toISOString()
    };
}

// ========== FAQ TOGGLE ==========

function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    faqItem.classList.toggle('active');
}

// ========== AI CHATBOT ==========

// Chatbot state
let isChatbotOpen = false;
let isMinimized = false;
let conversationHistory = [
    {
        role: 'bot',
        message: 'Hi there! 👋 I\'m the TechEdu AI assistant. How can I help you today?',
        timestamp: new Date()
    }
];

// Toggle chatbot open/close
function toggleChatbot() {
    if (isChatbotOpen) {
        closeChatbot();
    } else {
        openChatbot();
    }
}

// Open chatbot
function openChatbot() {
    const window = document.getElementById('chatbotWindow');
    const toggle = document.getElementById('chatbotToggle');
    
    window.style.display = 'flex';
    toggle.style.display = 'none';
    isChatbotOpen = true;
    isMinimized = false;
    
    // Focus input
    setTimeout(() => {
        document.getElementById('chatbotInput').focus();
    }, 300);
    
    // Log event
    console.log('Chatbot opened');
}

// Close chatbot
function closeChatbot() {
    const window = document.getElementById('chatbotWindow');
    const toggle = document.getElementById('chatbotToggle');
    
    window.style.display = 'none';
    toggle.style.display = 'flex';
    isChatbotOpen = false;
    isMinimized = false;
    
    console.log('Chatbot closed');
}

// Minimize chatbot
function minimizeChatbot() {
    const window = document.getElementById('chatbotWindow');
    isMinimized = !isMinimized;
    
    if (isMinimized) {
        window.classList.add('minimized');
    } else {
        window.classList.remove('minimized');
    }
}

// Send message
function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        addBotMessage(response);
    }, 1000 + Math.random() * 1000);
}

// Handle key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Add user message
function addUserMessage(message) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    
    const time = new Date();
    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <p>${escapeHTML(message)}</p>
            <p class="message-time">${timeString}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Add to history
    conversationHistory.push({
        role: 'user',
        message: message,
        timestamp: time
    });
}

// Add bot message
function addBotMessage(message) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    
    const time = new Date();
    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Process message for links, etc.
    const processedMessage = processBotMessage(message);
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p>${processedMessage}</p>
            <p class="message-time">${timeString}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Add to history
    conversationHistory.push({
        role: 'bot',
        message: message,
        timestamp: time
    });
}

// Send suggested message
function sendSuggestedMessage(message) {
    addUserMessage(message);
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        addBotMessage(response);
    }, 800);
}

// Show typing indicator
function showTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'flex';
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'none';
}

// Scroll messages to bottom
function scrollToBottom() {
    const messagesContainer = document.getElementById('chatbotMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Process bot message (add formatting, links, etc.)
function processBotMessage(message) {
    // Convert URLs to links
    message = message.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    
    // Convert line breaks
    message = message.replace(/\n/g, '<br>');
    
    return message;
}

// ========== AI RESPONSE GENERATOR ==========

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Simple pattern matching for demo purposes
    // In a real app, this would call an actual AI API
    
    // Greetings
    if (message.match(/\b(hi|hello|hey|greetings)\b/i)) {
        return getRandomResponse([
            "Hello! How can I assist you today?",
            "Hi there! What can I help you with?",
            "Hey! Welcome to TechEdu. How can I help?",
            "Greetings! I'm here to answer your questions."
        ]);
    }
    
    // Courses
    else if (message.match(/\b(courses?|classes?|learn|study|topics?)\b/i)) {
        return "We offer courses in:\n\n📚 **HTML5** - Structure your web pages\n🎨 **CSS3** - Style and animations\n⚡ **JavaScript** - Interactivity and logic\n📱 **Responsive Design** - Mobile-friendly sites\n\nWhich one interests you?";
    }
    
    // HTML questions
    else if (message.match(/\b(html|hypertext)\b/i)) {
        return getRandomResponse([
            "HTML is the foundation of web development! Our HTML tutorials cover everything from basic tags to semantic HTML5. Check out our Examples page for live demos!",
            "We have comprehensive HTML tutorials including tables, forms, and semantic elements. Is there something specific you'd like to learn?",
            "HTML5 is awesome! You can structure your pages with header, nav, main, and footer elements. Want to see an example?"
        ]);
    }
    
    // CSS questions
    else if (message.match(/\b(css|style|styling|flexbox|grid|animation)\b/i)) {
        return getRandomResponse([
            "CSS makes websites beautiful! We cover everything from colors and fonts to flexbox, grid, and animations. What CSS topic are you interested in?",
            "CSS3 is powerful! You can create amazing effects with transitions, transforms, and keyframe animations. Want to learn about a specific feature?",
            "We have extensive CSS tutorials including selectors, box model, flexbox, grid, and responsive design. Check out our examples!"
        ]);
    }
    
    // JavaScript questions
    else if (message.match(/\b(javascript|js|script|programming)\b/i)) {
        return getRandomResponse([
            "JavaScript brings websites to life! Our JS tutorials cover variables, functions, DOM manipulation, events, and more. What would you like to learn?",
            "JavaScript is essential for interactive websites. We have examples of counters, todo lists, form validation, and more. Check them out!",
            "Want to make your site interactive? JavaScript is the answer! We have beginner-friendly tutorials for all skill levels."
        ]);
    }
    
    // Contact/support questions
    else if (message.match(/\b(contact|support|help|assistance|talk|speak)\b/i)) {
        return "You can reach our support team at:\n\n📧 Email: support@techeduhub.com\n📞 Phone: +1 (555) 123-4567\n💬 Or use the contact form on this page!\n\nOur team typically responds within 24 hours.";
    }
    
    // Hours/availability
    else if (message.match(/\b(hours?|open|available|when|time)\b/i)) {
        return "Our support hours are:\n\nMonday-Friday: 9am - 6pm EST\nSaturday: 10am - 2pm EST\nSunday: Closed\n\nBut I'm here 24/7 to help with basic questions!";
    }
    
    // Pricing
    else if (message.match(/\b(price|cost|free|paid|pricing)\b/i)) {
        return "Good news! All our tutorials and examples are **completely free**! We're student-run and believe in accessible education. Some advanced features may require registration, but basic access is always free.";
    }
    
    // Account/registration
    else if (message.match(/\b(account|sign up|register|login|profile)\b/i)) {
        return "Creating an account is free and easy! It lets you save your progress, bookmark examples, and access additional features. Click the 'Sign Up' button in the header to get started!";
    }
    
    // Feedback/complaints
    else if (message.match(/\b(feedback|complaint|suggestion|improve)\b/i)) {
        return "We value your feedback! Please use the contact form on this page to share your thoughts. We're always looking to improve!";
    }
    
    // Thanks/gratitude
    else if (message.match(/\b(thank|thanks|appreciate|grateful)\b/i)) {
        return getRandomResponse([
            "You're welcome! Happy to help! 😊",
            "My pleasure! Let me know if you need anything else.",
            "Glad I could help! Is there anything else you'd like to know?",
            "You're most welcome! Keep learning and coding! 🚀"
        ]);
    }
    
    // Goodbye
    else if (message.match(/\b(bye|goodbye|see you|talk later)\b/i)) {
        return getRandomResponse([
            "Goodbye! Feel free to come back anytime.",
            "Take care! Happy coding! 👨‍💻",
            "See you later! Remember, I'm always here to help.",
            "Bye! Have a great day learning! 🌟"
        ]);
    }
    
    // Default response
    else {
        return getRandomResponse([
            "That's interesting! I'm not sure I understand completely. Could you rephrase that or ask about our courses, tutorials, or support?",
            "I'm still learning! Can you ask me about HTML, CSS, JavaScript, courses, or how to contact support?",
            "Great question! For specific technical details, you might want to check our tutorials section. What topic are you interested in?",
            "I'm here to help with general questions about TechEdu. For specific coding problems, check out our examples page!"
        ]);
    }
}

// Get random response from array
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize form
    initializeForm();
    
    // Initialize chatbot
    initializeChatbot();
    
    // Add welcome message if first time
    if (!localStorage.getItem('chatbotInitialized')) {
        setTimeout(() => {
            addBotMessage("👋 I see you're on our contact page! Feel free to ask me any questions about our courses, tutorials, or how to get help.");
            localStorage.setItem('chatbotInitialized', 'true');
        }, 2000);
    }
    
    console.log('Contact page loaded!');
});

function initializeForm() {
    // Add input event listeners for real-time validation
    document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea').forEach(field => {
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorDiv = document.getElementById(this.id + 'Error');
                if (errorDiv) errorDiv.textContent = '';
            }
        });
    });
}

function initializeChatbot() {
    // Load conversation history from localStorage (optional)
    const savedHistory = localStorage.getItem('chatbotHistory');
    if (savedHistory) {
        try {
            conversationHistory = JSON.parse(savedHistory);
            // Re-render last few messages
            const recentMessages = conversationHistory.slice(-5);
            const messagesContainer = document.getElementById('chatbotMessages');
            
            // Clear existing (keep only welcome message)
            messagesContainer.innerHTML = '';
            
            // Add back welcome message
            addBotMessage("Hi there! 👋 I'm the TechEdu AI assistant. How can I help you today?");
        } catch (e) {
            console.log('No saved history');
        }
    }
    
    // Make chatbot draggable (optional)
    makeChatbotDraggable();
}

// Make chatbot draggable
function makeChatbotDraggable() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotHeader = document.querySelector('.chatbot-header');
    
    let isDragging = false;
    let offsetX, offsetY;
    
    chatbotHeader.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
    
    function startDragging(e) {
        isDragging = true;
        offsetX = e.clientX - chatbotWindow.offsetLeft;
        offsetY = e.clientY - chatbotWindow.offsetTop;
        chatbotWindow.style.transition = 'none';
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            chatbotWindow.style.left = (e.clientX - offsetX) + 'px';
            chatbotWindow.style.top = (e.clientY - offsetY) + 'px';
            chatbotWindow.style.right = 'auto';
            chatbotWindow.style.bottom = 'auto';
        }
    }
    
    function stopDragging() {
        isDragging = false;
        chatbotWindow.style.transition = '';
    }
}

// Auto-save conversation to localStorage (optional)
setInterval(() => {
    if (conversationHistory.length > 0) {
        localStorage.setItem('chatbotHistory', JSON.stringify(conversationHistory.slice(-20)));
    }
}, 30000);

// Export functions for global use
window.toggleChatbot = toggleChatbot;
window.openChatbot = openChatbot;
window.closeChatbot = closeChatbot;
window.minimizeChatbot = minimizeChatbot;
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.sendSuggestedMessage = sendSuggestedMessage;
window.handleFormSubmit = handleFormSubmit;
window.toggleFAQ = toggleFAQ;