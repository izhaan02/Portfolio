document.addEventListener('DOMContentLoaded', () => {

    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Sticky Navbar Styling
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled-nav');
            navbar.classList.remove('py-4');
        } else {
            navbar.classList.remove('scrolled-nav');
            navbar.classList.add('py-4');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = mobileMenuBtn.querySelector('i');

    function toggleMenu() {
        mobileMenu.classList.toggle('hidden');
        if (mobileMenu.classList.contains('hidden')) {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        } else {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Optional: stop observing once activated
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    revealElements.forEach(el => observer.observe(el));

    // Typewriter Effect
    const typeWriterElement = document.getElementById('typewriter');
    if (typeWriterElement) {
        const words = ["Software Developer", "Data Analyst", "AI Enthusiast"];
        let wordIndex = 0;
        let isDeleting = false;
        let currentText = '';
        
        function type() {
            const fullText = words[wordIndex];
            
            // Handle deleting or adding characters
            if (isDeleting) {
                currentText = fullText.substring(0, currentText.length - 1);
            } else {
                currentText = fullText.substring(0, currentText.length + 1);
            }
            
            typeWriterElement.textContent = currentText;
            
            // Dynamic typing speed
            let typeSpeed = isDeleting ? 40 : 100;
            
            // Pause at end of word or before starting new word
            if (!isDeleting && currentText === fullText) {
                typeSpeed = 2000; // Pause at the end of typing
                isDeleting = true;
            } else if (isDeleting && currentText === '') {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400; // Pause before typing next word
            }
            
            setTimeout(type, typeSpeed);
        }
        
        type();
    }

    // Number Count-Up Animation
    const countElements = document.querySelectorAll('.count-up');
    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseFloat(element.getAttribute('data-target'));
                const isDecimal = element.hasAttribute('data-decimal');
                const duration = 2000; // 2 seconds
                const frameRate = 30; // 30ms per frame
                const totalFrames = duration / frameRate;
                let currentFrame = 0;
                
                // Ease out quad
                const easeOutQuad = t => t * (2 - t);
                
                const counter = setInterval(() => {
                    currentFrame++;
                    const progress = easeOutQuad(currentFrame / totalFrames);
                    const currentVal = target * progress;
                    
                    if (isDecimal) {
                        element.textContent = currentVal.toFixed(1);
                    } else {
                        element.textContent = Math.floor(currentVal);
                    }
                    
                    if (currentFrame >= totalFrames) {
                        clearInterval(counter);
                        if (isDecimal) {
                            element.textContent = target.toFixed(1);
                        } else {
                            element.textContent = target;
                        }
                        
                        // Show the + sign after animation completes
                        const plusSign = element.nextElementSibling;
                        if (plusSign && plusSign.classList.contains('plus-sign')) {
                            plusSign.classList.remove('opacity-0');
                        }
                    }
                }, frameRate);
                
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% visible

    countElements.forEach(el => countObserver.observe(el));

    // Web3Forms Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const btnText = document.getElementById('btn-text');
            const btnIcon = document.getElementById('btn-icon');
            const btnSpinner = document.getElementById('btn-spinner');
            const formStatus = document.getElementById('form-status');
            const statusIcon = document.getElementById('form-status-icon');
            const statusTitle = document.getElementById('form-status-title');
            const statusMsg = document.getElementById('form-status-msg');
            
            // Loading State
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
            btnText.textContent = 'Sending...';
            btnIcon.classList.add('hidden');
            btnSpinner.classList.remove('hidden');
            
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                // Show overlay
                formStatus.classList.remove('hidden');
                formStatus.classList.add('flex');
                
                // Slight delay for opacity transition to trigger
                setTimeout(() => formStatus.classList.remove('opacity-0'), 10);
                
                if (data.success) {
                    statusIcon.className = 'fas fa-check-circle text-5xl text-teal-400 mb-4';
                    statusTitle.textContent = 'Message Sent!';
                    statusMsg.textContent = "Thank you for reaching out. I'll get back to you soon.";
                    contactForm.reset();
                } else {
                    statusIcon.className = 'fas fa-exclamation-circle text-5xl text-red-500 mb-4';
                    statusTitle.textContent = 'Something went wrong';
                    statusMsg.textContent = data.message || "Failed to send message. Please try again.";
                }
            } catch (error) {
                console.error("Form submission error:", error);
                formStatus.classList.remove('hidden');
                formStatus.classList.add('flex');
                setTimeout(() => formStatus.classList.remove('opacity-0'), 10);
                
                statusIcon.className = 'fas fa-exclamation-triangle text-5xl text-orange-500 mb-4';
                statusTitle.textContent = 'Connection Error';
                statusMsg.textContent = "Please check your internet connection and try again.";
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                btnText.textContent = 'Send Message';
                btnIcon.classList.remove('hidden');
                btnSpinner.classList.add('hidden');
            }
        });
        
        // Form Status Reset Overlay
        const resetBtn = document.getElementById('form-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const formStatus = document.getElementById('form-status');
                formStatus.classList.add('opacity-0');
                setTimeout(() => {
                    formStatus.classList.add('hidden');
                    formStatus.classList.remove('flex');
                }, 300);
            });
        }
    }
});
