// Dynamic Features for Auro Graphics Website
// Handles visitor counter, contact form, and portfolio data

class DynamicFeatures {
  constructor() {
    this.init();
  }

  init() {
    this.initVisitorCounter();
    this.initContactForm();
    this.initPortfolioLoader();
    this.initScrollProgress();
  }

  // Visitor Counter
 // Visitor Counter
async initVisitorCounter() {
  const countSpan = document.getElementById('totalVisitors');
  const todaySpan = document.getElementById('todayVisitors');
  if (!countSpan || !todaySpan) return;

  try {
    const res = await fetch('/.netlify/functions/counter');
    const data = await res.json();

    if (data.success) {
      animateCount(countSpan, data.totalVisitors);  // Changed from data.count
      animateCount(todaySpan, data.todayVisitors);  // Changed from data.todayCount
    }
  } catch (err) {
    console.error('Visitor count error:', err);
    countSpan.textContent = '--';
    todaySpan.textContent = '--';
  }
}

  // Contact Form Handler
  initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Validation: Email format
      const email = document.getElementById('emailField').value.trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        this.showNotification('Please enter a valid email address (e.g. user@example.com).', 'error');
        return;
      }
      // Validation: Phone (optional but must be digits if entered)
      const phone = document.getElementById('phoneField').value.trim();
      if (phone !== '' && !/^\d{10}$/.test(phone)) {
        this.showNotification('Please enter a valid 10-digit phone number.', 'error');
        return;
      }

      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        // Get form data
        const formData = new FormData(contactForm);

        // Show sending notification
        this.showNotification('Sending your message...', 'info');

        const response = await fetch(contactForm.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });

        if (response.ok) {
          this.showNotification('Thank you! Your message has been sent successfully.', 'success');
          contactForm.reset();

          setTimeout(() => {
            this.showNotification('We will get back to you soon!', 'success');
          }, 1500);
        } else {
          this.showNotification('Failed to send message. Try again later.', 'error');
        }
      } catch (error) {
        console.warn('FormSubmit redirect blocked (normal for cross-origin)', error);

        // Show success anyway (if it likely succeeded)
        this.showNotification('Your message has been sent successfully!', 'success');
        contactForm.reset();
      }
      finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Portfolio Data Loader
  async initPortfolioLoader() {
    // This can be used to load portfolio data dynamically
    // For now, we'll keep the existing static loading
    // but you can uncomment this to use the API endpoint

    /*
    try {
      const response = await fetch('/.netlify/functions/portfolio');
      const data = await response.json();
      
      if (data.success) {
        // Update portfolio with dynamic data
        this.updatePortfolio(data.data);
      }
    } catch (error) {
      console.error('Portfolio loading error:', error);
    }
    */
  }

  // Scroll Progress Bar
  initScrollProgress() {
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;

      const progressBar = document.querySelector('.home-progress-bar-fill');
      const progressBot = document.querySelector('.progress-bot');

      if (progressBar) progressBar.style.width = scrollPercent + '%';
      if (progressBot) progressBot.style.left = scrollPercent + '%';
    });
  }

  // Notification System
  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
          <span class="notification-message">${message}</span>
          <button class="notification-close">&times;</button>
        </div>
      `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
      `;

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);

    // Add to page
    document.body.appendChild(notification);

    // Add CSS animations if not already present
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
          .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            margin-left: 10px;
            float: right;
          }
          .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        `;
      document.head.appendChild(style);
    }
  }

  // Update Portfolio (for dynamic loading)
  updatePortfolio(data) {
    // This method can be used to dynamically update portfolio
    // when using the API endpoint
    console.log('Portfolio data loaded:', data);
  }
}

// Initialize dynamic features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DynamicFeatures();
});

// Helper: Animate progress bar
function animateProgressBar(bar, percent, duration = 1200) {
  bar.style.width = '0';
  setTimeout(() => {
    bar.style.transition = `width ${duration}ms cubic-bezier(.4,2,.3,1)`;
    bar.style.width = percent + '%';
  }, 100); // slight delay for effect
}

// Helper: Animate numbers from 0 to target
function animateCount(element, target, duration = 1200) {
  let start = 0;
  let startTime = null;
  function animateStep(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    element.textContent = '+' + Math.floor(progress * (target - start) + start);
    if (progress < 1) {
      requestAnimationFrame(animateStep);
    } else {
      element.textContent = '+' + target;
    }
  }
  requestAnimationFrame(animateStep);
}


// Intersection Observer to trigger animation on scroll
function setupStatsCardAnimation() {
  const section = document.getElementById('stats-section');
  if (!section) return;
  let animated = false;
  const observer = new window.IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      loadAndAnimateStats();
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(section);
}

// Main function to load and animate counts
async function loadAndAnimateStats() {
  let totalVisitors = 0, todayVisitors = 0;
  try {
    const res = await fetch('/.netlify/functions/counter');
    const data = await res.json();
    
    if (data.success) {
      totalVisitors = data.totalVisitors || 0; // Total visitors
      todayVisitors = data.todayVisitors || 0; // Today's visitors
    }
  } catch (error) {
    console.error('Error loading stats:', error);
    totalVisitors = 0; 
    todayVisitors = 0;
  }
  
  const clients = 120; // Static happy clients count

  // Animate numbers
  animateCount(document.getElementById('totalVisitors'), totalVisitors);
  animateCount(document.getElementById('todayVisitors'), todayVisitors);
  animateCount(document.getElementById('statClientsCount'), clients);
}

// On DOM ready, setup observer
document.addEventListener('DOMContentLoaded', setupStatsCardAnimation);

// Simple function to load and display visitor counts
async function loadVisitorCounts() {
  try {
    console.log('Loading visitor counts...'); // Debug log
    
    const response = await fetch('/.netlify/functions/counter');
    console.log('Response status:', response.status); // Debug log
    
    const data = await response.json();
    console.log('Response data:', data); // Debug log
    
    if (data.success) {
      // Update the HTML elements
      const totalElement = document.getElementById('totalVisitors');
      const todayElement = document.getElementById('todayVisitors');
      
      if (totalElement && todayElement) {
        totalElement.textContent = data.totalVisitors;
        todayElement.textContent = data.todayVisitors;
        console.log('Updated HTML - Total:', data.totalVisitors, 'Today:', data.todayVisitors); // Debug log
      } else {
        console.error('HTML elements not found');
      }
    } else {
      console.error('Failed to load visitor counts:', data.error);
    }
  } catch (error) {
    console.error('Error loading visitor counts:', error);
  }
}

// Load counts when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, calling loadVisitorCounts'); // Debug log
  loadVisitorCounts();
});

// Also load counts when page becomes visible (in case of caching)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    console.log('Page became visible, reloading counts'); // Debug log
    loadVisitorCounts();
  }
});