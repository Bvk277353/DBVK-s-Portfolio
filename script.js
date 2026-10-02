document.addEventListener('DOMContentLoaded', () => {
    // 1. Typewriter Effect
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const words = ['Bala Vardhan.', 'an AI & ML Engineer.', 'a Cloud Developer.'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeAnimation() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(typeAnimation, typeSpeed);
        }

        setTimeout(typeAnimation, 1000);
    }

    // 2. Dynamic Banner Carousel Logic
    const sliderWrapper = document.getElementById('slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('slider-dots');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    if (dotsContainer && totalSlides > 0) {
        dotsContainer.innerHTML = ''; 
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => setSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    const dots = document.querySelectorAll('.dot');

    window.setSlide = function(index) {
        if (totalSlides === 0) return;
        currentSlide = index;
        
        if (sliderWrapper) {
            sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    };

    function autoSlide() {
        if (totalSlides === 0) return;
        currentSlide = (currentSlide + 1) % totalSlides;
        window.setSlide(currentSlide);
    }

    if (sliderWrapper && totalSlides > 1) {
        setInterval(autoSlide, 5000);
    }

    // 3. Portfolio Filter Logic
    const filterChips = document.querySelectorAll('.filter-chip');
    const projectCards = document.querySelectorAll('.project-card');

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const activeChip = document.querySelector('.filter-chip.active');
            if (activeChip) {
                activeChip.classList.remove('active');
            }
            chip.classList.add('active');

            const filterValue = chip.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === cardCategory) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // 4. Contact Modal Logic
    const contactBtn = document.getElementById('contact-btn');
    const modalOverlay = document.getElementById('modal');
    const closeModalBtn = document.getElementById('close-btn');

    if (contactBtn && modalOverlay) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modalOverlay.classList.add('active');
        });
    }

    if (closeModalBtn && modalOverlay) {
        closeModalBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }

    if (modalOverlay) {
        window.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }
});

// 5. Secure Contact Form Deployment Integration (Submits to Render Backend)
// 5. Secure Contact Form Deployment Integration
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');
    const modalOverlay = document.getElementById('modal');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        formStatus.style.color = '#9ca3af';
        formStatus.textContent = 'Sending your message...';

        const formData = {
            from_name: document.getElementById('user-name').value.trim(),
            reply_to: document.getElementById('user-email').value.trim(),
            message: document.getElementById('user-message').value.trim()
        };

        // IMPORTANT:
        // Replace this with the EXACT URL of your Render Web Service.
        const RENDER_BACKEND_URL =
            'https://dbvk-s-portfolio.onrender.com/api/contact';

        try {
            const response = await fetch(RENDER_BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.error || 'Server failed to send the message.'
                );
            }

            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';

            formStatus.style.color = '#10b981';
            formStatus.textContent = 'Message sent successfully!';

            contactForm.reset();

            setTimeout(() => {
                if (modalOverlay) {
                    modalOverlay.classList.remove('active');
                }

                formStatus.textContent = '';
            }, 2000);

        } catch (error) {
            console.error('Relay Endpoint Error:', error);

            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';

            formStatus.style.color = '#ef4444';
            formStatus.textContent =
                'Failed to send message. Please try again.';
        }
    });
});
// 6. Video Playlist Switcher
const playlistBtns = document.querySelectorAll('.playlist-btn');
const mainVideoPlayer = document.getElementById('main-video-player');

playlistBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        playlistBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const videoId = btn.getAttribute('data-video-id');
        if (mainVideoPlayer && videoId) {
            // FIX: Repaired syntax interpolation structure error
            mainVideoPlayer.src = `https://google.com{videoId}/preview`;
        }
    });
});
