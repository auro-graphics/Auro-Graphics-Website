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
  async initVisitorCounter() {
    const counterElement = document.getElementById('visitorCount');
    if (!counterElement) return;

    try {
      const response = await fetch('/.netlify/functions/counter');
      const data = await response.json();

      if (data.success && data.count !== undefined) {
        counterElement.textContent = `Visitors: ${data.count}`;
        counterElement.style.opacity = '1';
      } else {
        counterElement.textContent = 'Visitors: (No data)';
        counterElement.style.opacity = '0.7';
      }
    } catch (error) {
      console.error('Counter error:', error);
      counterElement.textContent = 'Visitors: Error';
      counterElement.style.opacity = '0.5';
    }
  }

  // Contact Form Handler
  initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    // Replace the form action with our custom handler
    contactForm.removeAttribute('action');
    contactForm.removeAttribute('method');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const contactData = {
          name: formData.get('name'),
          email: formData.get('contact'),
          phone: formData.get('contact'),
          message: formData.get('message'),
          service: 'General Inquiry'
        };

        const response = await fetch('/.netlify/functions/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactData)
        });

        const result = await response.json();

        if (result.success) {
          this.showNotification('Thank you! Your message has been sent successfully.', 'success');
          contactForm.reset();
        } else {
          this.showNotification(result.error || 'Failed to send message. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Contact form error:', error);
        this.showNotification('Network error. Please check your connection and try again.', 'error');
      } finally {
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