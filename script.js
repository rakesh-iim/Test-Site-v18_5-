// Mobile Navigation Toggle
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  nav.classList.toggle('active');
  document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
}

// Scroll Reveal Animation
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      el.classList.add('active');
    }
  });
}

// Counter Animation
function animateCounters() {
  const counters = [
    { id: 'stat1', target: 500, suffix: '+' },
    { id: 'stat2', target: 450, suffix: '+' },
    { id: 'stat3', target: 8, suffix: '' },
    { id: 'stat4', target: 10, suffix: '+' }
  ];

  counters.forEach(counter => {
    const el = document.getElementById(counter.id);
    if (!el || el.dataset.counted) return;

    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight) return;

    el.dataset.counted = 'true';
    let current = 0;
    const step = Math.max(1, Math.floor(counter.target / 60));
    const interval = setInterval(() => {
      current += step;
      if (current >= counter.target) {
        current = counter.target;
        clearInterval(interval);
      }
      el.textContent = current + counter.suffix;
    }, 25);
  });
}

// Testimonial Slider
let currentSlide = 0;
const totalSlides = 4;
let autoSlideInterval;

function initTestimonialSlider() {
  const nav = document.getElementById('testimonialNav');
  if (!nav) return;

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.onclick = () => goToSlide(i);
    nav.appendChild(dot);
  }

  startAutoSlide();
}

function goToSlide(index) {
  currentSlide = index;
  const track = document.getElementById('testimonialTrack');
  if (!track) return;
  track.style.transform = `translateX(-${index * 100}%)`;

  document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  goToSlide((currentSlide + 1) % totalSlides);
}

function startAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(nextSlide, 5000);
}

// Navbar scroll effect
function handleNavScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.1)';
  } else {
    navbar.style.boxShadow = '0 1px 20px rgba(0,0,0,0.06)';
  }
}

// Contact form handler
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check-circle"></i> Request Submitted!';
  btn.style.background = '#4a8a6f';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 3000);
}

// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// Store Locator Tabs
function initStoreLocator() {
  const tabs = document.querySelectorAll('.locator-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const city = tab.dataset.city;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active card
      document.querySelectorAll('.locator-card').forEach(card => {
        card.classList.remove('active');
      });
      const target = document.getElementById('loc-' + city);
      if (target) target.classList.add('active');
    });
  });
}

// Magnetic Button Effect
function initMagneticButtons() {
  const btns = document.querySelectorAll('.btn');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Calculate magnetic pull strength (e.g., 0.3 for X, 0.5 for Y)
      btn.style.setProperty('--tx', `${x * 0.3}px`);
      btn.style.setProperty('--ty', `${y * 0.5}px`);
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('--tx', `0px`);
      btn.style.setProperty('--ty', `0px`);
    });
  });
}

// Initialize
window.addEventListener('scroll', () => {
  revealOnScroll();
  animateCounters();
  handleNavScroll();
});

window.addEventListener('DOMContentLoaded', () => {
  initTestimonialSlider();
  initStoreLocator();
  initMagneticButtons();
  revealOnScroll();
  animateCounters();
});
