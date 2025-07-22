// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.benefits-text, .info-card, .signup-form');
    animateElements.forEach(el => observer.observe(el));
    
    // Handle poster video autoplay and slow motion
    const posterVideo = document.querySelector('.poster-video');
    if (posterVideo) {
        // Set playback rate to 10% (0.1x speed)
        posterVideo.playbackRate = 0.1;
        
        // Ensure autoplay works
        posterVideo.addEventListener('loadedmetadata', () => {
            posterVideo.play().catch(e => {
                console.log('Autoplay prevented:', e);
                // Add a play button if autoplay fails
                const playButton = document.createElement('button');
                playButton.textContent = 'Click to Play Video';
                playButton.className = 'btn btn-primary';
                playButton.style.marginTop = '1rem';
                playButton.onclick = () => {
                    posterVideo.play();
                    playButton.style.display = 'none';
                };
                posterVideo.parentNode.appendChild(playButton);
            });
        });
        
        // Maintain slow speed when video restarts
        posterVideo.addEventListener('play', () => {
            posterVideo.playbackRate = 0.1;
        });
    }
});

// Form validation and submission
const signupForm = document.querySelector('#rsvpForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Get form data for validation
        const name = this.querySelector('#entry\\.1874270200').value;
        const email = this.querySelector('#entry\\.381985886').value;
        const timeSlot = this.querySelector('#entry\\.1424638179').value;
        
        // Simple validation
        if (!name || !email || !timeSlot) {
            showNotification('Please fill in all required fields (Name, Email, and Session Time)', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Prepare form data for Google Forms
        const formData = new FormData(this);
        
        // Google Forms submission URL
        const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdGKE5oAZI6VWfpcTx_0tka-MzYerKny4fhAEZUeI2Bi2QAIA/formResponse';
        
        // Use fetch API for faster submission
        const formDataObj = {};
        for (let [key, value] of formData.entries()) {
            formDataObj[key] = value;
        }
        
        // Submit using fetch with timeout
        const submitPromise = fetch(googleFormUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formDataObj),
            mode: 'no-cors' // Required for Google Forms
        });
        
        // Set a timeout for the submission
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Submission timeout')), 5000);
        });
        
        // Race between submission and timeout
        Promise.race([submitPromise, timeoutPromise])
            .then(() => {
                // Success - show message immediately
                showNotification('Thank you! Your RSVP has been submitted successfully.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            })
            .catch((error) => {
                // Fallback to iframe method if fetch fails
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                
                const hiddenForm = document.createElement('form');
                hiddenForm.method = 'POST';
                hiddenForm.action = googleFormUrl;
                hiddenForm.target = iframe.name;
                
                for (let [key, value] of formData.entries()) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    hiddenForm.appendChild(input);
                }
                
                document.body.appendChild(hiddenForm);
                hiddenForm.submit();
                
                setTimeout(() => {
                    document.body.removeChild(hiddenForm);
                    document.body.removeChild(iframe);
                }, 500);
                
                showNotification('Thank you! Your RSVP has been submitted successfully.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        

    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

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
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .notification-close:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add floating animation to cards
document.addEventListener('DOMContentLoaded', () => {
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 2}s`;
    });
});

// Enhanced form interaction
document.addEventListener('DOMContentLoaded', () => {
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    
    formInputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
        });
        
        // Add character count for textarea
        if (input.tagName === 'TEXTAREA') {
            const charCount = document.createElement('div');
            charCount.className = 'char-count';
            charCount.style.cssText = `
                font-size: 0.8rem;
                color: #718096;
                text-align: right;
                margin-top: 0.25rem;
            `;
            input.parentElement.appendChild(charCount);
            
            input.addEventListener('input', () => {
                const count = input.value.length;
                const maxLength = input.getAttribute('maxlength') || 500;
                charCount.textContent = `${count}/${maxLength}`;
                
                if (count > maxLength * 0.9) {
                    charCount.style.color = '#ef4444';
                } else {
                    charCount.style.color = '#718096';
                }
            });
        }
    });
});

// Session time slot selection enhancement
document.addEventListener('DOMContentLoaded', () => {
    const timeSlotSelect = document.querySelector('#timeSlot');
    if (timeSlotSelect) {
        timeSlotSelect.addEventListener('change', () => {
            const selectedOption = timeSlotSelect.options[timeSlotSelect.selectedIndex];
            if (selectedOption.value) {
                showNotification(`Selected session: ${selectedOption.text}`, 'info');
            }
        });
    }
});

// Mat requirement selection enhancement
document.addEventListener('DOMContentLoaded', () => {
    const matSelect = document.querySelector('#mat');
    if (matSelect) {
        matSelect.addEventListener('change', () => {
            const selectedOption = matSelect.options[matSelect.selectedIndex];
                    if (selectedOption.value === 'need-provided') {
            showNotification('We\'ll have a yoga mat ready for you!', 'info');
        }
        });
    }
});

// Smoothie bar selection enhancement
document.addEventListener('DOMContentLoaded', () => {
    const smoothieSelect = document.querySelector('#smoothie');
    if (smoothieSelect) {
        smoothieSelect.addEventListener('change', () => {
            const selectedOption = smoothieSelect.options[smoothieSelect.selectedIndex];
            if (selectedOption.value === 'yes') {
                showNotification('Great! Don\'t forget to join us for the superfood smoothie bar at 3:00 PM!', 'info');
            }
        });
    }
});

// Add loading state to buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('btn-primary')) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
});

// Enhanced scroll animations
const scrollAnimations = () => {
    const elements = document.querySelectorAll('.session-card, .info-item, .stat');
    elements.forEach((element, index) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initialize scroll animations
window.addEventListener('scroll', scrollAnimations);
document.addEventListener('DOMContentLoaded', scrollAnimations);

// Add initial styles for scroll animations
const style = document.createElement('style');
style.textContent = `
    .session-card, .info-item, .stat {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
`;
document.head.appendChild(style); 