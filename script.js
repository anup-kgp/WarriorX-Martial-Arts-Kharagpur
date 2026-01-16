// ============================================
// WARRIORX MARTIAL ARTS - KHARAGPUR
// Main JavaScript File
// ============================================

// ============================================
// Loading Screen
// ============================================
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        // Add a small delay for smooth transition
        setTimeout(function() {
            loadingScreen.classList.add('hidden');
            // Remove from DOM after animation completes
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 300);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Sticky Navbar
    // ============================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('scrolled');
            return;
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // Mobile Menu Toggle - FRESH START
    // ============================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                // Close menu
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            } else {
                // Open menu
                mobileMenuToggle.classList.add('active');
                navMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            // Only handle if menu is active
            if (!navMenu.classList.contains('active')) {
                return;
            }
            
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            // Close menu if click is outside both menu and toggle button
            if (!isClickInsideMenu && !isClickOnToggle) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
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
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // Active Navigation Link Highlighting
    // ============================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ============================================
    // WhatsApp Integration
    // ============================================
    const phoneNumber = '918670455402';
    const whatsappUrl = `https://wa.me/${phoneNumber}`;

    // Update all WhatsApp links
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(link => {
        link.href = whatsappUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });

    // ============================================
    // Form Handling
    // ============================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const program = formData.get('program');
            const message = formData.get('message');

            // Prepare data for Firebase
            const contactData = {
                name: name,
                phone: phone,
                email: email || '',
                program: program,
                message: message || '',
                timestamp: new Date().toISOString(),
                source: 'website_contact_form'
            };

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton ? submitButton.textContent : '';
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';
            }

            try {
                // Save to Firebase Firestore if available
                if (window.firebaseDb) {
                    try {
                        const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
                        await addDoc(collection(window.firebaseDb, 'contact_queries'), contactData);
                        console.log('Contact form data saved to Firebase successfully');
                    } catch (firebaseError) {
                        console.warn('Firebase save failed, continuing with form submission:', firebaseError);
                        // Continue with form submission even if Firebase fails
                    }
                }

                // Show success message
                const formSuccess = document.getElementById('formSuccess');
                if (formSuccess) {
                    formSuccess.style.display = 'block';
                    contactForm.style.display = 'none';
                } else {
                    alert('Thank you! Your message has been submitted. We will contact you soon.');
                }

                // Track form submission in analytics
                if (window.firebaseAnalytics && window.firebaseLogEvent) {
                    try {
                        window.firebaseLogEvent(window.firebaseAnalytics, 'form_submission', {
                            form_name: 'contact_form',
                            program: program
                        });
                    } catch (analyticsError) {
                        console.warn('Analytics tracking failed:', analyticsError);
                    }
                }

                // Reset form
                contactForm.reset();

            } catch (error) {
                console.error('Error processing contact form:', error);
                
                // Fallback to WhatsApp if everything fails
                const whatsappMessage = `Hello! I'm interested in ${program || 'your programs'}.\n\nName: ${name}\nPhone: ${phone}${email ? `\nEmail: ${email}` : ''}${message ? `\nMessage: ${message}` : ''}`;
                const encodedMessage = encodeURIComponent(whatsappMessage);
                const whatsappFormUrl = `${whatsappUrl}?text=${encodedMessage}`;
                
                window.open(whatsappFormUrl, '_blank');
                alert('Opening WhatsApp to send your message!');
                contactForm.reset();
            } finally {
                // Restore button state
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }
        });
    }

    // ============================================
    // Gallery Image Lazy Loading
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Scroll to Top Button
    // ============================================
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        // Scroll to top when button is clicked
        scrollToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // Console Message
    // ============================================
    console.log('%cWarriorX Martial Arts - Kharagpur', 'color: #DC143C; font-size: 20px; font-weight: bold;');
    console.log('%cBest Karate Classes in Kharagpur!', 'color: #FFD700; font-size: 14px;');
    console.log('%cCall: +91 86704 55402', 'color: #FFFFFF; font-size: 12px;');
});
