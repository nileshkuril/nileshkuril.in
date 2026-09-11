// Games data
const gamesData = {
  "games": [
    {
      "title": "Imbalance: Ball Balancing Game",
      "genre": "Physics / Balance / 3D Adventure",
      "description": "Skillfully maneuver your ball on wooden bridges and curved roads while avoiding obstacles and animated enemies in this extreme balancer 3D challenge.",
      "rating": "4.6",
      "downloads": "50K+",
      "features": [
        "Challenging 3D balance physics & unique obstacle paths",
        "Exciting scenic bridges and floating ocean road levels",
        "Smooth & precise 4-button intuitive ball movement",
        "Offline play supported with no time limits"
      ],
      "screenshots": [
        "images/handle-ball-screen-1.png",
        "images/handle-ball-screen-2.png",
        "images/handle-ball-screen-3.png"
      ],
      "playStoreUrl": "https://play.google.com/store/apps/details?id=com.PlayPingStudio.HandleTheBall&hl=en_IN",
      "icon": "images/handle-the-ball.png"
    },
    {
      "title": "Maze and Car : A Puzzle Game",
      "genre": "Brain Puzzle / Labyrinth / 3D Driving",
      "description": "Drive monster trucks, buggies, and futuristic cars through intricate 3D labyrinths. Collect diamonds, unlock doors, and solve challenging maze puzzles.",
      "rating": "4.9",
      "downloads": "1K+",
      "features": [
        "120+ exciting, brain-teasing maze and puzzle levels",
        "Realistic car driving mechanics with smooth controls",
        "Multiple unlockable vehicles including monster trucks & buggies",
        "Vibrant colorful 3D graphics with offline play"
      ],
      "screenshots": [
        "images/maze-car-screen-1.png",
        "images/maze-car-screen-2.png",
        "images/maze-car-screen-3.png"
      ],
      "playStoreUrl": "https://play.google.com/store/apps/details?id=com.playpingstudio.mazeandcar&hl=en_IN",
      "icon": "images/maze-and-car.png"
    }
  ]
};

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const gamesGrid = document.getElementById('gamesGrid');
const gameModal = document.getElementById('gameModal');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderGames();
    setupNavigation();
    setupModal();
    setupSmoothScrolling();
}

// Render games to the grid
function renderGames() {
    if (!gamesGrid) return;
    
    gamesGrid.innerHTML = '';
    
    gamesData.games.forEach((game, index) => {
        const gameCard = createGameCard(game, index);
        gamesGrid.appendChild(gameCard);
    });
}

// Helper to check if icon string is an image URL or path
function isImageUrl(val) {
    return typeof val === 'string' && (
        val.startsWith('http://') ||
        val.startsWith('https://') ||
        val.startsWith('images/') ||
        val.startsWith('./') ||
        val.startsWith('/') ||
        /\.(png|jpg|jpeg|webp|svg|gif)$/i.test(val)
    );
}

// Create individual game card
function createGameCard(game, index) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    // Generate gradient based on index
    const gradients = [
        'linear-gradient(135deg, #1e3a8a, #3b82f6)',
        'linear-gradient(135deg, #065f46, #10b981)',
        'linear-gradient(135deg, #831843, #ec4899)',
        'linear-gradient(135deg, #7c2d12, #f97316)'
    ];
    
    const iconHtml = isImageUrl(game.icon)
        ? `<img src="${game.icon}" alt="${game.title}" style="width: 100px; height: 100px; border-radius: 22px; object-fit: cover; box-shadow: 0 10px 25px rgba(0,0,0,0.35); z-index: 1;">`
        : `<div style="font-size: 60px; z-index: 1;">${game.icon}</div>`;

    card.innerHTML = `
        <div class="game-card__image" style="background: ${gradients[index % gradients.length]}">
            ${iconHtml}
            <div class="game-card__overlay"></div>
        </div>
        <div class="game-card__content">
            <h3 class="game-card__title">${game.title}</h3>
            <div class="game-card__genre">${game.genre}</div>
            <p class="game-card__description">${game.description}</p>
            <div class="game-card__stats">
                <div class="game-stat">
                    <span class="rating">★ ${game.rating}</span>
                </div>
                <div class="game-stat">
                    <span>${game.downloads} downloads</span>
                </div>
            </div>
            <div class="game-card__actions">
                <button class="btn btn--primary btn--small play-store-btn" data-url="${game.playStoreUrl}">
                    Play Store
                </button>
                <button class="btn btn--outline-primary btn--small learn-more-btn" data-game-index="${index}">
                    Learn More
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const playStoreBtn = card.querySelector('.play-store-btn');
    const learnMoreBtn = card.querySelector('.learn-more-btn');
    
    // Play Store button click handler
    playStoreBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (window.StudioAnalytics) {
            window.StudioAnalytics.trackGameClick(game.title, game.playStoreUrl);
        }
        openPlayStore(game.playStoreUrl);
    });
    
    // Learn More button click handler
    learnMoreBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (window.StudioAnalytics) {
            window.StudioAnalytics.trackModalView(game.title);
        }
        openGameModal(game);
    });
    
    // Card click handler (excluding buttons)
    card.addEventListener('click', function(e) {
        // Only open modal if click is not on a button
        if (!e.target.classList.contains('btn') && !e.target.closest('.btn')) {
            if (window.StudioAnalytics) {
                window.StudioAnalytics.trackModalView(game.title);
            }
            openGameModal(game);
        }
    });
    
    return card;
}

// Open game modal with details
function openGameModal(game) {
    if (!gameModal || !modalBody) return;
    
    const modalIconHtml = isImageUrl(game.icon)
        ? `<img src="${game.icon}" alt="${game.title}" style="width: 80px; height: 80px; border-radius: 18px; object-fit: cover; box-shadow: 0 6px 18px rgba(0,0,0,0.25);">`
        : `<div style="font-size: 40px;">${game.icon}</div>`;

    modalBody.innerHTML = `
        <div class="modal-game-header">
            <div class="modal-game-icon" style="margin-bottom: 18px; display: inline-flex;">
                ${modalIconHtml}
            </div>
            <h2 style="margin-bottom: 8px; color: var(--color-text);">${game.title}</h2>
            <div style="color: var(--color-primary); font-weight: 500; margin-bottom: 16px;">${game.genre}</div>
        </div>
        
        <div class="modal-game-stats" style="display: flex; gap: 32px; margin-bottom: 24px; padding: 16px; background: var(--color-secondary); border-radius: 8px;">
            <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 600; color: var(--color-primary);">★ ${game.rating}</div>
                <div style="font-size: 14px; color: var(--color-text-secondary);">Rating</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 600; color: var(--color-primary);">${game.downloads}</div>
                <div style="font-size: 14px; color: var(--color-text-secondary);">Downloads</div>
            </div>
        </div>
        
        <div class="modal-game-description" style="margin-bottom: 24px;">
            <h3 style="margin-bottom: 12px; color: var(--color-text);">About This Game</h3>
            <p style="color: var(--color-text-secondary); line-height: 1.6;">${game.description}</p>
        </div>

        ${game.screenshots && game.screenshots.length ? `
        <div class="modal-game-gallery" style="margin-bottom: 24px;">
            <h3 style="margin-bottom: 12px; color: var(--color-text);">Gameplay Gallery</h3>
            <div class="modal-gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;">
                ${game.screenshots.map(src => `
                    <a href="${src}" target="_blank" rel="noopener noreferrer" class="gallery-thumb" title="Click to view full image" style="display: block; border-radius: 10px; overflow: hidden; border: 1px solid var(--color-border); aspect-ratio: 16/9; background: #000; box-shadow: 0 4px 12px rgba(0,0,0,0.35); transition: transform 0.2s ease, border-color 0.2s ease;">
                        <img src="${src}" alt="${game.title} Gameplay" style="width: 100%; height: 100%; object-fit: cover; display: block;">
                    </a>
                `).join('')}
            </div>
            <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 6px;">Click any screenshot to view full resolution</div>
        </div>
        ` : ''}
        
        <div class="modal-game-features" style="margin-bottom: 32px;">
            <h3 style="margin-bottom: 16px; color: var(--color-text);">Key Features</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${game.features.map(feature => `
                    <li style="display: flex; align-items: center; margin-bottom: 8px; color: var(--color-text-secondary);">
                        <span style="color: var(--color-primary); margin-right: 8px;">✓</span>
                        ${feature}
                    </li>
                `).join('')}
            </ul>
        </div>
        
        <div class="modal-game-actions" style="display: flex; gap: 12px;">
            <button class="btn btn--primary modal-play-store-btn" data-url="${game.playStoreUrl}">
                Download on Play Store
            </button>
            <button class="btn btn--outline modal-close-btn">
                Close
            </button>
        </div>
    `;
    
    // Add event listeners for modal buttons
    const modalPlayStoreBtn = modalBody.querySelector('.modal-play-store-btn');
    const modalCloseBtn = modalBody.querySelector('.modal-close-btn');
    
    if (modalPlayStoreBtn) {
        modalPlayStoreBtn.addEventListener('click', function() {
            if (window.StudioAnalytics) {
                window.StudioAnalytics.trackGameClick(game.title, game.playStoreUrl);
            }
            openPlayStore(game.playStoreUrl);
        });
    }
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeGameModal);
    }
    
    gameModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close game modal
function closeGameModal() {
    if (!gameModal) return;
    
    gameModal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Open Play Store
function openPlayStore(url) {
    if (url && url !== '#') {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

// Setup modal event listeners
function setupModal() {
    if (modalClose) {
        modalClose.addEventListener('click', closeGameModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeGameModal);
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !gameModal.classList.contains('hidden')) {
            closeGameModal();
        }
    });
}

// Setup navigation
function setupNavigation() {
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navToggle && !e.target.closest('.nav__menu') && !e.target.closest('.nav__toggle')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 60) {
            header.style.background = 'rgba(9, 13, 22, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
        } else {
            header.style.background = 'rgba(9, 13, 22, 0.8)';
            header.style.boxShadow = 'none';
        }
    }
});

// Add some interactivity to game cards
document.addEventListener('click', function(e) {
    if (e.target.closest('.game-card') && !e.target.closest('.btn')) {
        const card = e.target.closest('.game-card');
        
        // Add click effect
        card.style.transform = 'translateY(-8px) scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
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
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
window.addEventListener('load', function() {
    const animateElements = document.querySelectorAll('.game-card, .feature, .about__description');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Make functions globally available for any inline handlers (though we're using proper event listeners now)
window.openGameModal = openGameModal;
window.closeGameModal = closeGameModal;
window.openPlayStore = openPlayStore;
