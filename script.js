// Simplified Web Template Script
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initThemeToggle();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initPricingToggle();
  initFormHandling();
  initNavbarScroll();
});

// Theme Toggle Functionality
function initThemeToggle() {
  const toggle = document.getElementById('dark-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  if (!toggle || !themeIcon) return;

  // Load saved theme or use system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  applyTheme(initialTheme);

  // Toggle theme on click
  toggle.addEventListener('click', function() {
    const isDark = document.body.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  function applyTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    
    // Update icon
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// Mobile Menu
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function() {
    const isOpen = menu.classList.contains('active');
    
    menu.classList.toggle('active', !isOpen);
    toggle.classList.toggle('active', !isOpen);
    
    // Animate hamburger icon
    const spans = toggle.querySelectorAll('span');
    spans.forEach((span, index) => {
      if (!isOpen) {
        if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
        if (index === 1) span.style.opacity = '0';
        if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        span.style.transform = '';
        span.style.opacity = '';
      }
    });
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  const navLinks = menu.querySelectorAll('a');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      menu.classList.remove('active');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reset hamburger icon
      const spans = toggle.querySelectorAll('span');
      spans.forEach(function(span) {
        span.style.transform = '';
        span.style.opacity = '';
      });
    });
  });
}

// Smooth Scroll
function initSmoothScroll() {
  // Handle anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Hero button scroll to features
  const heroBtn = document.querySelector('.hero .btn-primary');
  if (heroBtn) {
    heroBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
}

// Scroll Animations
function initScrollAnimations() {
  // Simple intersection observer for animations
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Add staggered animation for children
          const children = entry.target.querySelectorAll('.feature-card, .testimonial-card, .pricing-card');
          children.forEach(function(child, index) {
            setTimeout(function() {
              child.classList.add('visible');
            }, index * 100);
          });
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements
    const animatedElements = document.querySelectorAll('.feature-card, .showcase-item, .testimonial-card, .pricing-card, .contact-item, .section-header');
    animatedElements.forEach(function(el) {
      el.classList.add('hidden');
      observer.observe(el);
    });
  }
}

// Navbar scroll effect
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function updateNavbar() {
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);
    
    // Add background blur effect
    if (scrolled) {
      navbar.style.background = document.body.classList.contains('dark') 
        ? 'rgba(0, 0, 0, 0.95)' 
        : 'rgba(255, 255, 255, 0.95)';
      navbar.style.backdropFilter = 'blur(20px)';
    } else {
      navbar.style.background = document.body.classList.contains('dark') 
        ? 'rgba(0, 0, 0, 0.8)' 
        : 'rgba(255, 255, 255, 0.8)';
    }
  }

  // Throttled scroll handler
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial call
  updateNavbar();
}

// Pricing Toggle
function initPricingToggle() {
  const toggle = document.getElementById('pricing-toggle');
  if (!toggle) return;

  toggle.addEventListener('change', function() {
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const yearlyPrices = document.querySelectorAll('.yearly-price');
    
    if (toggle.checked) {
      // Show yearly prices
      monthlyPrices.forEach(function(el) {
        el.style.display = 'none';
      });
      yearlyPrices.forEach(function(el) {
        el.style.display = 'inline';
      });
    } else {
      // Show monthly prices
      monthlyPrices.forEach(function(el) {
        el.style.display = 'inline';
      });
      yearlyPrices.forEach(function(el) {
        el.style.display = 'none';
      });
    }
  });
}

// Form Handling
function initFormHandling() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    // Let the form submit naturally to Formspree
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Re-enable button after a delay (in case of errors)
    setTimeout(function() {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 5000);
  });

  // Simple form validation
  const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
  inputs.forEach(function(input) {
    input.addEventListener('blur', function() {
      validateField(input);
    });
    
    input.addEventListener('input', function() {
      clearFieldError(input);
    });
  });

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    if (field.required && !value) {
      isValid = false;
      message = 'This field is required';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
      isValid = false;
      message = 'Please enter a valid email address';
    }

    if (!isValid) {
      showFieldError(field, message);
    } else {
      clearFieldError(field);
    }

    return isValid;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#FF3B30';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#FF3B30';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.5rem';
    
    field.parentNode.appendChild(errorDiv);
  }

  function clearFieldError(field) {
    field.style.borderColor = '';
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
  }
}

// Add some hover effects for showcase items
document.addEventListener('DOMContentLoaded', function() {
  const showcaseItems = document.querySelectorAll('.showcase-item');
  showcaseItems.forEach(function(item) {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
});

// Simple notification function
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  `;
  
  // Set background color based on type
  const colors = {
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#007AFF'
  };
  
  notification.style.background = colors[type] || colors.info;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(function() {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove
  setTimeout(function() {
    notification.style.transform = 'translateX(100%)';
    setTimeout(function() {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Handle potential errors gracefully
window.addEventListener('error', function(e) {
  console.log('Error caught:', e.message);
});

// Performance optimization: only run animations when page is visible
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Page is hidden, pause animations
    document.body.style.animationPlayState = 'paused';
  } else {
    // Page is visible, resume animations
    document.body.style.animationPlayState = 'running';
  }
});

console.log('Web Template: Initialized successfully!');