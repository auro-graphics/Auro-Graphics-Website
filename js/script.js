// ✅ CLEAN & FIXED VERSION of script.js for AURO Graphics Website

document.addEventListener('DOMContentLoaded', () => {
  // HAMBURGER TOGGLE
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const progressBar = document.querySelector('.home-progress-bar-container');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    progressBar.classList.toggle('hide-progress', navMenu.classList.contains('active'));
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    progressBar.classList.remove('hide-progress');
  }));

  // TYPEWRITER
  const typewriterHeading = document.querySelector('.typewriter-heading');
  const texts = ["Crafting Visual Stories.", "Designing Brand Identities.", "Building Digital Experiences."];
  let textIndex = 0, charIndex = 0;
  function type() {
    if (charIndex < texts[textIndex].length) {
      typewriterHeading.textContent += texts[textIndex].charAt(charIndex++);
      setTimeout(type, 100);
    } else setTimeout(erase, 2000);
  }
  function erase() {
    if (charIndex > 0) {
      typewriterHeading.textContent = texts[textIndex].substring(0, --charIndex);
      setTimeout(erase, 50);
    } else {
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(type, 500);
    }
  }
  type();

  // SLIDER
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.slider-dots');
  let currentSlide = 0, slideInterval;

  function createDots() {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => {
        currentSlide = i;
        updateSlide();
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });
  }
  function updateDots() {
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  }
  function updateSlide() {
    slides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev', 'next');
      if (i === currentSlide) slide.classList.add('active');
      else if (i === (currentSlide - 1 + slides.length) % slides.length) slide.classList.add('prev');
      else if (i === (currentSlide + 1) % slides.length) slide.classList.add('next');
    });
    updateDots();
  }
  function nextSlide() { currentSlide = (currentSlide + 1) % slides.length; updateSlide(); }
  function prevSlide() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; updateSlide(); }
  function startInterval() { slideInterval = setInterval(nextSlide, 4000); }
  function resetInterval() { clearInterval(slideInterval); startInterval(); }

  createDots();
  updateSlide();
  startInterval();

  document.querySelector('.next-btn')?.addEventListener('click', () => { nextSlide(); resetInterval(); });
  document.querySelector('.prev-btn')?.addEventListener('click', () => { prevSlide(); resetInterval(); });

  // SERVICES SECTION
  const servicesData = {
          'digital-invitations': {
              name: 'Digital Invitation Cards',
              items: [
      {
        icon: '<i class="fa-solid fa-ring"></i>',
        name: 'Wedding Invitations',
        description: 'Elegant invites to make your special day unforgettable.'
      },
      {
        icon: '<i class="fa-solid fa-heart"></i>',
        name: 'Engagement Invitations',
        description: 'Stylish digital invites to celebrate love and commitment.'
      },
      {
        icon: '<i class="fa-solid fa-calendar-days"></i>',
        name: 'Save-the-Date Cards',
        description: 'Beautiful reminders for your important day.'
      },
      {
        icon: '<i class="fa-solid fa-cake-candles"></i>',
        name: 'Birthday Party & Anniversary',
        description: 'Vibrant designs for all celebrations.'
      },
      {
        icon: '<i class="fa-solid fa-users"></i>',
        name: 'Community Gathering',
        description: 'Graphics that bring people together.'
      },
      {
        icon: '<i class="fa-solid fa-store"></i>',
        name: 'Grand Opening',
        description: 'Catchy invites for your new launch.'
      }
              ]
          },
          'business-branding': {
              name: 'Business Branding',
              items: [
      {
        icon: '<i class="fa-solid fa-lightbulb"></i>',
        name: 'Logo Design',
        description: 'Creative and professional logo designs.'
      },
      {
        icon: '<i class="fa-solid fa-address-card"></i>',
        name: 'Business Cards',
        description: 'Professional cards to leave a lasting impression.'
      },
      {
        icon: '<i class="fa-solid fa-share-nodes"></i>',
        name: 'Social Media Graphics',
        description: 'Attractive posts that align with your brand.'
      },
      {
        icon: '<i class="fa-solid fa-box"></i>',
        name: 'Packaging Design',
        description: 'Visually compelling and brand-aligned packaging.'
      }
              ]
          },
          'promotional-graphics': {
              name: 'Promotional Graphics',
              items: [
      {
        icon: '<i class="fa-solid fa-file-image"></i>',
        name: 'Posters, Flyers & Banners',
        description: 'Bold designs for maximum visibility.'
      },
      {
        icon: '<i class="fa-brands fa-instagram"></i>',
        name: 'Social Media Creatives',
        description: 'Daily content that captures attention.'
      },
      {
        icon: '<i class="fa-solid fa-clapperboard"></i>',
        name: 'Reels & Ad Graphics',
        description: 'Scroll-stopping visuals for your marketing campaigns.'
      }
    ]
          }
      };
  const serviceContainer = document.querySelector('.service-items-container');
  document.querySelectorAll('.service-categories button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.service-categories button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.serviceCategory;
      const items = servicesData[category]?.items || [];
      serviceContainer.innerHTML = items.map(item => `
        <div class="service-item">
          <div class="icon">${item.icon}</div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>`).join('');
    });
  });
  document.querySelector('.service-categories button.active')?.click();

  // PORTFOLIO SECTION
  const outerFilters = document.querySelectorAll('.outer-filters .filter-btn');
  const innerFiltersMap = {
    'digital-invitations': document.getElementById('digital-invitations-subcats'),
    'business-branding': document.getElementById('business-branding-subcats'),
    'promotional-graphics': document.getElementById('promotional-graphics-subcats')
  };
  let portfolioItems = [];

  const portfolioGrid = document.getElementById('portfolio-grid');
  const popup = document.getElementById('fullscreen-popup');
  const popupImg = document.getElementById('popup-img');
  const popupTitle = document.getElementById('popup-title');
  const popupSubtitle = document.getElementById('popup-subtitle');
  const popupDescription = document.getElementById('popup-description');

  fetch('portfolio.json')
    .then(res => res.json())
    .then(data => {
      portfolioItems = data;
      renderPortfolioGrid('all');
    });

  function renderPortfolioGrid(filter, subFilter = null) {
    let items = [...portfolioItems];
    if (filter !== 'all') items = items.filter(i => i.outerCategory === filter);
    if (subFilter) items = items.filter(i => i.innerCategory === subFilter);

    portfolioGrid.innerHTML = items.map((item, i) => `
      <div class="portfolio-item" data-index="${i}">
        <img src="${item.src}" alt="${item.title}" loading="lazy">
        <div class="gradient-overlay"></div>
        <div class="gradient-text">
          <div class="title">${item.title}</div>
          <div class="subtitle">${item.subtitle}</div>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.portfolio-item').forEach(el => {
      el.addEventListener('click', () => {
        const index = el.dataset.index;
        const item = items[index];
    
        popupImg.src = item.src;
        popupTitle.textContent = item.title;
        popupSubtitle.textContent = item.subtitle;
    
        const descriptionText = document.getElementById('description-text');
        const toggleBtn = document.getElementById('toggle-desc');
    
        descriptionText.textContent = item.description;
        descriptionText.classList.remove('expanded');
        toggleBtn.textContent = 'Read more';
    
                // Reset content
        descriptionText.textContent = item.description;
        descriptionText.classList.remove('expanded');

        // Check if height exceeds max height (150px)
        toggleBtn.style.display = 'none'; // Hide by default

        requestAnimationFrame(() => {
          const needsToggle = descriptionText.scrollHeight > 150;
          toggleBtn.style.display = needsToggle ? 'inline-block' : 'none';
        
          // Add or remove gradient control class
          descriptionText.classList.toggle('has-gradient', needsToggle);
        });
        

        // Toggle logic
        toggleBtn.textContent = 'Read more';
        toggleBtn.onclick = () => {
          const expanded = descriptionText.classList.toggle('expanded');
          toggleBtn.textContent = expanded ? 'Show less' : 'Read more';
        };

    
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });
    
    
  }

  outerFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      outerFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      Object.values(innerFiltersMap).forEach(div => div.style.display = 'none');
      if (filter !== 'all' && innerFiltersMap[filter]) innerFiltersMap[filter].style.display = 'flex';
      renderPortfolioGrid(filter);
    });
  });

  Object.entries(innerFiltersMap).forEach(([cat, container]) => {
    container.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sub = btn.dataset.filter;
        renderPortfolioGrid(cat, sub);
      });
    });
  });

  document.querySelector('.popup-close').addEventListener('click', () => {
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
});
