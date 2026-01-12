/**
 * WarriorX Martial Arts - Kharagpur
 * Main JavaScript File
 * Handles navigation, mobile menu, form submissions, and interactive elements
 */

(function() {
    'use strict';

    // ============================================
    // Sticky Navigation
    // ============================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleNavbarScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Initial check

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbar.contains(event.target) && navMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // Smooth Scrolling for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty hash or just #
            if (href === '#' || href === '') {
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Contact Form Handling
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                program: formData.get('program'),
                message: formData.get('message')
            };

            // Basic validation
            if (!data.name || !data.phone || !data.program) {
                alert('Please fill in all required fields.');
                return;
            }

            // Phone number validation (basic)
            const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
            if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
                alert('Please enter a valid phone number.');
                return;
            }

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Hide form and show success message
                contactForm.style.display = 'none';
                const successMessage = document.getElementById('formSuccess');
                if (successMessage) {
                    successMessage.style.display = 'block';
                    
                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Log form data (in production, send to server)
                    console.log('Form submitted:', data);
                    
                    // Optional: Send WhatsApp message
                    const whatsappMessage = `Hi, I'm ${data.name}. I'm interested in ${data.program} program. Phone: ${data.phone}${data.email ? ` Email: ${data.email}` : ''}${data.message ? ` Message: ${data.message}` : ''}`;
                    const whatsappUrl = `https://wa.me/918670455402?text=${encodeURIComponent(whatsappMessage)}`;
                    
                    // You can optionally auto-open WhatsApp
                    // window.open(whatsappUrl, '_blank');
                }

                // Reset button
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

    // ============================================
    // Animate on Scroll
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.benefit-card, .program-card, .testimonial-card, .gallery-item, .faq-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ============================================
    // Gallery Image Modal (Optional Enhancement)
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                // Create modal
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    cursor: pointer;
                    padding: 20px;
                `;

                const modalImg = document.createElement('img');
                modalImg.src = img.src;
                modalImg.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                    border: 2px solid #DC143C;
                    border-radius: 8px;
                `;

                modal.appendChild(modalImg);
                document.body.appendChild(modal);
                document.body.style.overflow = 'hidden';

                // Close modal on click
                modal.addEventListener('click', function() {
                    document.body.removeChild(modal);
                    document.body.style.overflow = '';
                });

                // Close modal on escape key
                const closeModal = (e) => {
                    if (e.key === 'Escape' && document.body.contains(modal)) {
                        document.body.removeChild(modal);
                        document.body.style.overflow = '';
                        document.removeEventListener('keydown', closeModal);
                    }
                };
                document.addEventListener('keydown', closeModal);
            }
        });
    });

    // ============================================
    // Active Navigation Link Highlighting
    // ============================================
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath.split('/').pop() || 
                (currentPath === '/' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    setActiveNavLink();

    // ============================================
    // Phone Number Click to Call Enhancement
    // ============================================
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // On mobile, allow native call
            // On desktop, show confirmation
            if (!/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                const phoneNumber = this.getAttribute('href').replace('tel:', '');
                if (confirm(`Do you want to call ${phoneNumber}?`)) {
                    window.location.href = this.getAttribute('href');
                }
            }
        });
    });

    // ============================================
    // WhatsApp Button Enhancement
    // ============================================
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (whatsappButton) {
        // Add tooltip on hover (desktop)
        whatsappButton.addEventListener('mouseenter', function() {
            this.setAttribute('title', 'Message us on WhatsApp');
        });
    }

    // ============================================
    // Performance: Lazy Load Images
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Scroll to Top Button (Optional)
    // ============================================
    function createScrollToTopButton() {
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '↑';
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #DC143C, #FF1744);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 998;
            box-shadow: 0 4px 15px rgba(220, 20, 60, 0.4);
        `;

        document.body.appendChild(scrollButton);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollButton.style.opacity = '1';
                scrollButton.style.visibility = 'visible';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.visibility = 'hidden';
            }
        });

        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        scrollButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 6px 25px rgba(220, 20, 60, 0.6)';
        });

        scrollButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(220, 20, 60, 0.4)';
        });
    }

    // Create scroll to top button
    createScrollToTopButton();

    // ============================================
    // Console Message
    // ============================================
    console.log('%cWarriorX Martial Arts - Kharagpur', 'color: #DC143C; font-size: 20px; font-weight: bold;');
    console.log('%cBuilding warriors through discipline, respect, and excellence.', 'color: #FFD700; font-size: 14px;');
    console.log('%cContact us: +91 86704 55402 | info@warriorx.com', 'color: #888; font-size: 12px;');

})();
