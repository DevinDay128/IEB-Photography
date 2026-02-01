/**
 * IEB Photography - Wedding Photography Website
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initTestimonialsSlider();
    initPortfolioFilter();
    initContactForm();
    initScrollAnimations();
    initSmoothScroll();
});

/**
 * Navigation
 * Handles navbar scroll effect and mobile menu toggle
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect for navbar
    function handleScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveLink() {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink);
}

/**
 * Testimonials Slider
 * Handles automatic and manual navigation through testimonials
 */
function initTestimonialsSlider() {
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('testimonialDots');

    if (!track) return;

    const slides = track.querySelectorAll('.testimonial-card');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoPlayInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex < 0) currentIndex = totalSlides - 1;
        if (currentIndex >= totalSlides) currentIndex = 0;
        updateSlider();
        resetAutoPlay();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Pause autoplay on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.addEventListener('mouseleave', startAutoPlay);

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Start autoplay
    startAutoPlay();
}

/**
 * Portfolio Filter
 * Handles filtering of portfolio items by category
 */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;

            portfolioItems.forEach(item => {
                const category = item.dataset.category;

                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Contact Form
 * Handles form validation and submission
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Basic validation
        const firstName = form.querySelector('#firstName').value.trim();
        const lastName = form.querySelector('#lastName').value.trim();
        const email = form.querySelector('#email').value.trim();
        const weddingDate = form.querySelector('#weddingDate').value;

        if (!firstName || !lastName || !email || !weddingDate) {
            showFormError('Please fill in all required fields.');
            return;
        }

        if (!isValidEmail(email)) {
            showFormError('Please enter a valid email address.');
            return;
        }

        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            form.style.display = 'none';
            formSuccess.classList.add('show');

            // Reset form
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Optional: Reset after some time
            setTimeout(() => {
                form.style.display = 'block';
                formSuccess.classList.remove('show');
            }, 10000);
        }, 1500);
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormError(message) {
        // Remove existing error
        const existingError = form.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        // Create and show error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = `
            background-color: #fee2e2;
            color: #dc2626;
            padding: 12px 16px;
            margin-bottom: 20px;
            border-radius: 4px;
            font-size: 0.9rem;
        `;
        errorDiv.textContent = message;

        form.insertBefore(errorDiv, form.firstChild.nextSibling);

        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

/**
 * Scroll Animations
 * Reveals elements as they come into view
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.section');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing after reveal
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        element.classList.add('reveal');
        revealObserver.observe(element);
    });

    // Animate elements within sections
    const animateOnScroll = document.querySelectorAll('.about-image, .service-card, .portfolio-item');

    animateOnScroll.forEach((element, index) => {
        element.style.transitionDelay = `${index * 0.1}s`;
    });
}

/**
 * Smooth Scroll
 * Handles smooth scrolling for anchor links
 */
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Parallax Effect for Hero
 * Creates subtle parallax movement on scroll
 */
function initParallax() {
    const hero = document.querySelector('.hero');

    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });
}

// Initialize parallax
initParallax();

/**
 * Image Lazy Loading
 * Lazy loads images for better performance
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

/**
 * Preloader (Optional)
 * Shows a loading screen while page loads
 */
window.addEventListener('load', function() {
    document.body.classList.add('loaded');

    // Trigger hero animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('animate');
    }
});

/**
 * Keyboard Navigation
 * Improves accessibility for keyboard users
 */
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/**
 * Form Date Validation
 * Sets minimum date to today for wedding date input
 */
const weddingDateInput = document.getElementById('weddingDate');
if (weddingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    weddingDateInput.setAttribute('min', today);
}

/**
 * Console Message
 * Fun message for developers who check the console
 */
console.log('%c IEB Photography ', 'background: #8B7355; color: white; font-size: 20px; padding: 10px 20px; font-family: serif;');
console.log('%c Capturing Love Stories, One Frame at a Time ', 'color: #8B7355; font-size: 14px; font-style: italic;');
