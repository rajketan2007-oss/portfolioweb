/* ==========================================================================
   PRITAM DUTTA — EDITORIAL PORTFOLIO SCRIPTS
   - Sticky header & active navigation highlighting
   - Mobile navigation drawer
   - Scroll-triggered reveal animations (restrained motion)
   - Interactive Lightbox for gallery photos
   - Email copy-to-clipboard utility
   - Contact form validation and dispatch simulation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. STICKY HEADER & SCROLL BEHAVIOR
  const siteHeader = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // 2. ACTIVE SECTION INDICATOR (IntersectionObserver)
  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach((section) => navObserver.observe(section));

  // 3. MOBILE MENU TOGGLE & ACCESSIBILITY
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileDrawer.classList.toggle('open');
    mobileDrawer.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  };

  const closeMobileMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !menuToggle.contains(e.target) && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // 4. RESTRAINED SCROLL REVEAL ANIMATIONS
  const revealElements = document.querySelectorAll(
    '.hero-editorial-grid, .about-grid, .business-card, .timeline-item, .consultancy-item, .torn-page-card, .press-mentions-bar, .centerpiece-gallery-grid, .scattered-gallery-wrap, .contact-grid, .closing-quote-box'
  );

  revealElements.forEach((el) => el.classList.add('fade-in-up'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.1
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // 5. GALLERY LIGHTBOX MODAL
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const zoomableImgs = document.querySelectorAll('.gallery-zoomable');

  const openLightbox = (imgSrc, altText, captionText) => {
    if (!lightboxModal) return;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = altText || 'Enlarged photo';
    lightboxCaption.textContent = captionText || altText;
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  zoomableImgs.forEach((img) => {
    img.addEventListener('click', () => {
      const src = img.currentSrc || img.src;
      const alt = img.alt;
      const caption = img.getAttribute('data-caption') || alt;
      openLightbox(src, alt, caption);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 6. COPY EMAIL UTILITY
  const copyBtn = document.getElementById('copy-email-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const emailLink = document.getElementById('direct-email-link');

  if (copyBtn && emailLink) {
    copyBtn.addEventListener('click', async () => {
      const email = emailLink.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyBtnText.textContent;
        copyBtnText.textContent = 'Copied!';
        copyBtn.style.backgroundColor = '#C9972B';
        copyBtn.style.color = '#2B1420';

        setTimeout(() => {
          copyBtnText.textContent = originalText;
          copyBtn.style.backgroundColor = '';
          copyBtn.style.color = '';
        }, 2500);
      } catch (err) {
        // Fallback for older browsers or restricted permissions
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        copyBtnText.textContent = 'Copied!';
        setTimeout(() => {
          copyBtnText.textContent = 'Copy';
        }, 2500);
      }
    });
  }

  // 7. CONTACT FORM VALIDATION & INTERACTION
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    const fields = {
      name: document.getElementById('form-name'),
      email: document.getElementById('form-email'),
      topic: document.getElementById('form-topic'),
      message: document.getElementById('form-message')
    };

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!fields.name.value.trim()) {
        fields.name.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        fields.name.closest('.form-group').classList.remove('has-error');
      }

      // Validate Email
      if (!fields.email.value.trim() || !validateEmail(fields.email.value.trim())) {
        fields.email.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        fields.email.closest('.form-group').classList.remove('has-error');
      }

      // Validate Topic
      if (!fields.topic.value) {
        fields.topic.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        fields.topic.closest('.form-group').classList.remove('has-error');
      }

      // Validate Message
      if (!fields.message.value.trim() || fields.message.value.trim().length < 10) {
        fields.message.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        fields.message.closest('.form-group').classList.remove('has-error');
      }

      if (isValid) {
        const submitBtn = document.getElementById('form-submit-btn');
        submitBtn.disabled = true;
        submitBtn.querySelector('span:first-child').textContent = 'Dispatching Message...';

        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.querySelector('span:first-child').textContent = 'Send Message';

          formStatus.className = 'form-status-banner success';
          formStatus.innerHTML = `
            <strong>Thank you, ${fields.name.value || 'friend'}!</strong><br>
            Your message has been sent to Pritam Dutta. A personal reply will be dispatched to your inbox within 24 to 48 hours.
          `;
          formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 800);
      }
    });

    // Clear field error state on input
    Object.values(fields).forEach((field) => {
      if (field) {
        field.addEventListener('input', () => {
          field.closest('.form-group').classList.remove('has-error');
        });
      }
    });
  }

});
