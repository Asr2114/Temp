// ==================== GLOBAL VARIABLES ====================
let noClickCount = 0;
let quizCorrectCount = 0;
let letterState = 'closed'; // closed, open, torn, repaired, kept

// GIF URLs for different states
const gifs = {
    proposal: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd5Y3ZrOWpqNXA0bTFmNHJjNnRyMnp5OGtqaWYyYm5zbGJqYmdubiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MDJ9IbxxvDUQM/giphy.gif',
    angry: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnZxaHBxMGZrYmd0ZWEybGZhNTVhNm5iNHdtdXU4Y3d4dWw1Z3hhbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/12Gyz2J1b9sLgQ/giphy.gif',
    sad: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmVtZnlhdzJtMHBsdWQ2M3c0Zjh3eTM2OHBsenN4eGd1Y241bTZuZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OPU6wzx8JrHna/giphy.gif',
    crying: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGl3Z3U5ejZqMmFwbHFlMzdrNXl5bWt5c3FqeGd3dmt0cTZsOXg2NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L95W4wv8nnb9K/giphy.gif'
};

// ==================== DOM ELEMENTS ====================
const floatingHeartsContainer = document.getElementById('floatingHearts');
const pinkOverlay = document.getElementById('pinkOverlay');
const heartBurst = document.getElementById('heartBurst');

// Proposal Section
const proposalGifImg = document.getElementById('proposalGifImg');
const proposalHeading = document.getElementById('proposalHeading');
const proposalSubtext = document.getElementById('proposalSubtext');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const buttonContainer = document.getElementById('buttonContainer');

// Celebration Section
const celebrationSection = document.getElementById('celebrationSection');
const nicknameSequence = document.getElementById('nicknameSequence');

// Carousel
const carousel = document.getElementById('carousel');
const carouselDots = document.getElementById('carouselDots');

// Letter Section
const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');
const letterButtons = document.getElementById('letterButtons');
const keepBtn = document.getElementById('keepBtn');
const tearBtn = document.getElementById('tearBtn');
const brokenHeartMsg = document.getElementById('brokenHeartMsg');
const feviquickBtn = document.getElementById('feviquickBtn');
const letterHint = document.getElementById('letterHint');
const heartStamp = document.getElementById('heartStamp');

// Quiz
const quizCards = document.querySelectorAll('.quiz-card');
const foreverBtn = document.getElementById('foreverBtn');

// Forever Section
const petalsContainer = document.getElementById('petalsContainer');

// Music
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
let isMusicPlaying = false;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    initCarousel();
    initRevealAnimations();
    initCoupons();
    initQuiz();
    createPetals();
    initMusic();
});

// ==================== BACKGROUND MUSIC ====================
function initMusic() {
    if (!bgMusic || !musicToggle || !musicIcon) {
        console.log('Music elements not found');
        return;
    }
    
    // Set initial volume
    bgMusic.volume = 0.4;
    
    // Initial state - muted
    musicToggle.classList.add('muted');
    
    // Music toggle button click - using event with stopPropagation
    musicToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMusic();
    });
    
    // Also handle touch for mobile
    musicToggle.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMusic();
    });
    
    // Debug: Log when audio can play
    bgMusic.addEventListener('canplaythrough', function() {
        console.log('Audio ready to play');
    });
    
    bgMusic.addEventListener('error', function(e) {
        console.log('Audio error:', e);
    });
}

function toggleMusic() {
    console.log('Toggle clicked, current state:', isMusicPlaying);
    if (isMusicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    console.log('Attempting to play music...');
    
    // Reset audio to start if needed
    if (bgMusic.currentTime > 0) {
        bgMusic.currentTime = 0;
    }
    
    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('Music started playing');
            isMusicPlaying = true;
            musicToggle.classList.add('playing');
            musicToggle.classList.remove('muted');
            musicIcon.textContent = '🎵';
        }).catch(err => {
            console.log('Play error:', err);
            // Try again with user gesture
            isMusicPlaying = false;
            musicToggle.classList.add('muted');
            musicToggle.classList.remove('playing');
            musicIcon.textContent = '🔇';
        });
    }
}

function pauseMusic() {
    console.log('Pausing music');
    bgMusic.pause();
    isMusicPlaying = false;
    musicToggle.classList.remove('playing');
    musicToggle.classList.add('muted');
    musicIcon.textContent = '🔇';
}

// ==================== FLOATING HEARTS BACKGROUND ====================
function createFloatingHearts() {
    const hearts = ['💕', '💖', '💗', '💓', '💝', '💘', '❤️', '🩷', '🤍'];
    
    // Reduce frequency on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    const interval = isMobile ? 800 : 500;
    const maxHearts = isMobile ? 15 : 30;
    let heartCount = 0;
    
    setInterval(() => {
        // Limit total hearts on screen
        if (heartCount >= maxHearts) return;
        
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * (isMobile ? 1 : 1.5) + 0.8) + 'rem';
        heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heart.style.opacity = Math.random() * 0.4 + 0.2;
        
        floatingHeartsContainer.appendChild(heart);
        heartCount++;
        
        setTimeout(() => {
            heart.remove();
            heartCount--;
        }, 20000);
    }, interval);
}

// ==================== PROPOSAL SECTION LOGIC ====================
noBtn.addEventListener('click', handleNoClick);
yesBtn.addEventListener('click', handleYesClick);

function handleNoClick() {
    noClickCount++;
    
    const buttonRect = buttonContainer.getBoundingClientRect();
    
    switch(noClickCount) {
        case 1:
            proposalHeading.textContent = "Are you sure Rakshita? 😡";
            proposalGifImg.src = gifs.angry;
            yesBtn.style.transform = 'scale(1.4)';
            noBtn.style.transform = 'scale(0.9)';
            break;
        case 2:
            proposalHeading.textContent = "Think again my chidiyaa 🥺";
            proposalGifImg.src = gifs.sad;
            yesBtn.style.transform = 'scale(1.8)';
            noBtn.style.transform = 'scale(0.8)';
            moveNoButtonRandomly();
            break;
        case 3:
            proposalHeading.textContent = "Last chance bachaa 😭";
            proposalGifImg.src = gifs.crying;
            yesBtn.style.transform = 'scale(2.3)';
            noBtn.style.transform = 'scale(0.6)';
            noBtn.classList.add('dodging');
            enableCursorDodging();
            break;
        default:
            // After 3 clicks, just dodge
            moveNoButtonRandomly();
            break;
    }
}

function moveNoButtonRandomly() {
    const containerRect = buttonContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    const maxX = containerRect.width - btnRect.width - 20;
    const maxY = containerRect.height - btnRect.height;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * Math.max(50, maxY);
    
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

function enableCursorDodging() {
    buttonContainer.addEventListener('mousemove', dodgeCursor);
    noBtn.addEventListener('mouseenter', () => {
        if (noClickCount >= 3) {
            const containerRect = buttonContainer.getBoundingClientRect();
            const btnRect = noBtn.getBoundingClientRect();
            
            let newX = Math.random() * (containerRect.width - btnRect.width);
            let newY = Math.random() * 100;
            
            noBtn.style.left = newX + 'px';
            noBtn.style.top = newY + 'px';
        }
    });
}

function dodgeCursor(e) {
    if (noClickCount < 3) return;
    
    const containerRect = buttonContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    
    const distance = Math.sqrt(
        Math.pow(e.clientX - btnCenterX, 2) + 
        Math.pow(e.clientY - btnCenterY, 2)
    );
    
    if (distance < 100) {
        let newX = Math.random() * (containerRect.width - btnRect.width);
        let newY = Math.random() * 80;
        
        noBtn.style.left = Math.max(0, newX) + 'px';
        noBtn.style.top = Math.max(0, newY) + 'px';
    }
}

function handleYesClick() {
    // Show pink overlay
    pinkOverlay.classList.add('active');
    
    // Create heart burst
    createHeartBurst();
    
    // Scroll to celebration after animation
    setTimeout(() => {
        pinkOverlay.classList.remove('active');
        celebrationSection.scrollIntoView({ behavior: 'smooth' });
        
        // Start nickname sequence
        setTimeout(() => {
            startNicknameSequence();
        }, 500);
    }, 1500);
}

function createHeartBurst() {
    const hearts = ['💕', '💖', '💗', '💓', '💝', '💘', '❤️'];
    
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('span');
        heart.className = 'burst-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        const angle = (i / 30) * Math.PI * 2;
        const distance = 100 + Math.random() * 200;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        heart.style.setProperty('--tx', tx + 'px');
        heart.style.setProperty('--ty', ty + 'px');
        heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        
        heartBurst.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
}

function startNicknameSequence() {
    const nicknames = nicknameSequence.querySelectorAll('.nickname');
    
    nicknames.forEach((nickname, index) => {
        setTimeout(() => {
            nickname.classList.add('visible');
        }, index * 400);
    });
}

// ==================== CAROUSEL ====================
function initCarousel() {
    const slides = carousel.querySelectorAll('.carousel-slide');
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => scrollToSlide(index));
        dot.addEventListener('touchend', (e) => {
            e.preventDefault();
            scrollToSlide(index);
        });
        carouselDots.appendChild(dot);
    });
    
    // Drag functionality
    let isDragging = false;
    let startX;
    let scrollLeft;
    let startTime;
    let endX;
    
    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        carousel.classList.add('dragging');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    
    carousel.addEventListener('mouseleave', () => {
        isDragging = false;
        carousel.classList.remove('dragging');
    });
    
    carousel.addEventListener('mouseup', () => {
        isDragging = false;
        carousel.classList.remove('dragging');
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
    
    // Enhanced Touch support with momentum
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        startTime = Date.now();
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - carousel.offsetLeft;
        endX = x;
        const walk = (x - startX) * 1.5;
        carousel.scrollLeft = scrollLeft - walk;
    }, { passive: true });
    
    // Snap to nearest slide on touch end
    carousel.addEventListener('touchend', () => {
        const slideWidth = slides[0].offsetWidth + 30;
        const currentIndex = Math.round(carousel.scrollLeft / slideWidth);
        scrollToSlide(currentIndex);
    }, { passive: true });
    
    // Update dots on scroll
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const slideWidth = slides[0].offsetWidth + 30;
            const currentIndex = Math.round(carousel.scrollLeft / slideWidth);
            updateDots(currentIndex);
        }, 50);
    }, { passive: true });
}

function scrollToSlide(index) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const slideWidth = slides[0].offsetWidth + 30;
    carousel.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
    });
}

function updateDots(index) {
    const dots = carouselDots.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// ==================== COUPONS ====================
function initCoupons() {
    const coupons = document.querySelectorAll('.coupon');
    
    coupons.forEach(coupon => {
        const btn = coupon.querySelector('.coupon-btn');
        const type = coupon.dataset.type;
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (coupon.dataset.claimed === 'true') return;
            
            // Play animation based on type
            playAnimation(coupon, type);
            
            // Mark as claimed after animation
            setTimeout(() => {
                coupon.dataset.claimed = 'true';
                coupon.classList.add('claimed');
                createHeartExplosion(coupon);
            }, 800);
        });
    });
}

function playAnimation(coupon, type) {
    const animation = coupon.querySelector('.coupon-animation');
    
    switch(type) {
        case 'hug':
            animation.classList.add('active');
            animation.style.opacity = '1';
            setTimeout(() => {
                animation.classList.remove('active');
                animation.style.opacity = '0';
            }, 1500);
            break;
            
        case 'kiss':
            animation.style.opacity = '1';
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const kiss = document.createElement('span');
                    kiss.className = 'kiss-mark';
                    kiss.textContent = '💋';
                    kiss.style.left = (Math.random() * 80 + 10) + '%';
                    kiss.style.top = (Math.random() * 60 + 20) + '%';
                    animation.appendChild(kiss);
                    
                    setTimeout(() => kiss.remove(), 1000);
                }, i * 100);
            }
            break;
            
        case 'movie':
            animation.style.opacity = '1';
            for (let i = 0; i < 15; i++) {
                const popcorn = document.createElement('span');
                popcorn.className = 'popcorn';
                popcorn.textContent = '🍿';
                popcorn.style.left = '50%';
                popcorn.style.top = '50%';
                popcorn.style.setProperty('--px', (Math.random() * 200 - 100) + 'px');
                popcorn.style.setProperty('--py', (Math.random() * 200 - 100) + 'px');
                animation.appendChild(popcorn);
                
                setTimeout(() => popcorn.remove(), 800);
            }
            break;
            
        case 'call':
            animation.style.opacity = '1';
            animation.style.display = 'flex';
            setTimeout(() => {
                animation.style.opacity = '0';
                animation.style.display = 'none';
            }, 1500);
            break;
            
        case 'forehead':
            animation.style.opacity = '1';
            animation.style.display = 'flex';
            animation.style.alignItems = 'center';
            animation.style.justifyContent = 'center';
            setTimeout(() => {
                animation.style.opacity = '0';
            }, 1500);
            break;
    }
}

function createHeartExplosion(element) {
    const rect = element.getBoundingClientRect();
    const container = document.createElement('div');
    container.className = 'coupon-heart-explosion';
    container.style.left = (rect.left + rect.width / 2) + 'px';
    container.style.top = (rect.top + rect.height / 2) + 'px';
    document.body.appendChild(container);
    
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('span');
        heart.className = 'explosion-heart';
        heart.textContent = '💕';
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        heart.style.setProperty('--ex', Math.cos(angle) * distance + 'px');
        heart.style.setProperty('--ey', Math.sin(angle) * distance + 'px');
        
        container.appendChild(heart);
    }
    
    setTimeout(() => container.remove(), 1000);
}

// ==================== LOVE LETTER ====================
const healedHeartMsg = document.getElementById('healedHeartMsg');

envelope.addEventListener('click', () => {
    if (letterState === 'closed') {
        openEnvelope();
    }
});

function openEnvelope() {
    letterState = 'open';
    
    // Add open class to envelope for flap animation
    envelope.classList.add('open');
    envelope.classList.remove('closing');
    
    // Hide hint with fade
    letterHint.classList.add('hidden');
    
    // Slide letter out with 3D rotation after flap opens
    setTimeout(() => {
        letter.classList.add('visible');
        letter.classList.remove('sliding-back');
        letter.classList.remove('torn');
        letter.classList.remove('repairing');
        letter.classList.remove('repaired');
        
        // Fade in buttons smoothly
        setTimeout(() => {
            letterButtons.classList.add('visible');
        }, 400);
    }, 600);
}

keepBtn.addEventListener('click', () => {
    if (letterState === 'open' || letterState === 'repaired') {
        keepLetter();
    }
});

tearBtn.addEventListener('click', () => {
    if (letterState === 'open' || letterState === 'repaired') {
        tearLetter();
    }
});

feviquickBtn.addEventListener('click', () => {
    if (letterState === 'torn') {
        repairLetter();
    }
});

function keepLetter() {
    letterState = 'keeping';
    
    // Hide buttons smoothly
    letterButtons.classList.remove('visible');
    healedHeartMsg.classList.remove('visible');
    
    // Start letter slide back animation
    setTimeout(() => {
        letter.classList.remove('visible');
        letter.classList.add('sliding-back');
        
        // Close envelope flap after letter slides in
        setTimeout(() => {
            envelope.classList.add('closing');
            envelope.classList.remove('open');
            
            // Heart stamp seal animation after flap closes
            setTimeout(() => {
                heartStamp.classList.add('sealed');
                
                // Reset state after seal animation
                setTimeout(() => {
                    heartStamp.classList.remove('sealed');
                    letter.classList.remove('sliding-back');
                    letterState = 'closed';
                    
                    // Update and show hint
                    letterHint.textContent = 'Safely kept in your heart 💕';
                    letterHint.classList.remove('hidden');
                }, 800);
            }, 600);
        }, 600);
    }, 200);
}

function tearLetter() {
    letterState = 'torn';
    
    // Hide buttons smoothly
    letterButtons.classList.remove('visible');
    healedHeartMsg.classList.remove('visible');
    
    // Add torn class for shake and split animation
    letter.classList.add('torn');
    
    // Show broken heart message after tear animation
    setTimeout(() => {
        brokenHeartMsg.classList.add('visible');
    }, 600);
}

function repairLetter() {
    letterState = 'repairing';
    
    // Hide broken heart message
    brokenHeartMsg.classList.remove('visible');
    
    // Start repair animation - pieces come back together with glow
    setTimeout(() => {
        letter.classList.remove('torn');
        letter.classList.add('repairing');
        
        // Show healed message during glow
        setTimeout(() => {
            healedHeartMsg.classList.add('visible');
            
            // Complete repair and show buttons again
            setTimeout(() => {
                letter.classList.remove('repairing');
                letter.classList.add('repaired');
                letterState = 'repaired';
                
                // Hide healed message and show buttons
                setTimeout(() => {
                    healedHeartMsg.classList.remove('visible');
                    letterButtons.classList.add('visible');
                }, 1500);
            }, 600);
        }, 400);
    }, 300);
}

// ==================== QUIZ ====================
function initQuiz() {
    quizCards.forEach(card => {
        const options = card.querySelectorAll('.quiz-option');
        const correctIndex = parseInt(card.dataset.correct);
        const correctFeedback = card.querySelector('.correct-feedback');
        const wrongFeedback = card.querySelector('.wrong-feedback');
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                if (card.dataset.answered === 'true') return;
                
                const selectedIndex = parseInt(option.dataset.index);
                
                if (selectedIndex === correctIndex) {
                    option.classList.add('correct');
                    correctFeedback.classList.add('visible');
                    card.dataset.answered = 'true';
                    quizCorrectCount++;
                    
                    // Disable other options
                    options.forEach(opt => {
                        opt.style.pointerEvents = 'none';
                    });
                    
                    checkAllQuizComplete();
                } else {
                    option.classList.add('wrong');
                    wrongFeedback.classList.add('visible');
                    
                    setTimeout(() => {
                        option.classList.remove('wrong');
                        wrongFeedback.classList.remove('visible');
                    }, 1500);
                }
            });
        });
    });
}

function checkAllQuizComplete() {
    if (quizCorrectCount === 3) {
        setTimeout(() => {
            foreverBtn.classList.add('visible');
        }, 500);
    }
}

foreverBtn.addEventListener('click', () => {
    document.getElementById('foreverSection').scrollIntoView({ behavior: 'smooth' });
});

// ==================== PETALS ====================
function createPetals() {
    const petals = ['🌸', '🌺', '🌷', '💮', '🏵️'];
    
    // Reduce frequency on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    const interval = isMobile ? 600 : 400;
    const maxPetals = isMobile ? 10 : 20;
    let petalCount = 0;
    
    setInterval(() => {
        if (petalCount >= maxPetals) return;
        
        const petal = document.createElement('span');
        petal.className = 'petal';
        petal.textContent = petals[Math.floor(Math.random() * petals.length)];
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.fontSize = (Math.random() * (isMobile ? 0.8 : 1) + 1) + 'rem';
        petal.style.animationDuration = (Math.random() * 5 + 8) + 's';
        
        petalsContainer.appendChild(petal);
        petalCount++;
        
        setTimeout(() => {
            petal.remove();
            petalCount--;
        }, 13000);
    }, interval);
}

// ==================== REVEAL ANIMATIONS ====================
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-element');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// ==================== SMOOTH SCROLL FOR INTERNAL LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ==================== PRELOAD GIFS ====================
Object.values(gifs).forEach(url => {
    const img = new Image();
    img.src = url;
});
